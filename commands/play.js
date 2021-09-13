const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const {
    AudioPlayerStatus,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} = require("@discordjs/voice");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays music!")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the music you want to search for")
                .setRequired(true)),
    usage: "<song name>",
    async execute(interaction) {
        await interaction.deferReply();
        const vcChannel = interaction.member.voice.channel;
        if (!vcChannel) return interaction.editReply("You need to be in a voice channel to execute this command 😤");

        const musicName = interaction.options.getString("name");
        const connection = joinVoiceChannel({
            channelId: vcChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const videoFinder = async (query) => {
            const vidResult = await ytSearch(query);
            return (vidResult.videos.length > 1) ? vidResult.videos[0] : null;
        }

        const video = await videoFinder(musicName);
        if (!video) return interaction.editReply("Video not found...");

        const stream = await ytdl(video.url, { filter: "audioonly" });
        const resource = await createAudioResource(stream, { inputType: StreamType.Arbitrary });
        const player = await createAudioPlayer();

        await player.play(resource);
        await connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => connection.destroy());
        await interaction.editReply(video.url);
    }
}