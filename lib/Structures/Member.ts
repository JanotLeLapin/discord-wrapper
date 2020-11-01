import Bot from '../Bot/Bot';

import User from './User';
import Guild from './Guild';
import Role, { permission, permissions } from './Role';

const baseUrl = 'https://discord.com/api/guilds/';

export default class Member {
    protected b: Bot;

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

    /**
     * Removes the member from the server
     */
    kick () {
        return new Promise((resolve, reject) => {
            this.b.request('DELETE', baseUrl + this.guild?.id + '/members/' + this.user?.id)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    /**
     * Bans the member from the server
     * @param {number} deleteMessageDays Number of days to delete messages for (0-7)
     * @param {string} reason Reason for the ban
     */
    ban (deleteMessageDays?: number, reason?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const update: any = {};
            if (deleteMessageDays) update.delete_message_days = deleteMessageDays;
            if (reason) update.reason = reason;

            this.b.request('PUT', baseUrl + this.guild?.id + '/bans/' + this.user?.id, update)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    private patch = (data: any): Promise<void> => {
        return new Promise((resolve, reject) => {
            const update: any = {};
            if (data.nick) update.nick = data.nick;

            this.b.request('PATCH', baseUrl + this.guild?.id + '/members/' + this.user?.id, update)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    /**
     * Updates the member's nickname
     * @param {string} nick The new nickname for the member
     */
    rename (nick: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.patch({ nick })
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }
}