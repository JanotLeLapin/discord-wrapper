import axios from 'axios';

const baseUrl = 'https://discord.com/api/channels/';

import Bot from '../Bot/Bot';

import Channel from './Channel';
import Message from './Message';

export class TextChannelBase extends Channel {
    lastMessageID: string;

    constructor (data: any, bot: Bot, token: string) {
        super(data, bot, token);

        this.lastMessageID = data.last_message_id;
    }

    /**
     * @description Sends a message to the channel
     * @param {string} message The message to send
     */
    send (message: string): Promise<Message> {
        return new Promise((resolve, reject) => {
            axios.post(baseUrl + this.id + '/messages', {
                content: message,
            }, {
                headers: {
                    Authorization: 'Bot ' + this.token,
                }
            })
                .then(reply => resolve(new Message(reply.data, this.b, this.token)))
                .catch(err => reject(err.response));
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

    constructor (data: any, bot: Bot, token: string) {
        super(data, bot, token);

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