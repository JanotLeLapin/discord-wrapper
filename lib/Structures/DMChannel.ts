import Bot from '../Bot/Bot';

import { TextChannelBase } from './TextChannel';

export interface Recipient {
    username:      string;
    discriminator: string;
    id:            string;
    avatar:        string;
}


export default class DMChannel extends TextChannelBase {
    recipients:      Recipient[];

    constructor (data: any, bot: Bot, token: string) {
        super(data, bot, token);

        this.recipients = data.recipients;
    }
}