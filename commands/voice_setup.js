const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionFlagsBits: Perms } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voice_setup')
    .setDescription('Richtet den Temp-Voice Hub ein')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Der Voice-Kanal zum Erstellen neuer Channels')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');

    configManager.set('tempVoiceChannelId', channel.id);

    await interaction.reply({
      content: `✅ Temp-Voice Hub eingrichtet: ${channel}\n\nWenn ein User diesem Channel betritt, wird ein temporärer Channel erstellt.`,
      ephemeral: true,
    });
  },
};
