"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var TextChannel_1 = __importDefault(require("./TextChannel"));
var baseUrl = 'https://discord.com/api/guilds/';
var Guild = /** @class */ (function () {
    function Guild(data, bot, token) {
        var _this = this;
        this.channels = [];
        this.members = [];
        this.patch = function (data) {
            var update = {};
            if (data.name)
                update.name = data.name;
            axios_1.default.patch(baseUrl + _this.id, update, {
                headers: {
                    'Authorization': 'Bot ' + _this.token,
                }
            })
                .then(function (res) { return _this.b.guilds[_this.b.guilds.indexOf(_this)] = res.data; })
                .catch(function (err) { return _this.b.emit('error', {
                code: err.response.status,
                message: err.response.statusText,
            }); });
        };
        this.b = bot;
        this.token = token;
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
        this.roles = data.roles;
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
        if (data.unaviable)
            this.aviable = false;
        else
            this.aviable = true;
        axios_1.default.get(baseUrl + this.id + '/channels', {
            headers: {
                Authorization: 'Bot ' + token,
            }
        })
            .then(function (res) {
            var channels = res.data;
            channels.forEach(function (channel) { return _this.channels.push(new TextChannel_1.default(channel, bot, token)); });
            bot.guilds.push(_this);
            bot.emit('guildCreate', _this);
        })
            .catch(function (err) { return console.error(err.response); });
    }
    /**
     * @description The icon url obtained from the guild ID and icon hash
     */
    Guild.prototype.avatarURL = function () {
        return 'https://cdn.discordapp.com/icons/' + this.id + '/' + this.icon;
    };
    /**
     * @description Update the guild's name
     * @param {string} name The new name for the guild
     */
    Guild.prototype.setName = function (name) {
        this.patch({ name: name });
    };
    return Guild;
}());
exports.default = Guild;
