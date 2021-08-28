// REPLIT Check :)
// Files
const fs = require("fs");
// NSFW
// const axios = require("axios");
// const tf = require("@tensorflow/tfjs-node");
// const nsfwjs = require("nsfwjs");
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
  //fs.writeFileSync("./log.txt", "Ready [" + new Date().toLocaleString() + "]\n");
});

client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.message.guild.id === "442268458072276992") {
    if (reaction.emoji.name === "isleep") {
      reaction.message.react("<:nosleep:875336279909335090>");
    }
  }
});

client.on("message", message => {
    // Check Tags
    // let atts = message.attachments.array();
    // for (i = 0; i < message.attachments.size; i++) {
    //   let p = pred(atts[i].url);
    //   console.log(p);
    //   if ((p[0].className === "Porn") || (p[0].className === "Sexy") || (p[0].className === "Hentai")) {
    //     if (p[0].probability >= 0.75) {
    //       log(message.url + " => " + p);
    //       return message.lineReplyNoMention("DK would not be happy to see this...");
    //     } else {
    //       message.react("🤔")
    //     }
    //     return;
    //   }
    // }

    var checkIon = message.content.toLowerCase().split(/ +/).includes("ion");
    if (checkIon) { message.react("⚛"); }

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

// async function pred(url) {
//   const pic = await axios.get(url, {
//     responseType: "arraybuffer",
//   });
//   const model = await nsfwjs.load();
//   const img = await tf.node.decodeImage(pic.data, 3);
//   const predictions = await model.classify(img);
//   img.dispose();
//   return predictions;
// }

// function validURL(str) {
//   var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//   if (pattern.test(str)) {
//     return str.match(/\.(jpeg|jpg|gif|png)$/) != null;
//   }
// }

