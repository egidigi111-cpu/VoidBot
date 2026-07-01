const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    // Alle globalen Commands anzeigen und löschen
    const globalCommands = await rest.get(Routes.applicationCommands(config.clientId));
    console.log(`📋 Globale Commands gefunden: ${globalCommands.length}`);
    for (const cmd of globalCommands) {
      console.log(`  - ${cmd.name}`);
    }

    console.log('🗑️ Lösche ALLE globalen Commands...');
    await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
    console.log('✅ Globale Commands gelöscht');

    // Alle Guild-Commands löschen
    const guildCommands = await rest.get(Routes.applicationGuildCommands(config.clientId, config.guildId));
    console.log(`📋 Guild-Commands gefunden: ${guildCommands.length}`);
    for (const cmd of guildCommands) {
      console.log(`  - ${cmd.name}`);
    }

    console.log('🗑️ Lösche ALLE Guild-Commands...');
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] });
    console.log('✅ Guild-Commands gelöscht');

    // Frisch registrieren nur für den Server
    console.log(`📝 Registriere ${commands.length} Commands...`);
    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    console.log(`✅ ${data.length} Commands erfolgreich registriert!`);
    for (const cmd of data) {
      console.log(`  - /${cmd.name}`);
    }
  } catch (error) {
    console.error('❌ Fehler:', error.message);
  }
})();
