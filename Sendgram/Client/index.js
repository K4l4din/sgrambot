const { GatewayIntentBits, Partials } = require('discord.js');
const moment = require('moment');
const ExtendedClient = require('./src/Class/Client');
moment().locale('fr');


const Client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers
  ],
  partials: [
    Partials.GuildMember,
    Partials.Reaction
  ]
})

process.on('unhandledRejection', (err) => {
  console.log(err);
})

module.exports = Client;