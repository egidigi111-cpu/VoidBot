const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const giveawayCmd = require('../commands/giveaway');
const config = require('../config');

const ticketLabels = {
  bewerbung: { name: '📋 Bewerbung', color: 0x5865F2 },
  refund: { name: '💰 Rückerstattung', color: 0x57F287 },
  unban: { name: '🔓 Entbannung', color: 0xFEE75C },
  support: { name: '🎧 Support', color: 0x5865F2 },
  report: { name: '🚨 Report', color: 0xED4245 },
};

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // ── Slash Commands ────────────────
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Da ist etwas schiefgelaufen!', ephemeral: true });
      }
      return;
    }

    // ── Select Menu (Ticket-Kategorie) ──
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_category') {
      const category = interaction.values[0];
      const user = interaction.user;
      const guild = interaction.guild;

      // Prüfen ob User schon ein offenes Ticket hat (kanalübergreifend)
      const existing = guild.channels.cache.find(
        c => c.parentId === config.ticketCategoryId && c.name.startsWith('ticket-') && c.permissionOverwrites.cache.has(user.id)
      );
      if (existing) {
        return interaction.reply({
          content: `❌ Du hast bereits ein offenes Ticket: ${existing}`,
          ephemeral: true,
        });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        const overwrites = [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
          },
        ];

        if (config.staffRoleId) {
          overwrites.push({
            id: config.staffRoleId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
          });
        }

        const ticketChannel = await guild.channels.create({
          name: `ticket-${category}-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          type: 0,
          parent: config.ticketCategoryId,
          permissionOverwrites: overwrites,
        });

        const label = ticketLabels[category];

        const embed = new EmbedBuilder()
          .setTitle(`⚔️ ${label.name}`)
          .setDescription(
            `**VoidAttack Support**\n\n` +
            `Hallo <@${user.id}>,\n` +
            `das **VoidAttack-Team** wird sich zeitnah um dein Anliegen kümmern.\n\n` +
            `Schildere uns bitte dein Anliegen und warte geduldig.`
          )
          .setColor(label.color)
          .setFooter({ text: 'VoidAttack · Ticket System' })
          .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('🔒 Ticket schließen')
            .setStyle(ButtonStyle.Danger),
        );

        const mention = config.staffRoleId ? `<@${user.id}> <@&${config.staffRoleId}>` : `<@${user.id}>`;
        await ticketChannel.send({ content: mention, embeds: [embed], components: [buttons] });

        await interaction.editReply({
          content: `✅ Dein Ticket wurde erstellt: ${ticketChannel}`,
        });
      } catch (error) {
        console.error('❌ Ticket Fehler:', error);
        await interaction.editReply({
          content: `❌ ${error.message}`,
        });
      }
      return;
    }

    // ── Button (Ticket schließen) ──────
    if (interaction.isButton() && interaction.customId === 'ticket_close') {
      const channel = interaction.channel;

      if (!channel.name.startsWith('ticket-') || channel.name.startsWith('ticket-closed-')) {
        return interaction.reply({ content: '❌ Das ist kein offenes Ticket.', ephemeral: true });
      }

      await interaction.reply('🔒 Ticket wird geschlossen...');

      const overwrites = [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ];

      if (config.staffRoleId) {
        overwrites.push({
          id: config.staffRoleId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
        });
      }

      await channel.permissionOverwrites.set(overwrites);

      const oldName = channel.name;
      const restName = oldName.replace('ticket-', '');
      await channel.setName(`ticket-closed-${restName}`);

      if (config.closedCategoryId) {
        await channel.setParent(config.closedCategoryId);
      }

      const closedEmbed = new EmbedBuilder()
        .setTitle('🔒 Ticket geschlossen')
        .setDescription('Dieses Ticket wurde geschlossen. Nur Staff kann es noch sehen.')
        .setColor(0x808080)
        .setTimestamp();

      await channel.send({ embeds: [closedEmbed] });
      return;
    }

    // ── Giveaway Button ────────────────
    if (interaction.isButton() && interaction.customId === 'giveaway_join') {
      const msg = interaction.message;
      const giveaway = giveawayCmd.activeGiveaways.get(msg.id);

      if (!giveaway || giveaway.ended) {
        return interaction.reply({ content: '❌ Dieses Giveaway ist bereits beendet.', ephemeral: true });
      }

      const userId = interaction.user.id;
      const idx = giveaway.entries.indexOf(userId);

      if (idx === -1) {
        giveaway.entries.push(userId);
        await interaction.reply({ content: '✅ Du nimmst jetzt am Giveaway teil!', ephemeral: true });
      } else {
        giveaway.entries.splice(idx, 1);
        await interaction.reply({ content: '❌ Du hast die Teilnahme zurückgezogen.', ephemeral: true });
      }

      const embed = EmbedBuilder.from(msg.embeds[0])
        .setFooter({ text: `${giveaway.winners} Gewinner · ${giveaway.entries.length} Teilnehmer` });

      await msg.edit({ embeds: [embed] });
      return;
    }
  },
};
