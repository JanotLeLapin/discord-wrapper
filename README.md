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
discord-wrapper allows you to easily register commands
```js
bot.commands.addCommand({
    name: '8ball',
    prefix: '!',
}, (message, args) => {
    const awnsers = ['Yes', 'Not sure', 'No'];
    message.reply(awnsers[Math.round(Math.random() * awnsers.length)]);
});
```