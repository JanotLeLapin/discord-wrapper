import User from '../Structures/User';
import Guild from '../Structures/Guild';
import Message from '../Structures/Message';
interface Presence {
    name: string;
    type?: 'playing' | 'streaming' | 'listening' | 'watching';
    status?: 'online' | 'dnd' | 'idle' | 'invisible' | 'offline';
}
interface EventListener {
    ready: () => void;
    error: (err: Error) => void;
    message: (message: Message) => void;
    guildCreate: (guild: Guild) => void;
}
interface EventEmitter {
    ready: undefined;
    error: Error;
    message: Message;
    guildCreate: Guild;
}
interface Error {
    code?: number;
    message: string;
}
export default class Bot {
    private connection?;
    user: User;
    guilds: Guild[];
    /**
     * @description Connects the bot
     * @param {string} token Your bot token
     */
    connect(token: string): Promise<void>;
    /**
     * @description Update the bot's activity
     * @param {Presence} presence Presence object
     * @example ```js
     * bot.setPresence({ name: 'New Presence', type: 'watching', status: 'idle' })
     * ```
     */
    setPresence(presence: Presence): void;
    handlers: any;
    /**
     * @description Listen for a specific event
     * @param eventName The name of the event to listen to
     * @param handler The function to run when this event is fired
     * @example ```js
     * bot.on('guildCreate', guild => console.log(guild.name));
     * ```
     */
    on<K extends keyof EventListener>(eventName: K, handler: EventListener[K]): void;
    /**
     * @description Fire a specific event
     * @param eventName The name of the event to fire
     * @param data The data to bind to this event
     * @example ```js
     * bot.emit('error', { code: 123, message: 'My custom error' });
     * ```
     * You can now listen to this event
     * ```js
     * bot.on('error', err => console.log(err.message));
     * ```
     */
    emit<K extends keyof EventEmitter>(eventName: K, data?: EventEmitter[K]): void;
}
export {};
