// Requires
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Load events
client.events = new Collection();
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const eventPath = path.join(__dirname, 'events', file);
    const event = require(eventPath);
    client.events.set(event.name, event);
    // Bind event
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const commandPath = path.join(__dirname, 'commands', file);
    const command = require(commandPath);
    client.commands.set(command.data.name, command);
}

// Load responses
client.responses = new Collection();
const responseFiles = fs.readdirSync(path.join(__dirname, 'responses')).filter(file => file.endsWith('.js'));
for (const file of responseFiles) {
    const responsePath = path.join(__dirname, 'responses', file);
    const response = require(responsePath);
    client.responses.set(response.name, response);
}

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch((err) => {
    console.error(err);
});

// Log In
client.login(process.env.TOKEN);