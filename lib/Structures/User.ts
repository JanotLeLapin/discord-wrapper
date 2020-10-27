import Bot from '../Bot/Bot';

import DMChannel from './DMChannel';
import Message from './Message';

import Embed, { EmbedObject } from './Embed';

const baseUrl = 'https://discord.com/api/users/';

type premiumType = 0 | 1 | 2;

export default class User {
    protected b:     Bot;

    id:            string;
    username:      string;
    discriminator: string;
    avatar:        string;
    bot?:          boolean;
    system?:       boolean;
    mfaEnabled?:   boolean;
    locale?:       string;
    verified?:     boolean;
    email?:        string;
    flags?:        number;
    premiumType?:  premiumType;
    publicFlags?:  number;

    constructor (data: any, bot: Bot) {
        this.b = bot;

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
    avatarURL () {
        return 'https://cdn.discordapp.com/avatars/' + this.id + '/' + this.avatar;
    }

    /**
     * @description Send a message to the user
     * @param {string} message The message to send
     */
    send (message: string | Embed | EmbedObject): Promise<Message> {
        return new Promise((resolve, reject) => {
            this.b.request('POST', baseUrl + '@me/channels', {
                recipient_id: this.id,
            })
                .then(dm => {
                    new DMChannel(dm, this.b).send(message)
                        .then(reply => resolve(reply))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }
}