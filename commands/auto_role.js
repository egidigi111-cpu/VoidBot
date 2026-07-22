const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auto_role')
    .setDescription('Setzt die automatische Rolle bei Join')
    .addRoleOption(option =>
      option.setName('rolle')
        .setDescription('Die Rolle die automatisch vergeben wird')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const role = interaction.options.getRole('rolle');

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: '❌ Diese Rolle ist höher als meine höchste Rolle.', ephemeral: true });
    }

    configManager.set('autoRoleId', role.id);
    await interaction.reply({ content: `✅ Auto-Rolle gesetzt auf ${role}`, ephemeral: true });
  },
};
