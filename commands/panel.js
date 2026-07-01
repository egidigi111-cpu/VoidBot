const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Sendet das Ticket-Panel in den aktuellen Kanal'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Nur Admins können das Panel senden.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('⚔️ VoidAttack Support')
      .setDescription(
        'Brauchst du Hilfe? Das **VoidAttack-Team** ist für dich da!\n\n' +
        'Wähle eine Kategorie im Dropdown unten.'
      )
      .setColor(0x5865F2)
      .addFields(
        { name: '📋 Bewerbung', value: 'Team-Bewerbung einreichen', inline: true },
        { name: '💰 Rückerstattung', value: 'Refund anfragen', inline: true },
        { name: '🔓 Entbannung', value: 'Unban-Antrag stellen', inline: true },
        { name: '🎧 Support', value: 'Allgemeiner Support', inline: true },
        { name: '🚨 Report', value: 'Spieler melden', inline: true },
      )
      .setFooter({ text: 'VoidAttack · Bitte erstelle nur Tickets bei echten Anliegen.' })
      .setTimestamp();

    const select = new StringSelectMenuBuilder()
      .setCustomId('ticket_category')
      .setPlaceholder('📌 Kategorie auswählen...')
      .addOptions([
        { label: 'Bewerbung', description: 'Team-Bewerbung einreichen', value: 'bewerbung', emoji: '📋' },
        { label: 'Rückerstattung', description: 'Refund anfragen', value: 'refund', emoji: '💰' },
        { label: 'Entbannung', description: 'Unban-Antrag stellen', value: 'unban', emoji: '🔓' },
        { label: 'Support', description: 'Allgemeiner Support', value: 'support', emoji: '🎧' },
        { label: 'Report', description: 'Spieler melden', value: 'report', emoji: '🚨' },
      ]);

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Panel wurde gesendet!', ephemeral: true });
  },
};
