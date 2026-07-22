const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set_leave')
    .setDescription('Setzt den Verabschiedungs-Kanal')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Der Kanal für Verabschiedungsnachrichten')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');

    if (channel.type !== 0) {
      return interaction.reply({ content: '❌ Bitte wähle einen Text-Kanal.', ephemeral: true });
    }

    configManager.set('leaveChannelId', channel.id);
    await interaction.reply({ content: `✅ Verabschiedungs-Kanal gesetzt auf ${channel}`, ephemeral: true });
  },
};
