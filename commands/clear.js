const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Löscht Nachrichten im Kanal')
    .addIntegerOption(option =>
      option.setName('anzahl')
        .setDescription('Anzahl der Nachrichten, die gelöscht werden sollen (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const anzahl = interaction.options.getInteger('anzahl');

    try {
      const messages = await interaction.channel.bulkDelete(anzahl, true);
      await interaction.reply({ content: `✅ **${messages.size}** Nachrichten gelöscht.`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ Fehler beim Löschen: ${error.message}`, ephemeral: true });
    }
  },
};
