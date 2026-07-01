const config = require('../config');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const waitingRoomId = config.waitingRoomChannelId;
    const logChannelId = config.waitingLogChannelId;
    if (!waitingRoomId || !logChannelId) return;

    const joined = newState.channelId === waitingRoomId && oldState.channelId !== waitingRoomId;
    if (!joined) return;

    const channel = newState.guild.channels.cache.get(logChannelId);
    if (!channel) return;

    channel.send(
      `<@&${config.staffRoleId}> Jemand ist im **Support Warteraum**!\n` +
      `<@${newState.member.id}> wartet auf Hilfe.`
    );
  },
};
