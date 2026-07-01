const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '..', 'data', 'status.json');

const config = {
  online:  { color: 0x00FF00, emoji: '🟢', label: 'Online' },
  offline: { color: 0xFF0000, emoji: '🔴', label: 'Offline' },
  maintenance: { color: 0xFFAA00, emoji: '🟡', label: 'Maintenance' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Zeigt den aktuellen Server-Status'),
  async execute(interaction) {
    let current = 'online';
    try {
      const data = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      current = data.status || 'online';
    } catch {}

    const cfg = config[current] || { color: 0x808080, emoji: '❓', label: 'Unbekannt' };

    const embed = new EmbedBuilder()
      .setTitle('📊 Server Status')
      .setDescription(`**${cfg.emoji} ${cfg.label}**`)
      .setColor(cfg.color)
      .addFields(
        { name: 'Server IP', value: 'VoidAttack.hostmc.de', inline: true },
        { name: 'Server Port', value: '40163', inline: true },
      )
      .setFooter({ text: 'VoidAttack' })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Status wurde angezeigt!', ephemeral: true });
  },
};
