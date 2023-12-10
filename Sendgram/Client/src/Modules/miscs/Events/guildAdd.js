const { Guild } = require('discord.js');

const OnAdd = {
  name: 'guildCreate',
  run: async (guild) => {
    const Client = require('../../../../index')

    await Client.pushCommandGuild(guild.id).catch(err => {
        console.error(`try to push command on guild ${guild.id} but failed: ${err?.message ?? 'unknown error'}`);
    })
  },
};

module.exports = { OnAdd };