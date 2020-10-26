"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = require("websocket");
var zlib_1 = __importDefault(require("zlib"));
var User_1 = __importDefault(require("../Structures/User"));
var Guild_1 = __importDefault(require("../Structures/Guild"));
var Message_1 = __importDefault(require("../Structures/Message"));
var seq = null;
var handler = function (data, bot, token, connection) {
    seq = data.s || null;
    if (data.op == 10) {
        setInterval(function () { return connection.send(JSON.stringify({
            op: 1,
            d: seq,
        })); }, data.d.heartbeat_interval);
    }
    switch (data.t) {
        case 'READY':
            bot.user = new User_1.default(data.d.user, bot, token);
            return bot.emit('ready');
        case 'MESSAGE_CREATE':
            new Message_1.default(data.d, bot, token);
            break;
        case 'GUILD_CREATE':
            new Guild_1.default(data.d, bot, token);
            break;
    }
};
var Bot = /** @class */ (function () {
    function Bot() {
        this.user = new User_1.default({}, this, '');
        this.guilds = [];
        this.handlers = {};
    }
    /**
     * @description Connects the bot
     * @param {string} token Your bot token
     */
    Bot.prototype.connect = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.connection)
                return reject('Already authenticated.');
            var client = new websocket_1.client();
            client.connect('wss://gateway.discord.gg/?v=6&encoding=json');
            client.on('connect', function (connection) {
                _this.connection = connection;
                connection.send(JSON.stringify({
                    op: 2,
                    d: {
                        token: token,
                        intents: 32509,
                        properties: {
                            $os: 'linux',
                            $browser: 'disco',
                            $device: 'disco',
                        },
                        compress: true,
                        large_threshold: 250,
                        guild_subscriptions: false,
                        shard: [0, 1],
                    },
                }));
                connection.on('message', function (data) {
                    if (data.utf8Data) {
                        var res = JSON.parse(data.utf8Data);
                        handler(res, _this, token, connection);
                        if (res.t === 'READY')
                            resolve();
                    }
                    if (data.binaryData) {
                        zlib_1.default.unzip(data.binaryData, function (err, buffer) {
                            if (err)
                                return reject(err);
                            var res = JSON.parse(buffer.toString('utf-8'));
                            handler(res, _this, token, connection);
                            if (res.t === 'READY')
                                resolve();
                        });
                    }
                });
                connection.on('close', function (code, desc) {
                    _this.emit('error', {
                        code: code,
                        message: desc,
                    });
                });
            });
        });
    };
    /**
     * @description Update the bot's activity
     * @param {Presence} presence Presence object
     * @example ```js
     * bot.setPresence({ name: 'New Presence', type: 'watching', status: 'idle' })
     * ```
     */
    Bot.prototype.setPresence = function (presence) {
        var _a;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            op: 3,
            d: {
                since: 0,
                activities: [
                    {
                        name: presence.name,
                        type: ['playing', 'streaming', 'listening', 'watching'].indexOf(presence.type || 'playing') || 0,
                    },
                ],
                status: presence.status || 'online',
                afk: false,
            }
        }));
    };
    /**
     * @description Listen for a specific event
     * @param eventName The name of the event to listen to
     * @param handler The function to run when this event is fired
     * @example ```js
     * bot.on('guildCreate', guild => console.log(guild.name));
     * ```
     */
    Bot.prototype.on = function (eventName, handler) {
        if (!this.handlers[eventName])
            this.handlers[eventName] = [];
        this.handlers[eventName].push(handler);
    };
    /**
     * @description Fire a specific event
     * @param eventName The name of the event to fire
     * @param data The data to bind to this event
     * @example ```js
     * bot.emit('error', { code: 123, message: 'My custom error' });
     * ```
     * You can now listen to this event
     * ```js
     * bot.on('error', err => console.log(err.message));
     * ```
     */
    Bot.prototype.emit = function (eventName, data) {
        if (!this.handlers[eventName])
            this.handlers[eventName] = [];
        this.handlers[eventName].forEach(function (handler) { return handler(data); });
    };
    return Bot;
}());
exports.default = Bot;
