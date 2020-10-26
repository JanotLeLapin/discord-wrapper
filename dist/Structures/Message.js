"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var User_1 = __importDefault(require("./User"));
var TextChannel_1 = __importDefault(require("./TextChannel"));
var baseUrl = 'https://discord.com/api/channels/';
var Message = /** @class */ (function () {
    function Message(data, bot, token) {
        var _this = this;
        this.b = bot;
        this.token = token;
        this.reactions = data.reactions;
        this.attachments = data.attachments;
        this.tts = data.tts;
        this.embeds = data.embeds;
        this.timestamp = data.timestamp;
        this.mentionEveryone = data.mention_everyone;
        this.id = data.id;
        this.pinned = data.pinned;
        this.author = new User_1.default(data.author, bot, token);
        this.mentionRoles = data.mention_roles;
        this.content = data.content;
        this.channel = new TextChannel_1.default({ id: data.channel_id }, bot, token);
        this.mentions = data.mentions;
        this.type = data.type;
        this.messageReference = data.message_reference || {};
        axios_1.default.get(baseUrl + this.channel.id, {
            headers: {
                Authorization: 'Bot ' + token,
            },
        })
            .then(function (channel) {
            _this.channel = new TextChannel_1.default(channel.data, bot, token);
            bot.emit('message', _this);
        })
            .catch(function (err) { return _this.b.emit('error', {
            code: err.response.status,
            message: err.response.statusText,
        }); });
    }
    /**
     * @description Replies to the message
     * @param {string} message The message to send
     */
    Message.prototype.reply = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            axios_1.default.post(baseUrl + _this.channel.id + '/messages', {
                content: message,
                tts: false,
                embed: {},
            }, {
                headers: {
                    Authorization: 'Bot ' + _this.token,
                },
            })
                .then(function (reply) { return resolve(new Message(reply.data, _this.b, _this.token)); })
                .catch(function (err) { return reject(err.response); });
        });
    };
    /**
     * @description Deletes the message
     */
    Message.prototype.delete = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            axios_1.default.delete(baseUrl + _this.channel.id + '/messages/' + _this.id, {
                headers: {
                    Authorization: 'Bot ' + _this.token,
                },
            })
                .then(function () { return resolve(); })
                .catch(function (err) { return reject(err.response); });
        });
    };
    return Message;
}());
exports.default = Message;
