const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Lässt den Bot eine Nachricht senden')
    .addStringOption(option =>
      option.setName('nachricht')
        .setDescription('Die Nachricht, die der Bot senden soll')
        .setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('nachricht');
    await interaction.channel.send(message);
    await interaction.reply({ content: '✅ Nachricht wurde gesendet!', ephemeral: true });
  },
};
