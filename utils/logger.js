const { EmbedBuilder } = require('discord.js');
const configManager = require('./configManager');

async function log(client, { title, description, color = 0x5865F2, fields = [] }) {
  const logChannelId = configManager.get('logChannelId');
  if (!logChannelId) return;

  const channel = client.channels.cache.get(logChannelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  await channel.send({ embeds: [embed] });
}

module.exports = { log };
