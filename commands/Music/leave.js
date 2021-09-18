const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the voice channel"),
    usage: "",
    async execute(interaction) {
        const memberVC = interaction.member.voice.channel;
        if (!memberVC) return interaction.reply("You need to be in a voice channel to execute this command 😤");

        const client = interaction.client;
        const serverQueue = client.musicQueue.get(interaction.guildId);
        if (!serverQueue) return interaction.reply("The bot needs to be in a voice channel to leave it smh...")

        interaction.reply(":cry:");
        serverQueue.songs = [];
        serverQueue.player.stop(true);
    }
}