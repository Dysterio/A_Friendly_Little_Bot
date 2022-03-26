const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Replies with a list of the commands!"),
    usage: "",
    async execute(interaction) {
        // Create embed
        let slashCommands = new MessageEmbed()
            .setColor("#0000000")
            .setTitle("A Friendly Little Bot's Slash Commands")
            .setThumbnail(interaction.client.users.cache.get(process.env.ADMIN_ID).avatarURL());
        // Add slash commands
        const sCommandFolders = fs.readdirSync("./slashCommands");
        for (const folder of sCommandFolders) {
            let group = "";
            const commandFiles = fs.readdirSync("./slashCommands/" + folder).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../../slashCommands/${folder}/${file}`);
                group += `**/${command.data.name} ${command.usage}**\n➠${command.data.description}\n`;
            }
            slashCommands.addField(folder + " ⭐", group);
        }
        // Create embed
        let prefixCommands = new MessageEmbed()
            .setColor("#0000000")
            .setTitle("A Friendly Little Bot's Prefix Commands")
        // Add prefix commands
        const pCommandFolders = fs.readdirSync("./prefixCommands");
        for (const folder of pCommandFolders) {
            let group = "";
            const commandFiles = fs.readdirSync("./prefixCommands/" + folder).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../../prefixCommands/${folder}/${file}`);
                group += `**/${command.name} ${command.usage}**\n➠${command.description}\n`;
            }
            prefixCommands.addField(folder + " ⭐", group);
        }
        // Send commands
        interaction.reply({ embeds: [slashCommands, prefixCommands] }).then(() => {
            interaction.client.logger.info("Retrieved user commands");
        });
    }
}