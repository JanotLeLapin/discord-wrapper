# discord-wrapper
A Discord wrapper written in TypeScript

## Example usage:
```js
const Discord = require('discord-wrapper');
const bot = new Discord.Bot();

bot.on('ready', () => console.log(bot.user.username + ' ready.'));

bot.connect('your bot token');
```

## Commands:
discord-wrapper allows you to easily register commands.
```js
bot.commands.addCommand({
    name: '8ball',
    prefix: '!',
}, (message, args) => {
    const awnsers = ['Yes', 'Not sure', 'No'];
    message.reply(awnsers[Math.round(Math.random() * awnsers.length)]);
});
```

## Embeds:
```js
let embed = {
    color: '#006666',
    author: {
        name: 'JanotLeLapin',
        icon_url: 'https://cdn.discordapp.com/avatars/437953881914474523/fba9184bfbea41951a6b322bd5b6a3b6.webp?size=128',
        url: 'https://github.com/JanotLeLapin',
    },
    url: 'https://github.com/JanotLeLapin/discord-wrapper',
    title: 'Embed',
    description: 'discord-wrapper is cool',
    fields: [
        {
            name: 'Field',
            value: 'This is a field',
        },
        {
            name: 'Another Field',
            value: 'Even more fields',
        },
        {
            name: 'In...',
            value: 'And that is an...',
            inline: true,
        },
        {
            name: '...line',
            value: '...inline field',
            inline: true,
        },
    ],
    footer: {
        text: 'Give a star to my repo please',
    },
};

// Or

let embed = new Discord.Embed()
    .setColor('#006666')
    .setAuthor('JanotLeLapin', 'https://github.com/JanotLeLapin', 'https://cdn.discordapp.com/avatars/437953881914474523/fba9184bfbea41951a6b322bd5b6a3b6.webp?size=128')
    .setURL('https://github.com/JanotLeLapin/discord-wrapper')
    .setTitle('Embed')
    .setDescription('discord-wrapper is cool')
    .addField('Field', 'This is a field')
    .addField('Another Field', 'Even more fields')
    .addField('In...', 'And that is an...', true)
    .addField('...line', '...inline field')
    .setFooter('Give a star to my repo please');
```
Sending an embed is as easy as sending a regular message:
```js
channel.send(embed);
```
<p align="center" width="100%">
    <img width="33%" src="https://www.mediafire.com/convkey/97f0/po9q97aoe3bvr8rzg.jpg">
</p>