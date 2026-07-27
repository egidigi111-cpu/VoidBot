const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
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

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('⛔ ZUTRITT VERBOTEN ⛔')
      .setDescription(
        '**Sende KEINE Nachrichten in diesem Kanal!**\n\n' +
        'Dieser Kanal dient ausschließlich zum **Auffangen von Spam-Bots**. ' +
        'Jede Nachricht, die hier gesendet wird, führt automatisch zu einem **softban**.\n\n' +
        '───────────────────────\n' +
        '⚠️ *Bei Verstoß wirst du umgehend gebannt.*\n' +
        '───────────────────────'
      )
      .setThumbnail('https://i.imgur.com/G2VfO6h.png')
      .setFooter({ text: 'VoidAttack · Anti-Bot System' })
      .setTimestamp();

    const dangerIcon = '🚨';

    await channel.send({ content: dangerIcon, embeds: [embed] });

    await interaction.reply({
      content: `✅ Anti-Bot-Kanal wurde auf ${channel} gesetzt. Eine Warnnachricht wurde gesendet.`,
      ephemeral: true,
    });
  },
};
