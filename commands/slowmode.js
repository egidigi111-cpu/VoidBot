const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Stellt den Slowmode im aktuellen Kanal ein')
    .addIntegerOption(option =>
      option.setName('sekunden')
        .setDescription('Slowmode in Sekunden (0 = deaktivieren)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const sekunden = interaction.options.getInteger('sekunden');

    await interaction.channel.setRateLimitPerUser(sekunden);

    if (sekunden === 0) {
      await interaction.reply({ content: '✅ Slowmode wurde deaktiviert.', ephemeral: true });
    } else {
      await interaction.reply({ content: `✅ Slowmode gesetzt auf **${sekunden} Sekunden**.`, ephemeral: true });
    }
  },
};
