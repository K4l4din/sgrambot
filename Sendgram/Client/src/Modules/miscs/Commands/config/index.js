const { ChannelType, GuildInvitableChannelResolvable, EmbedBuilder, ActionRowBuilder, BaseSelectMenuBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder } = require('discord.js');
const Commands = require('../../../../Class/Commands');
const options = require('./options');
const pretty = require("pretty-ms");
const moment = require('moment')
const { paginacion } = require('../../functions/users');

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  let token = interaction.options.getString('token');
 
  let Info = await interaction.client.database.sequelizeInstance.models.Users.findOne({
    where: {
      token: token,
    },
    raw: true
  })

  if(Info) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`delete_${token}`)
        .setLabel('Supprimer la license')
        .setStyle('Danger'),
    )

    const expirationTimestamp = Info.abonnement.getTime() / 1000; 
    const embed = new EmbedBuilder()
    .setTitle(`Configuration`)
    .setDescription(`License de : ${Info.username} (${Info.user})\nExpire: <t:${expirationTimestamp}:R>`)

    interaction.editReply({ embeds: [embed], components: [row]});
  } else {
    interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Aucune license avec le token : \`${token}\` existe dans la db.`)], ephemeral: true });
    return true
  }
  
  

  return true;
});

module.exports = cmd;
