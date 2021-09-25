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

        const song = await getSong(interaction, songName);
        if (!song) return;

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
            await joinVC(interaction, vcChannel, queueConstructor);
            // Play song
            await videoPlayer(client, interaction.guild, queueConstructor.songs[0]);
            await interaction.editReply("Now Playing: " + queueConstructor.songs[0].url);
            // Play next song
            queueConstructor.player.on(AudioPlayerStatus.Idle, () => {
                queueConstructor.songs.shift();
                videoPlayer(client, interaction.guild, queueConstructor.songs[0]);
                if (!queueConstructor.songs[0]) return;
                queueConstructor.textChannel.send("Now Playing: " + queueConstructor.songs[0].url);
            });
        } else {
            // Add song to queue
            serverQueue.songs.push(song);
            return interaction.editReply(song.url + " added to queue!");
        }
    }
}

const getSong = async (interaction, songName) => {
    const check = youtube.yt_validate(songName);
    if (check) { // URL passed
        if (check === "playlist") return interaction.editReply("The bot cannot handle playlists yet.");
        const songInfo = await youtube.video_info(songName);
        return {
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
        if (video) return { title: video.title, url: video.url };
        else await interaction.editReply("Error finding video"); return undefined;
    }
}

const joinVC = async (interaction, vcChannel, queueConstructor) => {
    const client = interaction.client;
    try {
        queueConstructor.connection = joinVoiceChannel({
            channelId: vcChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });
    } catch (err) { // Handle connection failure
        client.musicQueue.delete(interaction.guildId);
        await interaction.editReply("There was an error connecting!");
        throw err;
    }
}

/** Plays the next song on the queue */
const videoPlayer = async (client, guild, song) => {
    const songQueue = client.musicQueue.get(guild.id);
    if (!songQueue) return;
    // Check for empty queue
    if (!song) {
        songQueue.player.stop(true);
        songQueue.connection.destroy();
        client.musicQueue.delete(guild.id);
        return;
    }
    // Play song
    const source = await youtube.stream(song.url);
    const resource = await createAudioResource(source.stream, { inputType: source.type });
    songQueue.player.play(resource);
    songQueue.connection.subscribe(songQueue.player);
<<<<<<< HEAD
}
=======
    // Play next song
    songQueue.player.on(AudioPlayerStatus.Idle, () => {
        songQueue.songs.shift();
        videoPlayer(client, guild, songQueue.songs[0]);
    });
    await songQueue.textChannel.send("Now Playing: " + song.title);
}
>>>>>>> a5b868c0d5969bc06d460853700328dc66d516b6
