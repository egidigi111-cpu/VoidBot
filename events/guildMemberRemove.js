const { EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const config = configManager.getAll();

    const channel = member.guild.channels.cache.get(config.leaveChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle('👋 Auf Wiedersehen!')
      .setDescription(
        `**${member.user.tag}** hat den Server verlassen.\n\n` +
        `Wir wünschen alles Gute!`
      )
      .setColor(0xED4245)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: `Mitglieder: ${member.guild.memberCount}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};
