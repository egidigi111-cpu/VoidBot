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
    const targetUser = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    const grund = interaction.options.getString('grund') || 'Kein Grund angegeben';

    if (!member) {
      return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: '❌ Ich kann diesen User nicht kicken.', ephemeral: true });
    }

    try {
      await member.kick(grund);
      await interaction.reply({ content: `✅ **${targetUser.tag}** wurde gekickt.\n📄 Grund: ${grund}`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ Fehler beim Kicken: ${error.message}`, ephemeral: true });
    }
  },
};
