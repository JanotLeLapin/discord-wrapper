import Bot from '../Bot/Bot';

import Guild from './Guild';

const baseUrl = 'https://discord.com/api/guilds/';

export type permission = 'CREATE_INSTANT_INVITE'
| 'KICK_MEMBERS'
| 'BAN_MEMBERS'
| 'ADMINISTRATOR'
| 'MANAGE_CHANNELS'
| 'MANAGE_GUILD'
| 'ADD_REACTIONS'
| 'VIEW_AUDIT_LOG'
| 'PRIORITY_SPEAKER'
| 'STREAM'
| 'VIEW_CHANNEL'
| 'SEND_MESSAGES'
| 'SEND_TTS_MESSAGES'
| 'MANAGE_MESSAGES'
| 'EMBED_LINKS'
| 'ATTACH_FILES'
| 'READ_MESSAGE_HISTORY'
| 'MENTION_EVERYONE'
| 'USE_EXTERNAL_EMOJIS'
| 'VIEW_GUILD_INSIGHTS'
| 'CONNECT'
| 'SPEAK'
| 'MUTE_MEMBERS'
| 'DEAFEN_MEMBERS'
| 'MOVE_MEMBERS'
| 'USE_VAD'
| 'CHANGE_NICKNAME'
| 'MANAGE_NICKNAMES'
| 'MANAGE_ROLES'
| 'MANAGE_WEBHOOKS'
| 'MANAGE_EMOJIS';

export const permissions: permission[] = ['CREATE_INSTANT_INVITE'
, 'KICK_MEMBERS'
, 'BAN_MEMBERS'
, 'ADMINISTRATOR'
, 'MANAGE_CHANNELS'
, 'MANAGE_GUILD'
, 'ADD_REACTIONS'
, 'VIEW_AUDIT_LOG'
, 'PRIORITY_SPEAKER'
, 'STREAM'
, 'VIEW_CHANNEL'
, 'SEND_MESSAGES'
, 'SEND_TTS_MESSAGES'
, 'MANAGE_MESSAGES'
, 'EMBED_LINKS'
, 'ATTACH_FILES'
, 'READ_MESSAGE_HISTORY'
, 'MENTION_EVERYONE'
, 'USE_EXTERNAL_EMOJIS'
, 'VIEW_GUILD_INSIGHTS'
, 'CONNECT'
, 'SPEAK'
, 'MUTE_MEMBERS'
, 'DEAFEN_MEMBERS'
, 'MOVE_MEMBERS'
, 'USE_VAD'
, 'CHANGE_NICKNAME'
, 'MANAGE_NICKNAMES'
, 'MANAGE_ROLES'
, 'MANAGE_WEBHOOKS'
, 'MANAGE_EMOJIS'];

export default class Role {
    protected b: Bot;

    id:          string;
    name:        string;
    color:       number;
    position:    number;
    guild:       Guild;
    managed:     boolean;
    mentionable: boolean;
    permissions: permission[] = [];

    constructor (data: any, guild: Guild, bot: Bot) {
        this.b = bot;

        this.id = data.id;
        this.name = data.name;
        this.color = data.color;
        this.position = data.position;
        this.guild = guild;
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        for (let i = 0; i < permissions.length; i++) {
            if ((parseInt(data.permissions) & 2 ** (i + 1)) == 2 ** (i + 1)) {
                this.permissions.push(permissions[i]);
            }
        }
    }

    private patch = (data: any): Promise<Role> => {
        return new Promise((resolve, reject) => {
            const update: any = {};
            if (data.name) update.name = data.name;
            if (data.color) update.color = data.color;

            this.b.request('PATCH', baseUrl + this.guild?.id + '/roles/' + this.id, update)
                .then(res => {
                    const role = new Role(res, this.guild, this.b); 
                    resolve(role);
                })
                .catch(err => reject(err));
        });
    }

    /**
     * @description Update the role's name
     * @param {string} name The new name for the role
     */
    rename (name: string): Promise<Role> {
        return new Promise((resolve, reject) => {
            this.patch({ name })
                .then(role => resolve(role))
                .catch(err => reject(err));
        });
    }

    /**
     * Update the role's color
     * @param {number} color The new hex color for the role
     */
    setColor (color: string): Promise<Role> {
        return new Promise((resolve, reject) => {
            this.patch({ color: parseInt(color, 16) })
                .then(role => resolve(role))
                .catch(err => reject(err));
        });
    }
}