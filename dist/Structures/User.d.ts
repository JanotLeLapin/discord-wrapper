import Bot from '../Bot/Bot';
import Message from './Message';
import Embed, { EmbedObject } from './Embed';
declare type premiumType = 0 | 1 | 2;
export default class User {
    protected b: Bot;
    protected token: string;
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    bot?: boolean;
    system?: boolean;
    mfaEnabled?: boolean;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premiumType?: premiumType;
    publicFlags?: number;
    constructor(data: any, bot: Bot, token: string);
    /**
     * @description The avatar url obtained from the user ID and avatar hash
     */
    avatarURL(): string;
    /**
     * @description Send a message to the user
     * @param {string} message The message to send
     */
    send(message: string | Embed | EmbedObject): Promise<Message>;
}
export {};
