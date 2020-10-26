import Bot from '../Bot/Bot';

import User from './User';

export default class Member {
    private b: Bot;
    private token: string;

    user?:         User;
    nick?:         string;
    roles:         any[];
    joinedAt:      Date;
    premiumSince?: Date;
    deaf:          boolean;
    mute:          boolean;

    constructor (data: any, bot: Bot, token: string) {
        this.b = bot;
        this.token = token;

        this.user = data.user ? new User(data.user, bot, token) : undefined;
        this.nick = data.nick;
        this.roles = data.roles;
        this.joinedAt = new Date(data.joined_at);
        this.premiumSince = new Date(data.premium_since);
        this.deaf = data.deaf;
        this.mute = data.mute;
    }

    /**
     * @description Returns the member's visible name in a guild
     */
    name () {
        return this.nick ? this.nick : this.user?.username;
    }
}