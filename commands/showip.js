const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('showip')
    .setDescription('Zeigt die Server-IP und den Port an'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Nur Admins können diesen Befehl nutzen.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🌐 VoidAttack Server')
      .setColor(0x5865F2)
      .addFields(
        { name: 'Server IP', value: 'VoidAttack.hostmc.de', inline: true },
        { name: 'Server Port', value: '40163', inline: true },
      )
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ IP wurde angezeigt!', ephemeral: true });
  },
};
