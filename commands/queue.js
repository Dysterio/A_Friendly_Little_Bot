const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the songs queued"),
    usage: "",
    async execute(interaction) {
        const memberVC = interaction.member.voice.channel;
        if (!memberVC) return interaction.reply("You need to be in a voice channel to execute this command 😤");
        const botVC = interaction.guild.me.voice.channel;
        if (!botVC) return interaction.reply("The bot must be in a voice channel to execute this command 😤");
        if (memberVC.id !== botVC.id) return interaction.reply("You must be in the same voice channel as the bot to execute this command 😤");

        const client = interaction.client;

        let vidID = client.nowPlaying.url.split("watch?v=")[1];
        const ampPos = vidID.indexOf("&");
        if (ampPos !== -1) vidID = vidID.substring(0, ampPos);
        console.log(`https://img.youtube.com/vi/${vidID}/0.jpg`);
        // Create embed
        let songs = new MessageEmbed()
            .setColor("#0000000")
            .setTitle("Songs Queue")
            .setDescription(`Now playing: [${client.nowPlaying.title}](${client.nowPlaying.url})`)
            .setThumbnail(`https://img.youtube.com/vi/${vidID}/0.jpg`);
        // Add commands
        let upNext = "";
        client.musicQueue.forEach(song => {
            upNext += `[${song.title}](${song.url})\n`;
        })
        songs.addField("Up Next:", upNext);
        // Send commands
        interaction.reply({ embeds: [songs] }).then(() => {
            interaction.client.logger.info("Retrieved song queue");
        });
    }
}