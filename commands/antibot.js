const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antibot')
    .setDescription('Richtet einen Anti-Bot-Fang-Kanal ein')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Der Kanal, in dem Bots gefangen werden sollen')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    configManager.set('antibotChannelId', channel.id);

    const warningMessage =
      '🚫 **DO NOT SEND MESSAGES IN THIS CHANNEL**\n\n' +
      'This channel is used to catch spam bots. Any messages sent here will result in a **softban**.';

    await channel.send({ content: warningMessage });

    await interaction.reply({
      content: `✅ Anti-Bot-Kanal wurde auf ${channel} gesetzt. Eine Warnnachricht wurde gesendet.`,
      ephemeral: true,
    });
  },
};
