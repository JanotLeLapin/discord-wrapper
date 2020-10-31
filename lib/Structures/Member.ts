import Bot from '../Bot/Bot';

import User from './User';
import Guild from './Guild';
const baseUrl = 'https://discord.com/api/guilds/';

export default class Member {
    private b: Bot;

    guild?:        Guild;
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

        this.guild = guild;
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
        if (this.user?.id === guild?.ownerID) permissions.forEach(permission => this.permissions.push(permission));
        else this.roles.forEach(role => role.permissions.forEach(permission => {
            if (this.permissions.indexOf(permission) === -1) this.permissions.push(permission);
        }));
    }

    /**
     * @description Returns the member's visible name in a guild
     */
    name () {
        return this.nick ? this.nick : this.user?.username;
    }

    private patch = (data: any): Promise<void> => {
        return new Promise((resolve, reject) => {
            const update: any = {};
            if (data.nick) update.nick = data.nick;
            console.log(update);

            console.log();
            this.b.request('PATCH', baseUrl + this.guild?.id + '/members/' + this.user?.id, update)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    rename (nick: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.patch({ nick })
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }
}