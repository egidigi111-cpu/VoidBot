const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Verwarnt einen User')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der User, der verwarnt werden soll')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('grund')
        .setDescription('Grund für die Verwarnung')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');
    const grund = interaction.options.getString('grund') || 'Kein Grund angegeben';

    const warningsPath = path.join(__dirname, '..', 'data', 'warnings.json');
    let warnings = {};
    if (fs.existsSync(warningsPath)) {
      warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    }

    if (!warnings[user.id]) {
      warnings[user.id] = [];
    }

    warnings[user.id].push({
      grund: grund,
      date: new Date().toISOString(),
      moderator: interaction.user.id,
    });

    fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

    const anzahl = warnings[user.id].length;
    const warnText = anzahl === 1 ? 'Verwarnung' : 'Verwarnungen';

    if (member && member.moderatable) {
      await member.timeout(anzahl * 60 * 1000, `Automatischer Timeout nach ${anzahl} ${warnText}`);
    }

    await interaction.reply({ content: `✅ **${user.tag}** wurde verwarnt (${anzahl}. ${warnText})\n📄 Grund: ${grund}`, ephemeral: true });

    try {
      await user.send(`⚠️ Du wurdest auf **${interaction.guild.name}** verwarnt.\n📄 Grund: ${grund}\n🔢 ${anzahl}. ${warnText}`);
    } catch {
      // DMs deaktiviert
    }
  },
};
