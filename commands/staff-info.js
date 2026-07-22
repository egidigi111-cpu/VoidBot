const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff-info')
    .setDescription('Zeigt ein Staff-Mitglieder-Leaderboard')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const warningsPath = path.join(__dirname, '..', 'data', 'warnings.json');
    let warnings = {};
    if (fs.existsSync(warningsPath)) {
      warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    }

    const modStats = {};

    for (const [userId, warns] of Object.entries(warnings)) {
      for (const warn of warns) {
        const modId = warn.moderator;
        if (!modStats[modId]) {
          modStats[modId] = { warns: 0, bans: 0, kicks: 0 };
        }
        modStats[modId].warns++;
      }
    }

    const entries = Object.entries(modStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.warns - a.warns)
      .slice(0, 10);

    if (entries.length === 0) {
      return interaction.reply({ content: '📝 Noch keine Moderations-Aktivitäten vorhanden.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🛡️ Staff Leaderboard')
      .setColor(0x5865F2)
      .setTimestamp();

    const description = entries.map((entry, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
      return `${medal} <@${entry.id}> — ${entry.warns} Verwarnungen`;
    }).join('\n');

    embed.setDescription(description);

    await interaction.reply({ embeds: [embed] });
  },
};
