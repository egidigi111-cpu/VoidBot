const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leveling')
    .setDescription('Schaltet das Chat-Leveling System an/aus')
    .addBooleanOption(option =>
      option.setName('aktiv')
        .setDescription('Leveling aktivieren oder deaktivieren')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const aktiv = interaction.options.getBoolean('aktiv');

    configManager.set('levelingEnabled', aktiv);

    const status = aktiv ? 'aktiviert' : 'deaktiviert';
    await interaction.reply({ content: `✅ Chat-Leveling wurde ${status}.`, ephemeral: true });
  },
};
