const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antibot')
    .setDescription('Sets up an anti-bot honeypot channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to catch spam bots')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    configManager.set('antibotChannelId', channel.id);

    const embed = new EmbedBuilder()
      .setColor(0x2F3136)
      .setTitle('DO NOT SEND MESSAGES IN THIS CHANNEL / KEINE NACHRICHTEN IN DIESEM KANAL')
      .setDescription(
        'This channel is used to catch spam bots. Any messages sent here will result in an automatic ban.\n' +
        'Dieser Kanal dient zum Auffangen von Spam-Bots. Jede Nachricht führt zu einem automatischen Ban.'
      )
      .setFooter({ text: 'VoidAttack · Anti-Bot System' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    await interaction.reply({
      content: `Anti-bot channel set to ${channel}.`,
      ephemeral: true,
    });
  },
};
