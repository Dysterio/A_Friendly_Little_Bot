// Files
const fs = require("fs");
// NSFW
const Filter = require("bad-words");
const filter = new Filter();
// Discord
const Discord = require("discord.js");
require('discord-reply');
const client = new Discord.Client();
// Vars
const prefix = "!";
const mySecret = process.env['token'];
const keepAlive = require("./server");

client.admin = new Discord.Collection();
client.commands = new Discord.Collection();
client.responses = new Discord.Collection();

const adminFiles = fs.readdirSync("./admin").filter(file => file.endsWith(".js"));
for (const file of adminFiles) {
  const admin = require(`./admin/${file}`);
  client.admin.set(admin.name, admin);
}

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

const responseFiles = fs.readdirSync("./responses").filter(file => file.endsWith(".js"));
for (const file of responseFiles) {
    const response = require(`./responses/${file}`);
    client.responses.set(response.name, response);
}

client.once("ready", () => {
  fs.writeFileSync("./log.txt", "Ready [" + new Date().toLocaleString() + "]\n");
});

client.on("message", message => {
    // Check for DMs
    if (message.guild == null) {
      // Check for admin
      if (message.author.id === "775649015944708096") {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift();
        const command = client.admin.get(commandName);
        command.execute(client, message, args);
      } else {
        if (message.author.bot) return;
        client.admin.get("reply").execute(client, message);
      }
      return;
    }
    // Check for profanity
    if (filter.isProfane(message.content)) {
      if (message.guild.id != "442268458072276992") {
        log(message.author.username + " was being a bad person at [" + new Date().toLocaleString() + "] in " + message.guild.name);
        
        message.lineReplyNoMention({
          files: [{
            attachment: "./delete.png",
            name: "delete.png"
          }]
        })
      }
      return;
    }
    // Response Handler
    client.responses.forEach(response => {
        if (message.content.toLowerCase().includes(response.name)) {
            if (!(message.author.bot && !response.botUsable)) {
              if (!message.content.startsWith(prefix + "say")) {
                const ret = response.execute(message);
                if (ret) {
                    log(message.author.username + " used " + response.name + " at [" + new Date().toLocaleString() + "] in " + message.guild.name);
                } else {
                    log(message.author.username + " failed to use " + response.name + " at [" + new Date().toLocaleString() + "] in " + message.guild.name);
                }
              }
            }
        }
    });

    // Command Handler
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName);
    if (command == null) return;
    const ret = command.execute(message, args);
    if (ret) {
        log(message.author.username + " used " + prefix + command.name + " at [" + new Date().toLocaleString() + "] in " + message.guild.name);
    } else {
        log(message.author.username + " failed to use " + prefix + command.name + " at [" + new Date().toLocaleString() + "] in " + message.guild.name);
    }
});

keepAlive();
client.login(`${mySecret}`);

function log(text) {
  fs.appendFileSync("./log.txt", text + "\n");
}