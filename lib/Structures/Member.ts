import Bot from '../Bot/Bot';

import User from './User';
import Guild from './Guild';
import Role, { permission } from './Role';

export default class Member {
    private b: Bot;

    user?:         User;
    nick?:         string;
    roles:         Role[] = [];
    joinedAt:      Date;
    premiumSince?: Date;
    deaf:          boolean;
    mute:          boolean;
    permissions:   permission[] = [];

    constructor (data: any, guild: Guild | undefined, bot: Bot) {
        this.b = bot;

        this.user = data.user ? new User(data.user, bot) : undefined;
        this.nick = data.nick;
        if (data.roles) data.roles.forEach((roleID: any) => {
            const role = guild?.roles.find(r => r.id === roleID);
            if (role) this.roles.push(role);
        });
        this.joinedAt = new Date(data.joined_at);
        this.premiumSince = new Date(data.premium_since);
        this.deaf = data.deaf;
        this.mute = data.mute;
        this.roles.forEach(role => role.permissions.forEach(permission => {
            if (this.permissions.indexOf(permission) === -1) this.permissions.push(permission);
        }));
    }

    /**
     * @description Returns the member's visible name in a guild
     */
    name () {
        return this.nick ? this.nick : this.user?.username;
    }
}