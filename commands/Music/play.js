const { SlashCommandBuilder } = require("@discordjs/builders");
const youtube = require("play-dl");
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
        const check = youtube.yt_validate(songName);
        if (check) { // URL passed
            if (check === "playlist") return interaction.editReply("The bot cannot handle playlists yet.");
            const songInfo = await youtube.video_info(songName);
            song = {
                title: songInfo.video_details.title,
                url: songInfo.video_details.url
            };
        } else { // Keywords passed
            // Search youtube for the keywords
            const videoFinder = async (query) => {
                const result = await youtube.search(query, { type: "video", limit: 1 });
                return result[0];
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
        if (songQueue.player) songQueue.player.stop(true);
        songQueue.connection.destroy();
        client.musicQueue.delete(guild.id);
        return;
    }
    // Play song
    const source = await youtube.stream(song.url);
    const resource = await createAudioResource(source.stream, { inputType: source.type });
    songQueue.player.play(resource);
    songQueue.connection.subscribe(songQueue.player);
    // Play next song
    songQueue.player.on(AudioPlayerStatus.Idle, () => {
        songQueue.songs.shift();
        videoPlayer(client, guild, songQueue.songs[0]);
    });
    await songQueue.textChannel.send("Now Playing: " + song.title);
}