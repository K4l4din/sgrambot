const { ChannelType, GuildInvitableChannelResolvable, EmbedBuilder, ActionRowBuilder, BaseSelectMenuBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Commands = require('../../../../Class/Commands');
const options = require('./options');
const pretty = require("pretty-ms");
const moment = require('moment')
const cmd = new Commands(options, []);

cmd.setHandler({}, async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const idtelegram = interaction.options.getString('telegramid');
    const username = interaction.options.getString('username');
    const token = interaction.options.getString('token');
    const apiid = interaction.options.getString('apiid');
    const apihash = interaction.options.getString('apihash');
    const abonnement = interaction.options.getInteger('abonnement');
    const linked = interaction.options.getUser('userlink');

    const data = await interaction.client.database.sequelizeInstance.models.Users.findOne({ where: { token: token }, raw: true })
    if (data && data.token === token) {
      await interaction.editReply({ content: 'Une license avec ce token existe déjà dans la base de données.' });
      return true;
    } else if (data && data.ApiID === apiid) {
      await interaction.editReply({ content: 'Une license avec cet ApiID existe déjà dans la base de données.' });
      return true;
    } else if (data && data.ApiHash === apihash) {
      await interaction.editReply({ content: 'Une license avec cet ApiHash existe déjà dans la base de données.' });
      return true;
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + abonnement);

    const formattedExpirationDate = moment(expirationDate).format('LLL');
    await interaction.client.database.sequelizeInstance.models.Users.create({
      user: idtelegram,
      username: username,
      token: token,
      ApiID: apiid,
      ApiHash: apihash,
      abonnement: expirationDate,
      linked: linked ? linked.id : null
    });
    await interaction.editReply({
      embeds: [new EmbedBuilder().setTitle('Nouvelle license')
        .setDescription(`UserID: \`${idtelegram}\`\nUsername: \`${username}\`\nToken: \`${token}\`\nApiID: \`${apiid}\`\nApiHash: \`${apihash}\`\nDate d'expiration: \`${formattedExpirationDate}\` (${abonnement} jours)\nLié a: ${linked ? `${linked}` : `\`Personne\`` }`)]
    })
  
  return true;
});

module.exports = cmd;
