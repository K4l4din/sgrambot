const { Guild } = require('discord.js');
const OnReady = {
  name: 'ready',
  run: async (client) => {
    const guilds = await client.guilds.fetch();
    guilds.forEach(async (guild) => {
      if (client.Vars.debugCMD) await client.pushCommandGuild(guild.id);
    });
  },
};

module.exports = { OnReady };