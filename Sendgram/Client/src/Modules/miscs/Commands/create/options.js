const { SlashCommandBuilder } = require('discord.js');

exports.default = new SlashCommandBuilder()
    .setName("create")
    .setDescription("Crée une licence pour un utilisateur")
    .addStringOption((option) => option.setName('telegramid').setDescription("Id de l'utilisateur telegram").setRequired(true))
    .addStringOption((option) => option.setName('username').setDescription("Pseudo de l'acheteur").setRequired(true))
    .addStringOption((option) => option.setName('token').setDescription("Token du bot").setRequired(true))
    .addStringOption((option) => option.setName('apiid').setDescription("ApiID du client").setRequired(true))
    .addStringOption((option) => option.setName('apihash').setDescription("ApiHash du client").setRequired(true))
    .addIntegerOption((option) => option.setName('abonnement').setDescription("Nombre de jours pour la durée de l'abonnement").setRequired(true))
    .addUserOption((option) => option.setName('userlink').setDescription("Lien la license à un utilisateur discord").setRequired(false))