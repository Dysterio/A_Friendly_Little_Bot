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

        // Get server and song info
        const serverQueue = client.musicQueue.get(interaction.guildId);
        const songName = interaction.options.getString("name");
        let song = {};

        // Get video
        if (ytdl.validateURL(songName)) { // URL passed
            const songInfo = await ytdl.getInfo(songName);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            };
        } else { // Keywords passed
            // Search youtube for the keywords
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }
            const video = await videoFinder(songName);
            // Check if video exists
            if (video) song = { title: video.title, url: video.url };
            else return interaction.editReply("Error finding video");
        }

        // Add song to server queue
        if (!serverQueue) {
            const queueConstructor = {
                voiceChannel: vcChannel,
                textChannel: interaction.channel,
                connection: null,
                player: createAudioPlayer(),
                songs: []
            }
            client.musicQueue.set(interaction.guildId, queueConstructor);
            queueConstructor.songs.push(song);
            // Join the voice channel
            try {
                const connection = joinVoiceChannel({
                    channelId: vcChannel.id,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });
                queueConstructor.connection = connection;
                await videoPlayer(client, interaction.guild, queueConstructor.songs[0]);
                await interaction.editReply(":+1:");
            } catch (err) { // Handle connection failure
                client.musicQueue.delete(interaction.guildId);
                await interaction.editReply("There was an error connecting!");
                throw err;
            }
        } else {
            // Add song to queue
            serverQueue.songs.push(song);
            return interaction.editReply(song.title + " added to queue!");
        }
    }
}
/** Plays the next song on the queue */
const videoPlayer = async (client, guild, song) => {
    const songQueue = client.musicQueue.get(guild.id);
    // Check for empty queue
    if (!song) {
        songQueue.player.stop(true);
        songQueue.connection.destroy();
        client.musicQueue.delete(guild.id);
        return;
    }
    // Play song
    const stream = ytdl(song.url, { filter: "audioonly" });
    const resource = await createAudioResource(stream, { inputType: StreamType.Arbitrary });
    songQueue.player.play(resource);
    songQueue.connection.subscribe(songQueue.player);
    // Play next song
    songQueue.player.on(AudioPlayerStatus.Idle, () => {
        songQueue.songs.shift();
        videoPlayer(client, guild, songQueue.songs[0]);
    });
    await songQueue.textChannel.send("Now Playing: " + song.title);
}