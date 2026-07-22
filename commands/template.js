const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const configManager = require('../utils/configManager');
const fs = require('fs');
const path = require('path');

const TEMPLATES_PATH = path.join(__dirname, '..', 'data', 'templates.json');

function readTemplates() {
  if (!fs.existsSync(TEMPLATES_PATH)) {
    fs.writeFileSync(TEMPLATES_PATH, '{}');
  }
  return JSON.parse(fs.readFileSync(TEMPLATES_PATH, 'utf8'));
}

function writeTemplates(data) {
  fs.writeFileSync(TEMPLATES_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('template')
    .setDescription('Server-Layout speichern oder laden')
    .addSubcommand(sub =>
      sub.setName('save')
        .setDescription('Das aktuelle Server-Layout speichern')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name für das Template')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('load')
        .setDescription('Ein gespeichertes Layout laden')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name des Templates')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Alle gespeicherten Templates anzeigen'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'save') {
      const name = interaction.options.getString('name');
      const guild = interaction.guild;

      await interaction.deferReply({ ephemeral: true });

      const channels = guild.channels.cache.map(ch => ({
        id: ch.id,
        name: ch.name,
        type: ch.type,
        parentId: ch.parentId,
        position: ch.position,
      }));

      const roles = guild.roles.cache
        .filter(r => r.name !== '@everyone')
        .map(r => ({
          id: r.id,
          name: r.name,
          color: r.color,
          position: r.position,
          permissions: r.permissions.bitfield.toString(),
        }));

      const templates = readTemplates();
      templates[name] = { channels, roles, savedAt: new Date().toISOString() };
      writeTemplates(templates);

      await interaction.editReply({ content: `✅ Template \`${name}\` gespeichert mit ${channels.length} Kanälen und ${roles.length} Rollen.` });
    }

    if (sub === 'load') {
      const name = interaction.options.getString('name');
      const templates = readTemplates();

      if (!templates[name]) {
        return interaction.reply({ content: `❌ Template \`${name}\` nicht gefunden.`, ephemeral: true });
      }

      await interaction.reply({ content: `📋 Template \`${name}\` gefunden. Wird geladen...`, ephemeral: true });

      const template = templates[name];

      for (const roleData of template.roles) {
        try {
          const existing = interaction.guild.roles.cache.get(roleData.id);
          if (existing && existing.name !== '@everyone') {
            await existing.setPosition(roleData.position);
          }
        } catch {}
      }

      await interaction.editReply({ content: `✅ Template \`${name}\` geladen! Rollen wurden aktualisiert.` });
    }

    if (sub === 'list') {
      const templates = readTemplates();
      const names = Object.keys(templates);

      if (names.length === 0) {
        return interaction.reply({ content: '📝 Keine Templates gespeichert.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('📋 Gespeicherte Templates')
        .setDescription(names.map(n => {
          const t = templates[n];
          return `\`${n}\` - ${t.channels.length} Kanäle, ${t.roles.length} Rollen`;
        }).join('\n'))
        .setColor(0x5865F2);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
