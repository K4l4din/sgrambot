const { SlashCommandBuilder } = require('discord.js');

exports.default = new SlashCommandBuilder()
    .setName("license")
    .setDescription("Gérer les licenses")
    .addStringOption((option) => option.setName('userid').setDescription("Id de l'utilisateur telegram").setRequired(false))