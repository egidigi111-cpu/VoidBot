module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const waitingRoomId = '1435701364624719873';
    const logChannelId = '1436704580284055622';

    const joined = newState.channelId === waitingRoomId && oldState.channelId !== waitingRoomId;
    if (!joined) return;

    const channel = newState.guild.channels.cache.get(logChannelId);
    if (!channel) return;

    channel.send(
      `<@${newState.member.id}> ist im **Support Warteraum**.`
    );
  },
};
