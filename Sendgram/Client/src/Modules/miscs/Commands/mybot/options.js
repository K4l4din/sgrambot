const { SlashCommandBuilder } = require('discord.js');

exports.default = new SlashCommandBuilder()
    .setName("mybot")
    .setDescription("Afficher les bots que vous possèdez")
