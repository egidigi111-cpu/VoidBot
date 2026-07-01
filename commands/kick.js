const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kickt einen User vom Server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der User, der gekickt werden soll')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('grund')
        .setDescription('Grund für den Kick')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const grund = interaction.options.getString('grund') || 'Kein Grund angegeben';

    if (!user) {
      return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
    }

    if (!user.kickable) {
      return interaction.reply({ content: '❌ Ich kann diesen User nicht kicken.', ephemeral: true });
    }

    try {
      await user.kick(grund);
      await interaction.reply({ content: `✅ **${user.user.tag}** wurde gekickt.\n📄 Grund: ${grund}`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ Fehler beim Kicken: ${error.message}`, ephemeral: true });
    }
  },
};
