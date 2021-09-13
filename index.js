// Libraries
const fs = require("fs");
const winston = require("winston");
require("dotenv").config();
const keepAlive = require("./server");
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

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

// Load responses
client.responses = new Collection();
const responseFiles = fs.readdirSync("./responses").filter(file => file.endsWith(".js"));
for (const file of responseFiles) {
    const response = require(`./responses/${file}`);
    client.responses.set(response.name, response);
}

// Load admin commands
client.admin = new Collection();
const adminFiles = fs.readdirSync("./admin").filter(file => file.endsWith(".js"));
for (const file of adminFiles) {
    const admin = require(`./admin/${file}`);
    client.admin.set(admin.name, admin);
}

// Load music player
(async () => {
    client.musicPlayer = await require("@discordjs/voice").createAudioPlayer();
    client.musicConnection = null;
    client.musicQueue = [];
})();


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

// Error handler
process.on("unhandledRejection", error => {
    client.logger.error(error.toString());
    const admin = client.users.cache.get(process.env.ADMIN_ID);
    admin.send(error.toString());
})

// Login to Discord with the client token
keepAlive();
client.login(process.env.TOKEN);