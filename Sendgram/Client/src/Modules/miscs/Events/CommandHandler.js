const Commands = require('../../../Class/Commands')

module.exports = {
  CommandHandler: {
    name: 'interactionCreate',
    run: async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      const cmdName = interaction.commandName;

      var cmd = interaction.client.Commands.get(cmdName);
      if (!cmd) Commands.Error(interaction, cmdName, 'Command not found in Map !', '⚠ Command not found in Map !');

      if (!cmd) {
        if (interaction.deferred) interaction.editReply({ content: '⚠ Command not found in Map !' }).catch(() => { });
        else interaction.reply({ content: '⚠ Command not found in Map !', ephemeral: true }).catch(() => { });

        return;
      }

      const cmdExecute = await cmd.run(interaction).catch(err => {
        if (interaction.deferred) interaction.editReply({ content: `⚠ An error occured !\n${err.message}` }).catch(() => { });
        else Commands.Error(interaction, cmdName, `⚠ An error occured !${err.message}`, err);

        console.log(err);

        return false;
      });
    }
  }
}