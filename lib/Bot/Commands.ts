import Message from '../Structures/Message';

import { permission } from '../Structures/Role';

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
        if (this.options.permissions) {
            for (let i = 0; i < this.options.permissions.length; i++) {
                if (!message.member.permissions.includes(this.options.permissions[i])) return message.reply(this.options.permMessage || 'You need the following permission' + (this.options.permissions.length > 1 ? 's' : '') + ' to run this command: ' + this.options.permissions.filter(p => !message.member.permissions.includes(p)).join(', ').toLowerCase().split('_').join(' ') + '.');
            }
        }
        this.command(message, args);
    }
}