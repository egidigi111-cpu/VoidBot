const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear_warnings')
    .setDescription('Löscht alle Verwarnungen eines Users')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Der User dessen Verwarnungen gelöscht werden sollen')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const warningsPath = path.join(__dirname, '..', 'data', 'warnings.json');

    let warnings = {};
    if (fs.existsSync(warningsPath)) {
      warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    }

    if (!warnings[user.id] || warnings[user.id].length === 0) {
      return interaction.reply({ content: `❌ **${user.tag}** hat keine Verwarnungen.`, ephemeral: true });
    }

    const count = warnings[user.id].length;
    delete warnings[user.id];
    fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

    await interaction.reply({ content: `✅ **${count} Verwarnungen** von **${user.tag}** wurden gelöscht.`, ephemeral: true });
  },
};
