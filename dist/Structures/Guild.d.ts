import Bot from '../Bot/Bot';
import TextChannel from './TextChannel';
declare type feature = 'INVITE_SPLASH' | 'VIP_REGIONS' | 'VANITY_URL' | 'VERIFIED' | 'PARTNERED' | 'COMMUNITY' | 'COMMERCE' | 'NEWS' | 'DISCOVERABLE' | 'FEATURABLE' | 'ANIMATED_ICON' | 'BANNER' | 'WELCOME_SCREEN_ENABLED';
declare type verificationLevel = 0 | 1 | 2 | 3 | 4;
declare type defaultMessageNotifications = 0 | 1;
declare type explicitContentFilter = 0 | 1 | 2;
export default class Guild {
    protected b: Bot;
    protected token: string;
    id: string;
    name: string;
    icon?: string;
    description?: string;
    splash?: string;
    discoverySplash?: string;
    features: feature[];
    emojis: any[];
    banner?: string;
    ownerID: string;
    applicationID?: string;
    region: string;
    channels: TextChannel[];
    afkChannelID?: string;
    afkTimeout: number;
    systemChannelID?: string;
    widgetEnabled: boolean;
    widgetChannelID?: string;
    verificationLevel: verificationLevel;
    roles: any[];
    defaultMessageNotifications: defaultMessageNotifications;
    mfaLevel: 0 | 1;
    explicitContentFilter: explicitContentFilter;
    maxPresences?: number;
    maxMembers: number;
    vanityUrlCode?: string;
    premiumTier: 0 | 1 | 2 | 3;
    premiumSubscriptionCount: number;
    systemChannelFlags: number;
    preferredLocale: string;
    rulesChannelId?: string;
    publicUpdatesChannelId?: string;
    aviable: boolean;
    constructor(data: any, bot: Bot, token: string);
    /**
     * @description The icon url obtained from the guild ID and icon hash
     */
    avatarURL(): string;
    private patch;
    /**
     * @description Update the guild's name
     * @param {string} name The new name for the guild
     */
    setName(name: string): void;
}
export {};
