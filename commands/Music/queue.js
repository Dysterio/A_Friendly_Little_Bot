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
        const songQueue = client.musicQueue.get(interaction.guildId).songs;

        // Create embed
        let songs = new MessageEmbed()
            .setColor("#0000000")
            .setTitle("Songs Queue")
            .setDescription(`Now playing: [${songQueue[0].title}](${songQueue[0].url})`);
        // Add songs
        let upNext = "";
        songQueue.forEach(song => {
            if (song !== songQueue[0]) {
                upNext += `[${song.title}](${song.url})\n`;
            }
        })
        if (upNext !== "") {
            songs.addField("Up Next:", upNext);
        }
        // Send commands
        await interaction.reply({ embeds: [songs] });
    }
}