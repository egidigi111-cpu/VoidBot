const { EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');
const inviteTracker = require('../commands/invites');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const config = configManager.getAll();

    // ── Auto-Role zuweisen ────────────────
    if (config.autoRoleId) {
      try {
        const role = member.guild.roles.cache.get(config.autoRoleId);
        if (role) {
          await member.roles.add(role);
        }
      } catch (error) {
        console.error('Auto-Role Fehler:', error);
      }
    }

    // ── Invite tracken ────────────────
    try {
      const existingInvites = member.guild.invites.cache;
      const newInvites = await member.guild.fetchInvites();

      let usedInvite = null;

      for (const [code, newInvite] of newInvites) {
        const existingInvite = existingInvites.get(code);
        if (existingInvite && newInvite.uses > existingInvite.uses) {
          usedInvite = newInvite;
          break;
        }
      }

      if (usedInvite && usedInvite.inviter) {
        inviteTracker.addInvite(usedInvite.inviter.id, member.id);
      }
    } catch (error) {
      console.error('Invite-Tracking Fehler:', error);
    }

    // ── Willkommensnachricht ────────────────
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

    await channel.send({ embeds: [embed] });
  },
};
