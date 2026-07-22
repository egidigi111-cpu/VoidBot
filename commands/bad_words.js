const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bad_words')
    .setDescription('Verwaltet verbotene Wörter')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Ein verbotenes Wort hinzufügen')
        .addStringOption(opt =>
          opt.setName('wort')
            .setDescription('Das Wort das verboten werden soll')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Ein verbotenes Wort entfernen')
        .addStringOption(opt =>
          opt.setName('wort')
            .setDescription('Das Wort das entfernt werden soll')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Alle verbotenen Wörter anzeigen'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const config = configManager.getAll();

    if (!config.badWords) config.badWords = [];

    if (sub === 'add') {
      const wort = interaction.options.getString('wort').toLowerCase();

      if (config.badWords.includes(wort)) {
        return interaction.reply({ content: `❌ \`${wort}\` ist bereits verboten.`, ephemeral: true });
      }

      config.badWords.push(wort);
      configManager.writeConfig(config);
      await interaction.reply({ content: `✅ \`${wort}\` wurde zur Verboten-Liste hinzugefügt.`, ephemeral: true });
    }

    if (sub === 'remove') {
      const wort = interaction.options.getString('wort').toLowerCase();
      const idx = config.badWords.indexOf(wort);

      if (idx === -1) {
        return interaction.reply({ content: `❌ \`${wort}\` ist nicht in der Liste.`, ephemeral: true });
      }

      config.badWords.splice(idx, 1);
      configManager.writeConfig(config);
      await interaction.reply({ content: `✅ \`${wort}\` wurde aus der Verboten-Liste entfernt.`, ephemeral: true });
    }

    if (sub === 'list') {
      if (config.badWords.length === 0) {
        return interaction.reply({ content: '📝 Keine verbotenen Wörter hinterlegt.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('🚫 Verbotene Wörter')
        .setDescription(config.badWords.map(w => `\`${w}\``).join('\n'))
        .setColor(0xED4245)
        .setFooter({ text: `${config.badWords.length} Wörter` });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
