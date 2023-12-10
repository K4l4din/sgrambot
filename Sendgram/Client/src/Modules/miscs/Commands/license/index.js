const { ChannelType, GuildInvitableChannelResolvable, EmbedBuilder, ActionRowBuilder, BaseSelectMenuBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Commands = require('../../../../Class/Commands');
const options = require('./options');
const pretty = require("pretty-ms");
const moment = require('moment')
const { paginacion } = require('../../functions/users');

const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  let id = interaction.options.getString('userid');
  if(id) {
    const total = await interaction.client.database.sequelizeInstance.models.Users.findAll({
      where: {
        user: id
      },
    });

    if(total.length === 0) {
      interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`L'userID : \`${id}\` ne possède aucune license.`)], ephemeral: true });
      return true
    }

    const ordenado = total.filter(member => (member.user)).sort((a, b) => Number((a.abonnement) - (b.abonnement)));

    const texto = ordenado.map((miembro, index) => {
      const expirationTimestamp = miembro.abonnement.getTime() / 1000; 

      return `**UserID**: \`${miembro.user}\`\n**Username**: \`${miembro.username}\`\n**Token**: \`${miembro.token}\`\n**ApiID**: \`${miembro.ApiID}\`\n**ApiHash**: \`${miembro.ApiHash}\`\n**Expire**: <t:${expirationTimestamp}:R>\n**Propriétaire**: ${miembro.linked ?  `<@${miembro.linked}>` : `\`Personne\``}\n\n`
    })
    paginacion(interaction.client, interaction, texto, `Sendgram Licenses de ${id}`, `Licenses : (${total.length})\n\n`)
  
    return true
  } else {
    try {
      const total = await interaction.client.database.sequelizeInstance.models.Users.findAll();
  
        total.sort((a, b) => a.abonnement - b.abonnement);
  
        if(total.length === 0) {
          interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Aucune license`)], ephemeral: true });
          return true
        }
  
        const ordenado = total.filter(member => (member.user)).sort((a, b) => Number((a.abonnement) - (b.abonnement)));
        
        const texto = ordenado.map((miembro, index) => {
          const expirationTimestamp = miembro.abonnement.getTime() / 1000; 
  
          return `**UserID**: \`${miembro.user}\`\n**Username**: \`${miembro.username}\`\n**Token**: \`${miembro.token}\`\n**ApiID**: \`${miembro.ApiID}\`\n**ApiHash**: \`${miembro.ApiHash}\`\n**Expire**: <t:${expirationTimestamp}:R>\n**Propriétaire**: ${miembro.linked ?  `<@${miembro.linked}>` : `\`Personne\``}\n\n`
        })
        paginacion(interaction.client, interaction, texto, `Sendgram Licenses`, `Licenses : (${total.length})\n\n`)
  
        return true
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'Une erreur s\'est produite.', ephemeral: true });
    }    
  }

  return true;
});

module.exports = cmd;
