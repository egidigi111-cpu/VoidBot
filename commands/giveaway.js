const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

const activeGiveaways = new Map();

function parseDuration(str) {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  const num = parseInt(match[1]);
  switch (match[2]) {
    case 's': return num * 1000;
    case 'm': return num * 60 * 1000;
    case 'h': return num * 3600 * 1000;
    case 'd': return num * 86400 * 1000;
    default: return null;
  }
}

async function endGiveaway(msg, giveaway) {
  if (giveaway.ended) return;
  giveaway.ended = true;
  clearTimeout(giveaway.timeout);

  const { entries, prize, winners } = giveaway;

  const embed = EmbedBuilder.from(msg.embeds[0])
    .setColor(0x808080)
    .setDescription(
      `**${prize}**\n\n` +
      `⏱️ Beendet`
    );

  await msg.edit({ embeds: [embed], components: [] });

  if (entries.length === 0) {
    await msg.channel.send('❌ Keine Teilnehmer – Giveaway wurde abgebrochen.');
  } else {
    const shuffled = [...entries].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(winners, entries.length));
    const winnerText = picked.map(id => `<@${id}>`).join(', ');

    await msg.channel.send(
      `🎉 **Giveaway beendet!**\n` +
      `**${prize}**\n` +
      `Gewinner: ${winnerText}\n` +
      `Herzlichen Glückwunsch! 🎊`
    );
  }

  activeGiveaways.delete(msg.id);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Giveaway System')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('start')
        .setDescription('Starte ein neues Giveaway')
        .addStringOption(opt =>
          opt.setName('prize')
            .setDescription('Was gibt es zu gewinnen?')
            .setRequired(true))
        .addStringOption(opt =>
          opt.setName('dauer')
            .setDescription('Dauer z.B. 30m, 1h, 2d')
            .setRequired(true))
        .addIntegerOption(opt =>
          opt.setName('gewinner')
            .setDescription('Anzahl der Gewinner (Standard: 1)')
            .setMinValue(1)
            .setMaxValue(20)))
    .addSubcommand(sub =>
      sub.setName('end')
        .setDescription('Beende ein Giveaway vorzeitig')
        .addStringOption(opt =>
          opt.setName('nachricht')
            .setDescription('Die Nachrichten-ID des Giveaways')
            .setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'start') {
      const prize = interaction.options.getString('prize');
      const durationStr = interaction.options.getString('dauer');
      const winners = interaction.options.getInteger('gewinner') || 1;
      const durationMs = parseDuration(durationStr);

      if (!durationMs) {
        return interaction.reply({ content: '❌ Ungültiges Format. Nutze z.B. `30m`, `1h`, `2d`', ephemeral: true });
      }

      const endTime = Date.now() + durationMs;

      const embed = new EmbedBuilder()
        .setTitle('🎉 Giveaway')
        .setDescription(
          `**${prize}**\n\n` +
          `Klicke auf den Button um teilzunehmen!\n\n` +
          `👥 ${winners} Gewinner\n` +
          `⏱️ Endet: <t:${Math.floor(endTime / 1000)}:R>`
        )
        .setColor(0x5865F2)
        .setFooter({ text: `${winners} Gewinner` })
        .setTimestamp(endTime);

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('giveaway_join')
          .setLabel('🎉 Teilnehmen')
          .setStyle(ButtonStyle.Success),
      );

      await interaction.reply({ content: '✅ Giveaway wird erstellt...', ephemeral: true });

      const msg = await interaction.channel.send({ embeds: [embed], components: [button] });

      const giveaway = {
        messageId: msg.id,
        channelId: msg.channel.id,
        guildId: msg.guild.id,
        prize,
        winners,
        endTime,
        entries: [],
        ended: false,
        timeout: null,
      };

      giveaway.timeout = setTimeout(async () => {
        await endGiveaway(msg, giveaway);
      }, durationMs);

      activeGiveaways.set(msg.id, giveaway);

      await interaction.editReply({ content: `✅ Giveaway gestartet: ${msg.url}` });
    }

    if (sub === 'end') {
      const msgId = interaction.options.getString('nachricht');

      const giveaway = activeGiveaways.get(msgId);
      if (!giveaway) {
        return interaction.reply({ content: '❌ Giveaway nicht gefunden oder bereits beendet.', ephemeral: true });
      }

      const channel = interaction.client.channels.cache.get(giveaway.channelId);
      if (!channel) {
        return interaction.reply({ content: '❌ Kanal nicht gefunden.', ephemeral: true });
      }

      try {
        const msg = await channel.messages.fetch(msgId);
        await endGiveaway(msg, giveaway);
        await interaction.reply({ content: '✅ Giveaway wurde vorzeitig beendet!', ephemeral: true });
      } catch {
        await interaction.reply({ content: '❌ Konnte die Nachricht nicht finden.', ephemeral: true });
      }
    }
  },
};

module.exports.activeGiveaways = activeGiveaways;
module.exports.endGiveaway = endGiveaway;
