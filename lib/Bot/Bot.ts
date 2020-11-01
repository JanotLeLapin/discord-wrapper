import axios, { Method } from 'axios';
import { client as WebSocketClient, connection } from 'websocket';
import zlib from 'zlib';

import Commands from './Commands';

import User from '../Structures/User';
import Guild from '../Structures/Guild';
import Message from '../Structures/Message';

interface Presence {
    name?: string;
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
    private connection?: connection;
    token?: string;

    commands = new Commands();

    user: User = new User({}, this);
    guilds: Guild[] = [];

    private seq: number | null = null;
    private ses: string | null = null;
    private interval: any = undefined;
    private handler = (data: any) => {
        this.seq = data.s || null;
        if (data.op == 10 && !this.interval) {
            this.interval = setInterval(() => this.connection?.send(JSON.stringify({
                op: 1,
                d: this.seq,
            })), data.d.heartbeat_interval);
        }
        switch (data.t) {
            case 'READY':
                this.user = new User(data.d.user, this);
                this.ses = data.d.session_id;
                return this.emit('ready');
            case 'MESSAGE_CREATE':
                new Message(data.d, this);
                break;
            case 'GUILD_CREATE':
                new Guild(data.d, this);
                break;
        }
    }

    /**
     * @description Connects the bot
     * @param {string} token Your bot token
     */
    connect(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.connection && this.connection.connected) return reject('Already authenticated.');
            this.token = token;
            const client = new WebSocketClient()
            client.connect('wss://gateway.discord.gg/?v=8&encoding=json');
            client.on('connect', connection => {
                this.connection = connection;
                connection.send(JSON.stringify({
                    op: 2,
                    d: {
                        token: token,
                        intents: 16383,
                        properties: {
                            $os: 'linux',
                            $browser: 'disco',
                            $device: 'disco',
                        },
                        compress: true,
                        large_threshold: 250,
                        guild_subscriptions: false,
                        shard: [0, 1],
                    },
                }));
                connection.on('message', data => {
                    if (data.utf8Data) {
                        const res: any = JSON.parse(data.utf8Data);
                        this.handler(res);
                        if (res.t === 'READY') return resolve();
                    }
                    if (data.binaryData) {
                        zlib.unzip(data.binaryData, (err, buffer) => {
                            if (err) return reject(err);
                            const res: any = JSON.parse(buffer.toString('utf-8'));
                            this.handler(res);
                            if (res.t === 'READY') return resolve();
                        });
                    }
                });
                connection.on('close', (code, desc) => {
                    connection.close();
                    this.connect(token)
                        .then(() => {
                            connection.send(JSON.stringify({
                                op: 6,
                                d: {
                                    token,
                                    session_id: this.ses,
                                    seq: this.seq,
                                }
                            }));
                        })
                        .catch(err => {
                            return reject(err);
                        });
                });
            });
        });
    }

    /**
     * @description Update the bot's activity
     * @param {Presence} presence Presence object
     * @example ```js
     * bot.setPresence({ name: 'New Presence', type: 'watching', status: 'idle' })
     * ```
     */
    setPresence(presence: Presence) {
        this.connection?.send(JSON.stringify({
            op: 3,
            d: {
                since: 0,
                activities: [
                    {
                        name: presence.name || '',
                        type: ['playing', 'streaming', 'listening', 'watching'].indexOf(presence.type || 'playing') || 0,
                    },
                ],
                status: presence.status || 'online',
                afk: false,
            }
        }));
    }

    handlers: any = {};
    /**
     * @description Listen for a specific event
     * @param eventName The name of the event to listen to
     * @param handler The function to run when this event is fired
     * @example ```js
     * bot.on('guildCreate', guild => console.log(guild.name));
     * ```
     */
    on<K extends keyof EventListener>(eventName: K, handler: EventListener[K]): void {
        if (!this.handlers[eventName]) this.handlers[eventName] = [];
        this.handlers[eventName].push(handler);
    }

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
    emit<K extends keyof EventEmitter>(eventName: K, data?: EventEmitter[K]): void {
        if (!this.handlers[eventName]) this.handlers[eventName] = [];
        this.handlers[eventName].forEach((handler: any) => handler(data));
    }

    request(method: Method, url: string, data?: object): Promise<any> {
        return new Promise((resolve, reject) => {
            axios({
                method,
                url,
                data,
                headers: {
                    Authorization: 'Bot ' + this.token,
                },
            })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response || err));
        });
    }
}