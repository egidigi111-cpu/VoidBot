module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`⚔️ ${client.user.tag} ist online!`);
    console.log(`🌐 Auf ${client.guilds.cache.size} Servern`);
    console.log(`🛡️ VoidAttack Ticket System aktiv`);
  },
};
