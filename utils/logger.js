const { EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');

function getLogChannel(guild) {
  const config = configManager.getAll();
  if (!config.logChannelId) return null;
  return guild.channels.cache.get(config.logChannelId) || null;
}

function truncate(str, max = 1024) {
  if (!str) return '*Empty*';
  return str.length > max ? str.slice(0, max) + '...' : str;
}

module.exports = { getLogChannel, truncate };
