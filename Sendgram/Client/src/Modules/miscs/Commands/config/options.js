const { SlashCommandBuilder } = require('discord.js');

exports.default = new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure les licenses")
    .addStringOption((option) => option.setName('token').setDescription("Token de la license à gérer").setRequired(true))