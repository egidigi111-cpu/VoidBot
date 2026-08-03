const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countingrestart')
    .setDescription('Setzt das Zählspiel auf 0 zurück')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const config = configManager.getAll();

    if (!config.countingChannelId) {
      return interaction.reply({ content: '❌ Es ist kein Zählspiel eingerichtet.', ephemeral: true });
    }

    configManager.set('countingLastNumber', 0);

    await interaction.reply({ content: '✅ Zählspiel wurde auf **0** zurückgesetzt.', ephemeral: true });
  },
};
