const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
    usage: "",
    async execute(interaction) {
        const memberVC = interaction.member.voice.channel;
        if (!memberVC) return interaction.reply("You need to be in a voice channel to execute this command 😤");
        const botVC = interaction.guild.me.voice.channel;
        if (!botVC) return interaction.reply("The bot must be in a voice channel to execute this command 😤");
        if (memberVC.id !== botVC.id) return interaction.reply("You must be in the same voice channel as the bot to execute this command 😤");

        const client = interaction.client;

        interaction.reply("Skipping the current song");
        client.musicPlayer.stop(true);
    }
}