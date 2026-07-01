const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
    .setName('setstatus')
    .setDescription('Setzt den Server-Status')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt.setName('status')
        .setDescription('Der neue Status')
        .setRequired(true)
        .addChoices(
          { name: 'Online', value: 'online' },
          { name: 'Offline', value: 'offline' },
          { name: 'Maintenance', value: 'maintenance' },
        )),
  async execute(interaction) {
    const choice = interaction.options.getString('status');
    const cfg = config[choice];

    fs.writeFileSync(statusFile, JSON.stringify({ status: choice }));

    const embed = new EmbedBuilder()
      .setTitle('ℹ️ Server Status geändert')
      .setDescription(`Der Server-Status wurde auf **${cfg.emoji} ${cfg.label}** geändert`)
      .setColor(cfg.color)
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Status wurde geändert!', ephemeral: true });
  },
};
