const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
// Load commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const commandPath = path.join(__dirname, 'commands', file);
    const command = require(commandPath);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Deploy commands to all guilds
const deployCommandsGlobally = async () => {
    // Delete all commands
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
        .then(() => console.log('Successfully deleted all application commands.'))
        .catch(console.error);
    // Deploy commands
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
};

// Deploy commands to dev guild
const deployCommandsToDevGuild = async () => {
    // Delete all commands
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID), { body: [] })
        .then(() => console.log('Successfully deleted all application commands.'))
        .catch(console.error);
    // Deploy commands
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
};


// Deploy commands
(async () => {
    try {
        deployCommandsToDevGuild();
    } catch (error) {
        console.error(error);
    }
})();