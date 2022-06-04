const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("horniboard")
        .setDescription("Returns the horniness leaderboard"),
    usage: "",
    async execute(interaction) {
        let leaderboard = [];
        let db = await interaction.client.db.query('SELECT * FROM "HORNY_COUNT";');
        const channel = await interaction.guild.channels.cache.find(ch => ch.id === interaction.channelId);
        for (let row of db.rows) {
            if (!channel.members.has(row.userID)) continue;
            leaderboard.push([row.userID, row.count]);
        }
        let leaderboardStr = "";
        for (let u of leaderboard) {
            let user = await interaction.client.users.fetch(u[0]);
            leaderboardStr += `${user.username} - ${u[1]}\n`;
        }
        const embed = new MessageEmbed()
            .setColor("#000000")
            .setTitle("Horniness Leaderboard smh...")
            .setDescription(leaderboardStr);
        return interaction.reply({embeds: [embed]});
    }
}