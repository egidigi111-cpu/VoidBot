const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock_links')
    .setDescription('Schaltet den Link-/Einladungsschutz an/aus')
    .addBooleanOption(option =>
      option.setName('aktiv')
        .setDescription('Link-Schutz aktivieren oder deaktivieren')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const aktiv = interaction.options.getBoolean('aktiv');

    configManager.set('linkProtectionEnabled', aktiv);

    const status = aktiv ? 'aktiviert' : 'deaktiviert';
    await interaction.reply({ content: `✅ Link-/Einladungsschutz wurde ${status}.`, ephemeral: true });
  },
};
