const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

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
        interaction.client.commands.forEach(command => {
            commands.addField(`!${command.data.name} ${command.usage}`, command.data.description);
        })
        // Send commands
        interaction.reply({ embeds: [commands] }).then(() => {
            interaction.client.logger.info("Retrieved user commands");
        });
    }
}