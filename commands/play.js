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
        // Error Check
        const client = interaction.client;
        await interaction.deferReply();
        const vcChannel = interaction.member.voice.channel;
        if (!vcChannel) return interaction.editReply("You need to be in a voice channel to execute this command 😤");

        // Get song
        const musicName = interaction.options.getString("name");
        const videoFinder = async (query) => {
            const vidResult = await ytSearch(query);
            return (vidResult.videos.length > 1) ? vidResult.videos[0] : null;
        }
        const video = await videoFinder(musicName);
        if (!video) return interaction.editReply("Video not found...");

        // Add to queue
        client.musicQueue.push(video);
        if (!client.musicConnection) {
            await interaction.editReply("Playing: " + video.url);
            client.musicConnection = joinVoiceChannel({
                channelId: vcChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            client.musicPlayer = await createAudioPlayer();
            await this.nextSong(client.musicPlayer, client.musicQueue);
            await client.musicConnection.subscribe(client.musicPlayer);
        } else {
            await interaction.editReply("Added to queue: " + video.url);
        }

        // Handle song end
        client.musicPlayer.on(AudioPlayerStatus.Idle, async () => {
            if (!client.musicConnection) return;
            if (client.musicQueue.length === 0) {
                client.musicConnection.destroy();
                client.musicConnection = null;
                client.musicPlayer = null;
            } else {
                await this.nextSong(client.musicPlayer, client.musicQueue);
            }
        });
    },
    async nextSong(player, musicQueue) {
        const next = musicQueue[0];
        const stream = await ytdl(next.url, { filter: "audioonly" });
        const resource = await createAudioResource(stream, { inputType: StreamType.Arbitrary });
        await player.play(resource);
        musicQueue.shift();
    }
}