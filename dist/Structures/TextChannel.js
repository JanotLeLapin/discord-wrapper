"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextChannelBase = void 0;
var axios_1 = __importDefault(require("axios"));
var baseUrl = 'https://discord.com/api/channels/';
var Channel_1 = __importDefault(require("./Channel"));
var Embed_1 = __importDefault(require("./Embed"));
var Message_1 = __importDefault(require("./Message"));
var TextChannelBase = /** @class */ (function (_super) {
    __extends(TextChannelBase, _super);
    function TextChannelBase(data, bot, token) {
        var _this = _super.call(this, data, bot, token) || this;
        _this.lastMessageID = data.last_message_id;
        return _this;
    }
    /**
     * @description Sends a message to the channel
     * @param {string} message The message to send
     */
    TextChannelBase.prototype.send = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var embed;
            if (message instanceof Embed_1.default)
                embed = message.data;
            else if (typeof message == 'object')
                embed = message;
            axios_1.default.post(baseUrl + _this.id + '/messages', {
                content: embed ? null : message,
                embed: embed ? embed : {},
            }, {
                headers: {
                    Authorization: 'Bot ' + _this.token,
                }
            })
                .then(function (reply) { return resolve(new Message_1.default(reply.data, _this.b, _this.token)); })
                .catch(function (err) { return reject(err.response); });
        });
    };
    TextChannelBase.prototype.bulkDelete = function (amount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            axios_1.default.get(baseUrl + _this.id + '/messages?limit=' + amount, {
                headers: {
                    Authorization: 'Bot ' + _this.token,
                },
            })
                .then(function (res) { return axios_1.default.post(baseUrl + _this.id + '/messages/bulk-delete', {
                messages: res.data.map(function (message) { return message.id; }),
            }, {
                headers: {
                    Authorization: 'Bot ' + _this.token,
                },
            })
                .then(function () { return resolve(); })
                .catch(function (err) { return reject(err.response); }); })
                .catch(function (err) { return reject(err.response); });
        });
    };
    return TextChannelBase;
}(Channel_1.default));
exports.TextChannelBase = TextChannelBase;
var TextChannel = /** @class */ (function (_super) {
    __extends(TextChannel, _super);
    function TextChannel(data, bot, token) {
        var _this = _super.call(this, data, bot, token) || this;
        _this.guildID = data.guild_id;
        _this.name = data.name;
        _this.position = data.position;
        _this.permissionOverwrites = data.permission_overwrites;
        _this.rateLimitPerUser = data.rate_limit_per_user;
        _this.nsfw = data.nsfw;
        _this.topic = data.topic;
        _this.parentID = data.parent_id;
        return _this;
    }
    return TextChannel;
}(TextChannelBase));
exports.default = TextChannel;
