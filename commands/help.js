const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

function getSubcommands(command) {
  const subs = [];
  for (const opt of command.data.options || []) {
    if (opt.type === 1) subs.push(opt.name);
    if (opt.type === 2 && opt.options) {
      for (const sub of opt.options) {
        if (sub.type === 1) subs.push(`${opt.name} ${sub.name}`);
      }
    }
  }
  return subs;
}

function getCategory(command) {
  const raw = command.data.default_member_permissions;
  if (!raw) return 'public';
  const bits = new PermissionsBitField(BigInt(raw));
  const f = PermissionsBitField.Flags;
  if (bits.has(f.Administrator)) return 'admin';
  if (
    bits.any([
      f.KickMembers,
      f.BanMembers,
      f.ModerateMembers,
      f.ManageMessages,
      f.ManageChannels,
      f.ManageRoles,
      f.ManageGuild,
    ])
  ) {
    return 'moderation';
  }
  return 'admin';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt alle Commands und was sie tun'),

  async execute(interaction) {
    const commands = [...interaction.client.commands.values()]
      .filter(c => c.data && c.data.name !== 'help')
      .sort((a, b) => a.data.name.localeCompare(b.data.name));

    const groups = { public: [], moderation: [], admin: [] };
    for (const cmd of commands) {
      groups[getCategory(cmd)].push(cmd);
    }

    const buildEmbed = (title, color, emoji) => {
      return new EmbedBuilder()
        .setTitle(`${emoji} ${title}`)
        .setColor(color)
        .setFooter({ text: 'VoidAttack · Hilfe' })
        .setTimestamp();
    };

    const embeds = [
      buildEmbed('VoidBot – Hilfe', 0x5865F2, '📚')
        .setDescription(
          `Insgesamt **${commands.length} Commands** verfügbar.\n` +
          `**👥 Öffentlich** – jeder kann sie nutzen\n` +
          `**🛡️ Moderation** – braucht Mod-Berechtigungen\n` +
          `**⚙️ Administration** – braucht Administrator`
        ),
    ];

    if (groups.public.length) {
      const embed = buildEmbed('Öffentliche Befehle', 0x57F287, '👥');
      for (const cmd of groups.public) {
        const subs = getSubcommands(cmd);
        embed.addFields({
          name: `/${cmd.data.name}`,
          value: cmd.data.description + (subs.length ? `\n\`${subs.join('`, `')}\`` : ''),
          inline: true,
        });
      }
      embeds.push(embed);
    }

    if (groups.moderation.length) {
      const embed = buildEmbed('Moderation', 0xFEE75C, '🛡️');
      for (const cmd of groups.moderation) {
        const subs = getSubcommands(cmd);
        embed.addFields({
          name: `/${cmd.data.name}`,
          value: cmd.data.description + (subs.length ? `\n\`${subs.join('`, `')}\`` : ''),
          inline: true,
        });
      }
      embeds.push(embed);
    }

    if (groups.admin.length) {
      const embed = buildEmbed('Administration', 0xED4245, '⚙️');
      for (const cmd of groups.admin) {
        const subs = getSubcommands(cmd);
        embed.addFields({
          name: `/${cmd.data.name}`,
          value: cmd.data.description + (subs.length ? `\n\`${subs.join('`, `')}\`` : ''),
          inline: true,
        });
      }
      embeds.push(embed);
    }

    await interaction.reply({ embeds });
  },
};
