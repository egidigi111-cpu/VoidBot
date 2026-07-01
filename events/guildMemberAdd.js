const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    const role = member.guild.roles.cache.get('1435310605841072189');
    if (role) member.roles.add(role);

    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle('👋 Willkommen auf VoidAttack!')
      .setDescription(
        `Hey <@${member.user.id}>, willkommen auf dem **VoidAttack** Server!\n\n` +
        `Du bist unser **${member.guild.memberCount}. Mitglied** – schön, dass du da bist!`
      )
      .setColor(0x5865F2)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: `Mitglied #${member.guild.memberCount}` })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  },
};
