import Bot from '../Bot/Bot';

export default class Channel {
    protected b:     Bot
    protected token: string

    id: string;

    constructor(data: any, bot: Bot, token: string) {
        this.b = bot;
        this.token = token;

        this.id = data.id;
    }
}