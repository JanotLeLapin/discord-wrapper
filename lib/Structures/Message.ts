import Bot from '../Bot/Bot';

import User from './User';
import TextChannel from './TextChannel';

import Embed, { EmbedObject } from './Embed';
import Member from './Member';

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
    channelID: string;
    guildID:   string;
    messageID: string;
}


export default class Message {
    protected b:     Bot;

    reactions:        Reaction[];
    attachments:      any[];
    tts:              boolean;
    embeds:           any[];
    timestamp:        string;
    mentionEveryone:  boolean;
    id:               string;
    pinned:           boolean;
    editedTimestamp:  any;
    channel:          TextChannel;
    author:           User;
    member:           Member;
    mentionRoles:     any[];
    content:          string;
    mentions:         any[];
    type:             number;
    messageReference: CrosspostMessage;

    constructor (data: any, bot: Bot) {
        this.b = bot;

        this.reactions = data.reactions;
        this.attachments = data.attachments;
        this.tts = data.tts;
        this.embeds = data.embeds;
        this.timestamp = data.timestamp;
        this.mentionEveryone = data.mention_everyone;
        this.id = data.id;
        this.pinned = data.pinned;
        this.channel = new TextChannel({ id: data.channel_id }, bot);
        this.author = new User(data.author, bot);
        this.member = new Member({ id: this.author.id }, this.channel.guild, bot);
        this.mentionRoles = data.mention_roles;
        this.content = data.content;
        this.mentions = data.mentions;
        this.type = data.type;
        this.messageReference = data.message_reference || {};

        bot.request('GET', baseUrl + this.channel.id)
            .then(channel => {
                this.channel = new TextChannel(channel, bot);
                if (this.channel.guild) bot.request('GET', 'https://discord.com/api/guilds/' + this.channel.guild.id + '/members/' + this.author.id)
                    .then(member => {
                        this.member = new Member(member, this.channel.guild, bot);
                        if (bot.commands.commands.map(c => c.options.prefix).includes(this.content.split('').shift() || '')) {
                            const args = this.content.split(' ');
                            const command = args.shift();
                            const cmd = bot.commands.commands.find(c => command?.endsWith(c.options.name) && command.startsWith(c.options.prefix) && command.length === (c.options.name + c.options.prefix).length);
                            if (cmd) cmd.run(this, args);
                        }
                        bot.emit('message', this);
                    })
                    .catch(err => { throw err });
            })
            .catch(err => { throw err });
    }

    /**
     * @description Replies to the message
     * @param {string} message The message to send
     */
    reply (message: string | Embed | EmbedObject): Promise<Message> {
        return new Promise((resolve, reject) => {
            let embed;
            if (message instanceof Embed) embed = message.data;
            else if (typeof message == 'object') embed = message;
            if (embed?.color && typeof embed.color == 'string') embed.color = parseInt(embed.color.replace('#', ''), 16);

            this.b.request('POST', baseUrl + this.channel.id + '/messages', {
                content: embed ? null : message,
                embed: embed ? embed : null,
            })
                .then(reply => resolve(new Message(reply, this.b)))
                .catch(err => reject(err));
        })
    }

    /**
     * @description Deletes the message
     */
    delete (): Promise<void> {
        return new Promise((resolve, reject) => {
            this.b.request('DELETE', baseUrl + this.channel.id + '/messages/' + this.id)
                .then(() => resolve())
                .catch(err => reject(err));
        })
    }
}