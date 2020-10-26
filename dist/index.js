"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bot_1 = __importDefault(require("./Bot/Bot"));
var User_1 = __importDefault(require("./Structures/User"));
var Guild_1 = __importDefault(require("./Structures/Guild"));
var Channel_1 = __importDefault(require("./Structures/Channel"));
var Message_1 = __importDefault(require("./Structures/Message"));
exports.default = {
    Bot: Bot_1.default,
    User: User_1.default,
    Guild: Guild_1.default,
    Channel: Channel_1.default,
    Message: Message_1.default,
};
