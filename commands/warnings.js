const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Zeigt alle Verwarnungen eines Users an')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der User, dessen Verwarnungen angezeigt werden sollen')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    const warningsPath = path.join(__dirname, '..', 'data', 'warnings.json');
    if (!fs.existsSync(warningsPath)) {
      return interaction.reply({ content: `✅ **${user.tag}** hat keine Verwarnungen.`, ephemeral: true });
    }

    const warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    const userWarnings = warnings[user.id];

    if (!userWarnings || userWarnings.length === 0) {
      return interaction.reply({ content: `✅ **${user.tag}** hat keine Verwarnungen.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Verwarnungen von ${user.tag}`)
      .setColor(0xffa500)
      .setDescription(`**Anzahl:** ${userWarnings.length}`)
      .setTimestamp();

    userWarnings.forEach((w, i) => {
      const mod = interaction.client.users.cache.get(w.moderator);
      const modTag = mod ? mod.tag : 'Unbekannt';
      const date = new Date(w.date).toLocaleDateString('de-DE');
      embed.addFields({
        name: `#${i + 1} — ${date}`,
        value: `📄 ${w.grund}\n👮 Von: ${modTag}`,
      });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
