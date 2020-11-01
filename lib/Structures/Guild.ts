import Bot from '../Bot/Bot';

import Member from './Member';
import Role from './Role';
import TextChannel from './TextChannel';

const baseUrl = 'https://discord.com/api/guilds/';

type feature = 'INVITE_SPLASH'
| 'VIP_REGIONS'
| 'VANITY_URL'
| 'VERIFIED'
| 'PARTNERED'
| 'COMMUNITY'
| 'COMMERCE'
| 'NEWS'
| 'DISCOVERABLE'
| 'FEATURABLE'
| 'ANIMATED_ICON'
| 'BANNER'
| 'WELCOME_SCREEN_ENABLED';
type verificationLevel = 0 | 1 | 2 | 3 | 4;
type defaultMessageNotifications = 0 | 1;
type explicitContentFilter = 0 | 1 | 2;

export default class Guild {
    protected b: Bot;

    id:                          string;
    name:                        string;
    icon?:                       string;
    description?:                string;
    splash?:                     string;
    discoverySplash?:            string;
    features:                    feature[];
    emojis:                      any[];
    banner?:                     string;
    ownerID:                     string;
    applicationID?:              string;
    region:                      string;
    channels:                    TextChannel[] = [];
    afkChannelID?:               string;
    afkTimeout:                  number;
    systemChannelID?:            string;
    widgetEnabled:               boolean;
    widgetChannelID?:            string;
    verificationLevel:           verificationLevel;
    roles:                       Role[] = [];
    defaultMessageNotifications: defaultMessageNotifications;
    mfaLevel:                    0 | 1;
    explicitContentFilter:       explicitContentFilter;
    maxPresences?:               number;
    members:                     Member[] = [];
    maxMembers:                  number;
    vanityUrlCode?:              string;
    premiumTier:                 0 | 1 | 2 | 3;
    premiumSubscriptionCount:    number;
    systemChannelFlags:          number;
    preferredLocale:             string;
    rulesChannelId?:             string;
    publicUpdatesChannelId?:     string;
    aviable:                     boolean;

    constructor (data: any, bot: Bot) {
        this.b = bot;

        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.description = data.description;
        this.splash = data.splash;
        this.discoverySplash = data.discovery_splash;
        this.features = data.features;
        this.emojis = data.emojis;
        this.banner = data.banner;
        this.ownerID = data.owner_id;
        this.applicationID = data.application_id;
        this.region = data.region;
        this.afkChannelID = data.afk_channel_id;
        this.afkTimeout = data.afk_timeout;
        this.systemChannelID = data.system_channel_id;
        this.widgetEnabled = data.widhet_enabled;
        this.widgetChannelID = data.widget_channel_id;
        this.verificationLevel = data.verification_level;
        if (data.roles) data.roles.forEach((role: any) => {
            this.roles.push(new Role(role, this, bot));
        });
        this.defaultMessageNotifications = data.default_message_notifications;
        this.mfaLevel = data.mfa_level;
        this.explicitContentFilter = data.explicit_content_filter;
        this.maxPresences = data.max_presences;
        this.maxMembers = data.max_members;
        this.vanityUrlCode = data.vanity_url_code;
        this.premiumTier = data.premium_tier;
        this.premiumSubscriptionCount = data.premium_subscription_count;
        this.systemChannelFlags = data.system_channel_flags;
        this.preferredLocale = data.preferred_locale;
        this.rulesChannelId = data.rules_channel_id;
        this.publicUpdatesChannelId = data.public_updated_channel_id;

        if (data.unaviable) this.aviable = false;
        else this.aviable = true;

        bot.request('GET', baseUrl + this.id + '/channels')
            .then(res => {
                const channels: TextChannel[] = res;
                channels.forEach(channel => this.channels.push(new TextChannel(channel, bot)));

                bot.request('GET', baseUrl + this.id + '/members')
                    .then(r => {
                        const members: Member[] = r;
                        members.forEach(member => this.members.push(new Member(member, this, bot)));

                bot.guilds.push(this);
                bot.emit('guildCreate', this);
                    })
                    .catch(err => { throw err });
            })
            .catch(err => { throw err });
    }

    /**
     * @description The icon url obtained from the guild ID and icon hash
     */
    avatarURL () {
        return 'https://cdn.discordapp.com/icons/' + this.id + '/' + this.icon;
    }

    private patch = (data: any): Promise<Guild> => {
        return new Promise((resolve, reject) => {
            const update: any = {};
            if (data.name) update.name = data.name;

            this.b.request('PATCH', baseUrl + this.id, update)
                .then(res => {
                    const guild = new Guild(res, this.b);
                    this.b.guilds[this.b.guilds.indexOf(this)] = guild;
                    resolve(guild);
                })
                .catch(err => reject(err));
        });
    }

    /**
     * @description Update the guild's name
     * @param {string} name The new name for the guild
     */
    rename (name: string): Promise<Guild> {
        return new Promise((resolve, reject) => {
            this.patch({ name })
                .then(guild => resolve(guild))
                .catch(err => reject(err));
        });
    }

}