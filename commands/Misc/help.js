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
        let commands = new MessageEmbed()
            .setColor("#0000000")
            .setTitle("A Friendly Little Bot's Commands")
            .setThumbnail(interaction.client.users.cache.get(process.env.ADMIN_ID).avatarURL());
        // Add commands
        const commandFolders = fs.readdirSync("./commands");
        for (const folder of commandFolders) {
            let group = "";
            const commandFiles = fs.readdirSync("./commands/" + folder).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                group += `**/${command.data.name} ${command.usage}**\n➠${command.data.description}\n`;
            }
            commands.addField(folder + " ⭐", group);
        }
        // Send commands
        interaction.reply({ embeds: [commands] }).then(() => {
            interaction.client.logger.info("Retrieved user commands");
        });
    }
}