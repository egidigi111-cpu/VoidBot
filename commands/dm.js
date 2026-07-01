const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Sendet eine DM an einen Spieler')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der Spieler')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nachricht')
        .setDescription('Die Nachricht, die gesendet werden soll')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('nachricht');

    try {
      await user.send(message);
      await interaction.reply({ content: `✅ Nachricht an ${user} gesendet!`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ Konnte keine DM an ${user} senden (hat der User DMs deaktiviert?).`, ephemeral: true });
    }
  },
};
