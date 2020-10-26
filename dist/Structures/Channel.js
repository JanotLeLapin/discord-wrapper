"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Channel = /** @class */ (function () {
    function Channel(data, bot, token) {
        this.b = bot;
        this.token = token;
        this.id = data.id;
    }
    return Channel;
}());
exports.default = Channel;
