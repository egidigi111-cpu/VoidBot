const { EmbedBuilder } = require('discord.js');
const { getLogChannel, truncate } = require('../utils/logger');

function handleMessageDelete(message) {
  if (message.author?.bot) return;
  if (!message.guild) return;

  const logChannel = getLogChannel(message.guild);
  if (!logChannel) return;
  if (message.channel.id === logChannel.id) return;

  const embed = new EmbedBuilder()
    .setColor(0x2F3136)
    .setTitle('Message Deleted')
    .setDescription(
      `**Author:** ${message.author ? message.author.tag : 'Unknown'} (${message.author?.id || 'N/A'})\n` +
      `**Channel:** ${message.channel}\n` +
      `**Content:**\n${truncate(message.content)}`
    )
    .setFooter({ text: 'VoidAttack · Audit Log' })
    .setTimestamp();

  if (message.attachments.size > 0) {
    embed.addFields(
      message.attachments.map(a => ({
        name: 'Attachment',
        value: a.name,
        inline: false,
      }))
    );
  }

  logChannel.send({ embeds: [embed] }).catch(() => {});
}

function handleMessageUpdate(oldMessage, newMessage) {
  if (oldMessage.author?.bot) return;
  if (!oldMessage.guild) return;
  if (oldMessage.content === newMessage.content) return;

  const logChannel = getLogChannel(oldMessage.guild);
  if (!logChannel) return;
  if (oldMessage.channel.id === logChannel.id) return;

  const embed = new EmbedBuilder()
    .setColor(0x2F3136)
    .setTitle('Message Edited')
    .setDescription(
      `**Author:** ${oldMessage.author.tag} (${oldMessage.author.id})\n` +
      `**Channel:** ${oldMessage.channel}\n` +
      `**Before:**\n${truncate(oldMessage.content)}\n` +
      `**After:**\n${truncate(newMessage.content)}`
    )
    .setFooter({ text: 'VoidAttack · Audit Log' })
    .setTimestamp();

  logChannel.send({ embeds: [embed] }).catch(() => {});
}

function handleGuildMemberUpdate(oldMember, newMember) {
  const logChannel = getLogChannel(oldMember.guild);
  if (!logChannel) return;

  if (oldMember.displayName !== newMember.displayName) {
    const embed = new EmbedBuilder()
      .setColor(0x2F3136)
      .setTitle('Nickname Changed')
      .setDescription(
        `**User:** ${newMember.user.tag} (${newMember.user.id})\n` +
        `**Before:** ${oldMember.displayName}\n` +
        `**After:** ${newMember.displayName}`
      )
      .setFooter({ text: 'VoidAttack · Audit Log' })
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => {});
  }

  if (oldMember.user.avatarURL() !== newMember.user.avatarURL()) {
    const embed = new EmbedBuilder()
      .setColor(0x2F3136)
      .setTitle('Avatar Changed')
      .setDescription(
        `**User:** ${newMember.user.tag} (${newMember.user.id})`
      )
      .setThumbnail(newMember.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: 'VoidAttack · Audit Log' })
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => {});
  }
}

function handleMessageCreate(message) {
  if (message.author.bot) return;
  if (!message.guild) return;

  const logChannel = getLogChannel(message.guild);
  if (!logChannel) return;
  if (message.channel.id === logChannel.id) return;

  const embed = new EmbedBuilder()
    .setColor(0x2F3136)
    .setTitle('Message Sent')
    .setDescription(
      `**Author:** ${message.author.tag} (${message.author.id})\n` +
      `**Channel:** ${message.channel}\n` +
      `**Content:**\n${truncate(message.content)}`
    )
    .setFooter({ text: 'VoidAttack · Audit Log' })
    .setTimestamp();

  if (message.attachments.size > 0) {
    embed.addFields(
      message.attachments.map(a => ({
        name: 'Attachment',
        value: a.url,
        inline: false,
      }))
    );
  }

  logChannel.send({ embeds: [embed] }).catch(() => {});
}

function register(client) {
  client.on('messageCreate', handleMessageCreate);
  client.on('messageUpdate', handleMessageUpdate);
  client.on('messageDelete', handleMessageDelete);
  client.on('guildMemberUpdate', handleGuildMemberUpdate);
}

module.exports = { register };
