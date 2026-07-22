const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('message')
    .setDescription('Sendet eine Nachricht als Bot')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Die Nachricht die gesendet werden soll')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Ziel-Kanal (Standard: aktueller Kanal)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const kanal = interaction.options.getChannel('kanal') || interaction.channel;

    await kanal.send(text);
    await interaction.reply({ content: `✅ Nachricht gesendet in ${kanal}`, ephemeral: true });
  },
};
