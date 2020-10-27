import Bot from '../Bot/Bot';

export default class Channel {
    protected b: Bot

    id: string;

    constructor(data: any, bot: Bot) {
        this.b = bot;

        this.id = data.id;
    }
}