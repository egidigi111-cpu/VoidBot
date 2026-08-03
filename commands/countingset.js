const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countingset')
    .setDescription('Setzt die Zählspiel-Zahl auf einen bestimmten Wert')
    .addIntegerOption(option =>
      option.setName('nummer')
        .setDescription('Die neue Zahl')
        .setRequired(true)
        .setMinValue(0))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const config = configManager.getAll();

    if (!config.countingChannelId) {
      return interaction.reply({ content: '❌ Es ist kein Zählspiel eingerichtet.', ephemeral: true });
    }

    const nummer = interaction.options.getInteger('nummer');
    configManager.set('countingLastNumber', nummer);

    await interaction.reply({ content: `✅ Zählspiel-Zahl wurde auf **${nummer}** gesetzt.`, ephemeral: true });
  },
};
