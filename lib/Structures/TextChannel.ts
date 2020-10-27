const baseUrl = 'https://discord.com/api/channels/';

import Bot from '../Bot/Bot';

import Channel from './Channel';
import Embed, { EmbedObject } from './Embed';
import Message from './Message';

export class TextChannelBase extends Channel {
    lastMessageID: string;

    constructor (data: any, bot: Bot) {
        super(data, bot);

        this.lastMessageID = data.last_message_id;
    }

    /**
     * @description Sends a message to the channel
     * @param {string} message The message to send
     */
    send (message: string | Embed | EmbedObject): Promise<Message> {
        return new Promise((resolve, reject) => {
            let embed;
            if (message instanceof Embed) embed = message.data;
            else if (typeof message == 'object') embed = message;
            this.b.request('POST', baseUrl + this.id + '/messages', {
                content: embed ? null : message,
                embed: embed ? embed: null,
            })
                .then(reply => resolve(new Message(reply, this.b)))
                .catch(err => reject(err));
        })
    }

    bulkDelete (amount: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.b.request('GET', baseUrl + this.id + '/messages?limit=' + amount)
                .then(res => this.b.request('POST', baseUrl + this.id + '/messages/bulk-delete', {
                    message: res.map((message: any) => message.id),
                })
                    .then(() => resolve())
                    .catch(err => reject(err)))
                .catch(err => reject(err));
        })
    }
}

export default class TextChannel extends TextChannelBase {
    guildID:              string;
    name:                 string;
    position:             number;
    permissionOverwrites: any[];
    rateLimitPerUser:     number;
    nsfw:                 boolean;
    topic:                string;
    parentID:             string;

    constructor (data: any, bot: Bot) {
        super(data, bot);

        this.guildID = data.guild_id;
        this.name = data.name;
        this.position = data.position;
        this.permissionOverwrites = data.permission_overwrites;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.nsfw = data.nsfw
        this.topic = data.topic;
        this.parentID = data.parent_id;
    }
}