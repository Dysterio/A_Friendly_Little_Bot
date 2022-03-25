// Libraries
const fs = require("fs");
const winston = require("winston");
require("dotenv").config();
// Require the necessary discord.js classes
const { Client, Collection } = require("discord.js");

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"],
                                partials: ["MESSAGE", "CHANNEL", "REACTION"] });

// Load events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, async (...args) => event.execute(...args));
    } else {
        client.on(event.name, async (...args) => event.execute(...args));
    }
}

// Load slash commands
client.slashCommands = new Collection();
const sCommandFolders = fs.readdirSync("./slashCommands");
for (const folder of sCommandFolders) {
    const commandFiles = fs.readdirSync("./slashCommands/" + folder).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./slashCommands/${folder}/${file}`);
        client.slashCommands.set(command.data.name, command);
    }
}

// Load prefix commands
client.prefixCommands = new Collection();
const pCommandFolders = fs.readdirSync("./prefixCommands");
for (const folder of pCommandFolders) {
    const commandFiles = fs.readdirSync("./prefixCommands/" + folder).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./prefixCommands/${folder}/${file}`);
        client.prefixCommands.set(command.name, command);
    }
}

// Load admin slashCommands
client.admin = new Collection();
const adminFiles = fs.readdirSync("./admin").filter(file => file.endsWith(".js"));
for (const file of adminFiles) {
    const admin = require(`./admin/${file}`);
    client.admin.set(admin.name, admin);
}

// Load music player
client.musicQueue = new Map();

// Load logger
const logLevels = { error: 0, warn: 1, info: 2, };
client.logger = winston.createLogger({
    levels: logLevels,
    transports: [
        new winston.transports.Console({
            level: "info"
        }),
        new winston.transports.File({
            filename: "logs.log",
            level: "info"
        }),
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MMM-YY HH:mm:ss" }),
        winston.format.printf(info => `${info.timestamp} => [${info.level.toUpperCase()}]: ${info.message}`),
    ),
})

// Load Tic Tac Toe
client.tttGames = new Map();
client.tttKBs = require("./gameKeyBinds/tictactoe");

// Load Ultimate TicTacToe
client.utttGames = new Map();
client.utttKBs = require("./gameKeyBinds/ultimatetictactoe");

// Error handler
process.on("unhandledRejection", async error => {
    client.logger.error(error.toString());
    const admin = client.users.cache.get(process.env.ADMIN_ID);
    await admin.send(error.stack);
})

// Login to Discord with the client token
client.login(process.env.TOKEN);