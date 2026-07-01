require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  ticketCategoryId: process.env.TICKET_CATEGORY_ID,
  staffRoleId: process.env.STAFF_ROLE_ID,
  closedCategoryId: process.env.CLOSED_CATEGORY_ID,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  waitingRoomChannelId: process.env.WAITING_ROOM_CHANNEL_ID,
  waitingLogChannelId: process.env.WAITING_LOG_CHANNEL_ID,
};
