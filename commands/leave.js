const { SlashCommandBuilder } = require("@discordjs/builders");
const {joinVoiceChannel} = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the voice channel"),
    usage: "",
    async execute(interaction) {
        const memberVC = interaction.member.voice.channel;
        if (!memberVC) return interaction.reply("You need to be in a voice channel to execute this command 😤");
        const botVC = interaction.guild.me.voice.channel;
        if (!botVC) return interaction.reply("The bot must be in a voice channel to execute this command 😤");
        if (memberVC.id !== botVC.id) return interaction.reply("You must be in the same voice channel as the bot to execute this command 😤");

        const connection = joinVoiceChannel({
            channelId: botVC.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        connection.destroy();
        interaction.reply("Leaving :cry:");
    }
}