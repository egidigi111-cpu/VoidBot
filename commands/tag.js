const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Verwaltet Custom Tags (mit !tagname)')
    .addSubcommand(sub =>
      sub.setName('create')
        .setDescription('Einen neuen Tag erstellen')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Der Tag-Name (ohne !)')
            .setRequired(true))
        .addStringOption(opt =>
          opt.setName('antwort')
            .setDescription('Die Antwort des Tags')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Einen Tag löschen')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Der Tag-Name der gelöscht werden soll')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Alle Tags anzeigen'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const config = configManager.getAll();

    if (!config.tags) config.tags = {};

    if (sub === 'create') {
      const name = interaction.options.getString('name').toLowerCase().replace(/!/g, '');
      const antwort = interaction.options.getString('antwort');

      config.tags[name] = antwort;
      configManager.writeConfig(config);
      await interaction.reply({ content: `✅ Tag \`!${name}\` wurde erstellt.`, ephemeral: true });
    }

    if (sub === 'delete') {
      const name = interaction.options.getString('name').toLowerCase().replace(/!/g, '');

      if (!config.tags[name]) {
        return interaction.reply({ content: `❌ Tag \`!${name}\` existiert nicht.`, ephemeral: true });
      }

      delete config.tags[name];
      configManager.writeConfig(config);
      await interaction.reply({ content: `✅ Tag \`!${name}\` wurde gelöscht.`, ephemeral: true });
    }

    if (sub === 'list') {
      const tagNames = Object.keys(config.tags);

      if (tagNames.length === 0) {
        return interaction.reply({ content: '📝 Keine Tags vorhanden.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('🏷️ Custom Tags')
        .setDescription(tagNames.map(t => `\`!${t}\``).join('\n'))
        .setColor(0x5865F2)
        .setFooter({ text: `${tagNames.length} Tags · Nutze !tagname` });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
