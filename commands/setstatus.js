const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '..', 'data', 'status.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstatus')
    .setDescription('Setzt den Server-Status')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt.setName('status')
        .setDescription('Der neue Status')
        .setRequired(true)
        .addChoices(
          { name: 'Online', value: 'online' },
          { name: 'Offline', value: 'offline' },
          { name: 'Maintenance', value: 'maintenance' },
        )),
  async execute(interaction) {
    const status = interaction.options.getString('status');
    fs.writeFileSync(statusFile, JSON.stringify({ status }));
    await interaction.reply({ content: `✅ Status wurde auf **${status}** gesetzt!`, ephemeral: true });
  },
};
