const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Schließt das aktuelle Ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
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
  },
};
