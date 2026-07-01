const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '..', 'data', 'status.json');

const icons = {
  online: '🟢',
  offline: '🔴',
  maintenance: '🟡',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Zeigt den aktuellen Server-Status'),
  async execute(interaction) {
    let status = 'online';
    try {
      const data = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      status = data.status || 'online';
    } catch {}

    const icon = icons[status] || '❓';

    await interaction.channel.send(
      `${icon} Server Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`
    );
    await interaction.reply({ content: '✅ Status wurde angezeigt!', ephemeral: true });
  },
};
