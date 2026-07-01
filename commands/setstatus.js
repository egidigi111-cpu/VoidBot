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

    let messageId, channelId;
    try {
      const data = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      messageId = data.messageId;
      channelId = data.channelId;
    } catch {}

    if (messageId && channelId) {
      const channel = interaction.client.channels.cache.get(channelId);
      if (channel) {
        try {
          const msg = await channel.messages.fetch(messageId);
          const embed = EmbedBuilder.from(msg.embeds[0])
            .setDescription(`**${cfg.emoji} ${cfg.label}**`)
            .setColor(cfg.color)
            .setTimestamp();
          await msg.edit({ embeds: [embed] });
        } catch {}
      }
    }

    fs.writeFileSync(statusFile, JSON.stringify({
      status: choice,
      messageId,
      channelId,
    }));

    await interaction.reply({ content: `✅ Status auf **${cfg.emoji} ${cfg.label}** geändert!`, ephemeral: true });
  },
};
