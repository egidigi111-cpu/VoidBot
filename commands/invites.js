const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const INVITES_PATH = path.join(__dirname, '..', 'data', 'invites.json');

function readInvites() {
  if (!fs.existsSync(INVITES_PATH)) {
    fs.writeFileSync(INVITES_PATH, JSON.stringify({ totalInvites: {}, invitesByUser: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(INVITES_PATH, 'utf8'));
}

function writeInvites(data) {
  fs.writeFileSync(INVITES_PATH, JSON.stringify(data, null, 2));
}

function addInvite(inviterId, invitedId) {
  const data = readInvites();
  if (!data.invitesByUser[inviterId]) {
    data.invitesByUser[inviterId] = { total: 0, invited: [] };
  }
  data.invitesByUser[inviterId].total += 1;
  data.invitesByUser[inviterId].invited.push({
    userId: invitedId,
    date: new Date().toISOString(),
  });
  writeInvites(data);
}

function removeInvite(inviterId) {
  const data = readInvites();
  if (data.invitesByUser[inviterId] && data.invitesByUser[inviterId].total > 0) {
    data.invitesByUser[inviterId].total -= 1;
    data.invitesByUser[inviterId].invited.pop();
    writeInvites(data);
  }
}

function getInvites(userId) {
  const data = readInvites();
  return data.invitesByUser[userId] || { total: 0, invited: [] };
}

function getLeaderboard(limit = 10) {
  const data = readInvites();
  return Object.entries(data.invitesByUser)
    .map(([userId, info]) => ({ userId, ...info }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invites')
    .setDescription('Invite-Tracker System')
    .addSubcommand(sub =>
      sub.setName('check')
        .setDescription('Zeigt deine Einladungen an')
        .addUserOption(opt =>
          opt.setName('user')
            .setDescription('User dessen Einladungen zeigen')
            .setRequired(false)))
    .addSubcommand(sub =>
      sub.setName('leaderboard')
        .setDescription('Zeigt die Top-Einlader')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'check') {
      const user = interaction.options.getUser('user') || interaction.user;
      const invites = getInvites(user.id);

      const embed = new EmbedBuilder()
        .setTitle(`📨 Einladungen von ${user.username}`)
        .setColor(0x5865F2)
        .addFields(
          { name: '📊 Gesamt', value: `${invites.total}`, inline: true },
        );

      if (invites.invited.length > 0) {
        const recent = invites.invited.slice(-5).reverse();
        const list = recent.map(i => `<@${i.userId}> — <t:${Math.floor(new Date(i.date).getTime() / 1000)}:R>`).join('\n');
        embed.addFields({ name: '👥 Letzte Einladungen', value: list });
      }

      await interaction.reply({ embeds: [embed] });
    }

    if (sub === 'leaderboard') {
      const leaderboard = getLeaderboard(10);

      if (leaderboard.length === 0) {
        return interaction.reply({ content: '📝 Noch keine Einladungen getrackt.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('🏆 Invite Leaderboard')
        .setColor(0xFEE75C)
        .setTimestamp();

      const description = leaderboard.map((entry, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
        return `${medal} <@${entry.userId}> — **${entry.total}** Einladungen`;
      }).join('\n');

      embed.setDescription(description);

      await interaction.reply({ embeds: [embed] });
    }
  },
};

module.exports.addInvite = addInvite;
module.exports.removeInvite = removeInvite;
module.exports.getInvites = getInvites;
module.exports.getLeaderboard = getLeaderboard;
