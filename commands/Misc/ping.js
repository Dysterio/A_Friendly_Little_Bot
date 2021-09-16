const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    usage: "",
    async execute(interaction) {
        await interaction.reply(`💓 ${interaction.client.ws.ping}ms 💓`);
    }
}