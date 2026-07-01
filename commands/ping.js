const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Zeigt die Latenz des Bots an'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '📡 Pong!', fetchReply: true });

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setColor(0x5865F2)
      .addFields(
        { name: '⏱️ Roundtrip', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
        { name: '💓 WebSocket', value: `${interaction.client.ws.ping}ms`, inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
