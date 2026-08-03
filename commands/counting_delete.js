const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counting_delete')
    .setDescription('Entfernt das Zählspiel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const config = configManager.getAll();

    if (!config.countingChannelId) {
      return interaction.reply({ content: '❌ Es ist kein Zählspiel eingerichtet.', ephemeral: true });
    }

    configManager.set('countingChannelId', null);
    configManager.set('countingLastNumber', 0);

    await interaction.reply({ content: '✅ Zählspiel wurde entfernt.', ephemeral: true });
  },
};
