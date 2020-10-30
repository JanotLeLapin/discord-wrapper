import Bot from './Bot';

import Message from '../Structures/Message';

type permission = 'CREATE_INSTANT_INVITE'
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

interface options {
    name:         string;
    prefix:       string;
    permissions?: permission[];
    permMessage?:    string;
}

type command = (message: Message, args: string[]) => void;

export default class Commands {
    commands: Command[] = [];

    /**
     * @description Listen for a command
     * @param {string} name The command name
     * @param {command} command The code to execute when the command is called
     * @example ```js
     * bot.commands.addCommand({ name: 'hello', prefix: '!' }, (bot, message, args) => message.reply('World!'));
     * ```
     */
    addCommand(options: options, command: command) {
        if (!this.commands.find(c => c.options.name === options.name)) this.commands.push(new Command(options, command));
    }
}

class Command {
    options: options;
    command: command;

    constructor (options: options, command: command) {
        this.options = options;

        this.command = command;
    }

    run (message: Message, args: string[]) {
        this.command(message, args);
    }
}