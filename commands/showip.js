const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('showip')
    .setDescription('Zeigt die Server-IP und den Port an'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Nur Admins können diesen Befehl nutzen.', ephemeral: true });
    }

    await interaction.channel.send(
      'Server IP: VoidAttack.hostmc.de\nServer Port: 40163'
    );
    await interaction.reply({ content: '✅ IP wurde angezeigt!', ephemeral: true });
  },
};
