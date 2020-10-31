import Bot from '../Bot/Bot';

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

const permissions: permission[] = ['CREATE_INSTANT_INVITE'
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
    id:          string;
    name:        string;
    color:       number;
    position:    number;
    managed:     boolean;
    mentionable: boolean;
    permissions: permission[] = [];

    constructor (data: any, bot: Bot) {
        this.id = data.id;
        this.name = data.name;
        this.color = data.color;
        this.position = data.position;
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        for (let i = 0; i < permissions.length; i++) {
            if ((parseInt(data.permissions) & 2 ** (i + 1)) == 2 ** (i + 1)) {
                this.permissions.push(permissions[i]);
            }
        }
    }
}