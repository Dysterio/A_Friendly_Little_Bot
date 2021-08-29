const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meaningoflife")
        .setDescription("Replies with The Meaning Of Life!"),
    async execute(interaction) {
        await interaction.reply("🐒🐵\n🙊🙉🙈");
    }
}