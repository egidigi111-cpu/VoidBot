const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('Log system configuration')
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('Set the log channel')
        .addChannelOption(opt =>
          opt.setName('channel')
            .setDescription('The log channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const channel = interaction.options.getChannel('channel');
      configManager.set('logChannelId', channel.id);
      await interaction.reply({ content: `Log channel set to ${channel}.`, ephemeral: true });
    }
  },
};
