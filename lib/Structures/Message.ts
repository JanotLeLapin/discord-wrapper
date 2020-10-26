import axios from 'axios';

import Bot from '../Bot/Bot';

import User from './User';
import TextChannel from './TextChannel';

const baseUrl = 'https://discord.com/api/channels/';

export interface Reaction {
    count: number;
    me:    boolean;
    emoji: Emoji;
}

export interface Emoji {
    id:   null;
    name: string;
}

export interface CrosspostMessage {
    channelId: string;
    guildId:   string;
    messageId: string;
}


export default class Message {
    protected b:     Bot;
    protected token: string;

    reactions:        Reaction[];
    attachments:      any[];
    tts:              boolean;
    embeds:           any[];
    timestamp:        string;
    mentionEveryone:  boolean;
    id:               string;
    pinned:           boolean;
    editedTimestamp:  any;
    author:           User;
    mentionRoles:     any[];
    content:          string;
    channel:          TextChannel;
    mentions:         any[];
    type:             number;
    messageReference: CrosspostMessage;

    constructor (data: any, bot: Bot, token: string) {
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
        this.author = new User(data.author, bot, token);
        this.mentionRoles = data.mention_roles;
        this.content = data.content;
        this.channel = new TextChannel({ id: data.channel_id }, bot, token);
        this.mentions = data.mentions;
        this.type = data.type;
        this.messageReference = data.message_reference || {};

        axios.get(baseUrl + this.channel.id, {
            headers: {
                Authorization: 'Bot ' + token,
            },
        })
            .then(channel => {
                this.channel = new TextChannel(channel.data, bot, token);
                bot.emit('message', this);
            })
            .catch(err => this.b.emit('error', {
                code: err.response.status,
                message: err.response.statusText,
            }));
    }

    /**
     * @description Replies to the message
     * @param {string} message The message to send
     */
    reply (message: string): Promise<Message> {
        return new Promise((resolve, reject) => {
            axios.post(baseUrl + this.channel.id + '/messages', {
                content: message,
                tts: false,
                embed: {},
            }, {
                headers: {
                    Authorization: 'Bot ' + this.token,
                },
            })
                .then(reply => resolve(new Message(reply.data, this.b, this.token)))
                .catch(err => reject(err.response));
        })
    }

    /**
     * @description Deletes the message
     */
    delete (): Promise<void> {
        return new Promise((resolve, reject) => {
            axios.delete(baseUrl + this.channel.id + '/messages/' + this.id, {
                headers: {
                    Authorization: 'Bot ' + this.token,
                },
            })
                .then(() => resolve())
                .catch(err => reject(err.response));
        })
    }
}