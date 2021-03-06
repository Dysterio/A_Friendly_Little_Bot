const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const commands = [];
const commandFolders = fs.readdirSync("./slashCommands");
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync("./slashCommands/" + folder).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./slashCommands/${folder}/${file}`);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(`${process.env.TOKEN}`);

(async () => {
    try {
        console.log("Started refreshing application (/) commands");

        await rest.put(
            // Routes.applicationCommands(process.env.CLIENT_ID),
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully registered application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
