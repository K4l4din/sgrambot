const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, EmbedBuilder } = require('discord.js');
const Commands = require('../../../Class/Commands')

const { verification_user } = require('../functions/users')
module.exports = {
  Action: {
    name: 'interactionCreate',
    run: async (interaction) => {
      if (interaction.isButton()) {
        const customId = interaction.customId;

        const parts = customId.split('_');
        if (parts.length === 2 && parts[0] === 'delete') {
          const apiid = parts[1];
          let Info = await interaction.client.database.sequelizeInstance.models.Users.findOne({
            where: {
              ApiID: apiid,
            },
            raw: true
          })
          if(Info) {
            await interaction.client.database.sequelizeInstance.models.Users.destroy({
              where: {
                ApiID: apiid,
              }
            });
            interaction.update({ embeds: [new EmbedBuilder().setDescription(`La license : \`${apiid}\` supprimer avec succès.`)], components: [], ephemeral: true });
          } else {
            interaction.update({ embeds: [new EmbedBuilder().setDescription(`La license : \`${apiid}\` n'existe pas/plus.`)], components: [], ephemeral: true });
          }
        }
      }
    }
  }
}