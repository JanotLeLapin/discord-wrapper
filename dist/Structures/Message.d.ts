import Bot from '../Bot/Bot';
import User from './User';
import TextChannel from './TextChannel';
export interface Reaction {
    count: number;
    me: boolean;
    emoji: Emoji;
}
export interface Emoji {
    id: null;
    name: string;
}
export interface CrosspostMessage {
    channelId: string;
    guildId: string;
    messageId: string;
}
export default class Message {
    protected b: Bot;
    protected token: string;
    reactions: Reaction[];
    attachments: any[];
    tts: boolean;
    embeds: any[];
    timestamp: string;
    mentionEveryone: boolean;
    id: string;
    pinned: boolean;
    editedTimestamp: any;
    author: User;
    mentionRoles: any[];
    content: string;
    channel: TextChannel;
    mentions: any[];
    type: number;
    messageReference: CrosspostMessage;
    constructor(data: any, bot: Bot, token: string);
    /**
     * @description Replies to the message
     * @param {string} message The message to send
     */
    reply(message: string): Promise<Message>;
    /**
     * @description Deletes the message
     */
    delete(): Promise<void>;
}
