const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Richtet das Zählspiel ein')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Der Kanal für das Zählspiel')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: '❌ Bitte wähle einen Text-Kanal.', ephemeral: true });
    }

    configManager.set('countingChannelId', channel.id);
    configManager.set('countingLastNumber', 0);

    await interaction.reply({ content: `✅ Zählspiel eingrichtet in ${channel}\n\nNutze \`/counting_reset\` um den Zähler zurückzusetzen.`, ephemeral: true });
  },
};
