const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Setzt den Moderations-Log-Kanal')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Der Kanal für Moderations-Logs')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');

    if (channel.type !== 0) {
      return interaction.reply({ content: '❌ Bitte wähle einen Text-Kanal.', ephemeral: true });
    }

    configManager.set('logChannelId', channel.id);
    await interaction.reply({ content: `✅ Log-Kanal gesetzt auf ${channel}`, ephemeral: true });
  },
};
