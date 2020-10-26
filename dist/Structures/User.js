"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var DMChannel_1 = __importDefault(require("./DMChannel"));
var baseUrl = 'https://discord.com/api/users/';
var User = /** @class */ (function () {
    function User(data, bot, token) {
        this.b = bot;
        this.token = token;
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.bot = data.bot || false;
        this.system = data.system || false;
        this.mfaEnabled = data.mfa_enabled || false;
        this.locale = data.locale;
        this.verified = data.verified || false;
        this.email = data.email;
        this.flags = data.flags;
        this.premiumType = data.premiumType;
        this.publicFlags = data.publicFlags;
    }
    /**
     * @description The avatar url obtained from the user ID and avatar hash
     */
    User.prototype.avatarURL = function () {
        return 'https://cdn.discordapp.com/avatars/' + this.id + '/' + this.avatar;
    };
    /**
     * @description Send a message to the user
     * @param {string} message The message to send
     */
    User.prototype.send = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            axios_1.default.post(baseUrl + '@me/channels', {
                recipient_id: _this.id,
            }, {
                headers: {
                    Authorization: 'Bot ' + _this.token,
                },
            })
                .then(function (dm) {
                new DMChannel_1.default(dm.data, _this.b, _this.token).send(message)
                    .then(function (reply) { return resolve(reply); })
                    .catch(function (err) { return reject(err.response); });
            })
                .catch(function (err) { return reject(err); });
        });
    };
    return User;
}());
exports.default = User;
