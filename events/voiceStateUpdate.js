const { PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const config = configManager.getAll();

    // ── Support Warteraum Benachrichtigung ────────────────
    const waitingRoomId = config.waitingRoomChannelId;
    if (waitingRoomId) {
      const joined = newState.channelId === waitingRoomId && oldState.channelId !== waitingRoomId;
      if (joined) {
        const logChannelId = config.waitingLogChannelId;
        if (logChannelId) {
          const channel = newState.guild.channels.cache.get(logChannelId);
          if (channel) {
            await channel.send(
              `<@&${config.staffRoleId}> <@${newState.member.id}> ist im **Support Warteraum**.`
            );
          }
        }
      }
    }

    // ── Temporäre Voice Channels ────────────────
    const tempVoiceHubId = config.tempVoiceChannelId;
    if (!tempVoiceHubId) return;

    // User betritt den Hub-Kanal → Temporären Channel erstellen
    if (newState.channelId === tempVoiceHubId && oldState.channelId !== tempVoiceHubId) {
      try {
        const tempChannel = await newState.guild.channels.create({
          name: `🔊 ${newState.member.user.username}`,
          type: 2, // GUILD_VOICE
          parent: newState.channel.parent,
          permissionOverwrites: [
            {
              id: newState.member.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.ManageChannels,
              ],
            },
            {
              id: newState.guild.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
            },
          ],
        });

        await newState.setChannel(tempChannel);
      } catch (error) {
        console.error('Temp Voice Fehler:', error);
      }
    }

    // Temporärer Channel verlassen → Löschen wenn leer
    if (oldState.channel && oldState.channel !== newState.channel) {
      const channel = oldState.channel;
      if (channel.name.startsWith('🔊 ') && channel.members.size === 0) {
        try {
          await channel.delete();
        } catch {}
      }
    }
  },
};
