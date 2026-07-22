const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Erstellt eine Umfrage')
    .addStringOption(option =>
      option.setName('frage')
        .setDescription('Die Frage für die Umfrage')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('optionen')
        .setDescription('Antwortmöglichkeiten (kommagetrennt, max 10)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const frage = interaction.options.getString('frage');
    const optionenStr = interaction.options.getString('optionen');

    const emojiZahlen = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    const embed = new EmbedBuilder()
      .setTitle('📊 Umfrage')
      .setDescription(`**${frage}**`)
      .setColor(0x5865F2)
      .setFooter({ text: `Erstellt von ${interaction.user.tag}` })
      .setTimestamp();

    let msg;

    if (optionenStr) {
      const optionen = optionenStr.split(',').map(o => o.trim()).slice(0, 10);

      const description = optionen.map((opt, i) => `${emojiZahlen[i]} ${opt}`).join('\n');
      embed.setDescription(`**${frage}**\n\n${description}`);

      msg = await interaction.channel.send({ embeds: [embed] });

      for (let i = 0; i < optionen.length; i++) {
        await msg.react(emojiZahlen[i]);
      }
    } else {
      msg = await interaction.channel.send({ embeds: [embed] });
      await msg.react('👍');
      await msg.react('👎');
    }

    await interaction.reply({ content: '✅ Umfrage erstellt!', ephemeral: true });
  },
};
