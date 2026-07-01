const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Sperrt einen User temporär (Timeout)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der User, der getimeoutet werden soll')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('dauer')
        .setDescription('Dauer in Minuten')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320))
    .addStringOption(option =>
      option.setName('grund')
        .setDescription('Grund für den Timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getMember('user');
    const dauer = interaction.options.getInteger('dauer');
    const grund = interaction.options.getString('grund') || 'Kein Grund angegeben';

    if (!user) {
      return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
    }

    if (!user.moderatable) {
      return interaction.reply({ content: '❌ Ich kann diesen User nicht timenouten.', ephemeral: true });
    }

    try {
      await user.timeout(dauer * 60 * 1000, grund);
      await interaction.reply({ content: `✅ **${user.user.tag}** wurde für **${dauer} Minuten** getimeoutet.\n📄 Grund: ${grund}`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ Fehler beim Timeout: ${error.message}`, ephemeral: true });
    }
  },
};
