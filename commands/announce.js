const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Sendet eine offizielle Ankündigung')
    .addStringOption(option =>
      option.setName('titel')
        .setDescription('Der Titel der Ankündigung')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nachricht')
        .setDescription('Die Nachricht der Ankündigung')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Ziel-Kanal (Standard: aktueller Kanal)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('farbe')
        .setDescription('Hex-Farbe (z.B. 5865F2)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const titel = interaction.options.getString('titel');
    const nachricht = interaction.options.getString('nachricht');
    const kanal = interaction.options.getChannel('kanal') || interaction.channel;
    const farbe = interaction.options.getString('farbe');

    const color = farbe ? parseInt(farbe, 16) : 0x5865F2;

    const embed = new EmbedBuilder()
      .setTitle(titel)
      .setDescription(nachricht)
      .setColor(color)
      .setFooter({ text: `Angekündigt von ${interaction.user.tag}` })
      .setTimestamp();

    await kanal.send({ embeds: [embed] });
    await interaction.reply({ content: `✅ Ankündigung gesendet in ${kanal}`, ephemeral: true });
  },
};
