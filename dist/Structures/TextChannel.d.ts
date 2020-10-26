import Bot from '../Bot/Bot';
import Channel from './Channel';
import Embed, { EmbedObject } from './Embed';
import Message from './Message';
export declare class TextChannelBase extends Channel {
    lastMessageID: string;
    constructor(data: any, bot: Bot, token: string);
    /**
     * @description Sends a message to the channel
     * @param {string} message The message to send
     */
    send(message: string | Embed | EmbedObject): Promise<Message>;
    bulkDelete(amount: number): Promise<void>;
}
export default class TextChannel extends TextChannelBase {
    guildID: string;
    name: string;
    position: number;
    permissionOverwrites: any[];
    rateLimitPerUser: number;
    nsfw: boolean;
    topic: string;
    parentID: string;
    constructor(data: any, bot: Bot, token: string);
}
