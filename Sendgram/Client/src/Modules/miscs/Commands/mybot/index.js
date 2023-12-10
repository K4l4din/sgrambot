const { ChannelType, GuildInvitableChannelResolvable, EmbedBuilder, ActionRowBuilder, BaseSelectMenuBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder } = require('discord.js');
const Commands = require('../../../../Class/Commands');
const options = require('./options');
const pretty = require("pretty-ms");
const moment = require('moment')
const { paginacion } = require('../../functions/users');

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  let total = await interaction.client.database.sequelizeInstance.models.Users.findAll({
    where: {
      linked: interaction.user.id,
    },
    raw: true
  });

  total.sort((a, b) => a.abonnement - b.abonnement);
  
  if(total.length === 0) {
    interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Vous ne possèdez pas de license chez Sendgram.`)], ephemeral: true });
    return true
  }

  const ordenado = total.filter(member => (member.user)).sort((a, b) => Number((a.abonnement) - (b.abonnement)));
  
  const texto = ordenado.map((miembro, index) => {
    const expirationTimestamp = miembro.abonnement.getTime() / 1000; 

    return `**UserID**: \`${miembro.user}\`\n**Username**: \`${miembro.username}\`\n**Token**: \`${miembro.token}\`\n**ApiID**: \`${miembro.ApiID}\`\n**ApiHash**: \`${miembro.ApiHash}\`\n**Expire**: <t:${expirationTimestamp}:R>\n\n`
  })
  paginacion(interaction.client, interaction, texto, `Vos licenses`, `Licenses : (${total.length})\n\n`)
  

  return true;
});

module.exports = cmd;
