const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antibotlog')
    .setDescription('Sets the log channel for anti-bot bans')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to log anti-bot actions')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    configManager.set('antibotLogChannelId', channel.id);

    await interaction.reply({
      content: `Anti-bot log channel set to ${channel}.`,
      ephemeral: true,
    });
  },
};
