const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannt einen User vom Server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der User, der gebannt werden soll')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('grund')
        .setDescription('Grund für den Ban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');
    const grund = interaction.options.getString('grund') || 'Kein Grund angegeben';

    if (member && !member.bannable) {
      return interaction.reply({ content: '❌ Ich kann diesen User nicht bannen.', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(user, { reason: grund });
      await interaction.reply({ content: `✅ **${user.tag}** wurde gebannt.\n📄 Grund: ${grund}`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ Fehler beim Bannen: ${error.message}`, ephemeral: true });
    }
  },
};
