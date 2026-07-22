const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ── Config laden (Railway-kompatibel) ────────────────
if (!process.env.DISCORD_TOKEN) {
  require('dotenv').config();
}

const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

// ── Commands laden ────────────────
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ── Events laden ────────────────
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

const interactionHandler = require('./events/interactionCreate');

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.name === 'interactionCreate') {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
    continue;
  }

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// ── Message Handler (für Tags, Bad Words, Counting, Leveling) ────────────────
client.on('messageCreate', (message) => {
  interactionHandler.handleMessage(message);
});

// ── Commands registrieren beim Start ────────────────
client.once('ready', async () => {
  console.log(`✅ Eingeloggt als ${client.user.tag}`);

  if (!config.clientId || !config.guildId) {
    console.log('⚠️ CLIENT_ID oder GUILD_ID fehlt – Commands werden nicht registriert.');
    return;
  }

  try {
    const commands = client.commands.map(cmd => cmd.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(config.token);

    console.log(`📝 Registriere ${commands.length} Commands...`);
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );
    console.log(`✅ ${commands.length} Commands erfolgreich registriert!`);
  } catch (error) {
    console.error('❌ Fehler beim Registrieren der Commands:', error.message);
  }
});

client.login(config.token);
