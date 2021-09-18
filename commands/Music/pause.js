const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
    usage: "",
    async execute(interaction) {
        const memberVC = interaction.member.voice.channel;
        if (!memberVC) return interaction.reply("You need to be in a voice channel to execute this command 😤");

        const client = interaction.client;
        const serverQueue = client.musicQueue.get(interaction.guildId);
        if (!serverQueue) return interaction.reply("The bot needs to be playing songs first...");

        interaction.reply("Pausing song");
        serverQueue.player.pause(true);
    }
}