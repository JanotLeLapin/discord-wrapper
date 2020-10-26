# discord-wrapper
A Discord wrapper written in TypeScript

## Example usage:
```js
const Discord = require('discord-wrapper');
const bot = new Discord.Bot();

bot.on('ready', () => console.log(bot.user.username + ' ready.'));

bot.connect('your bot token');
```