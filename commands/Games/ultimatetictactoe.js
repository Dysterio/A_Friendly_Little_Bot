const { SlashCommandBuilder } = require("@discordjs/builders");
const UltimateTicTacToe = require("../../Games/UltimateTicTacToe");
const { MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ultimatetictactoe")
        .setDescription("Starts an ultimate tic tac toe game")
        .addUserOption(option =>
            option.setName("opponent")
                .setDescription("The user to challenge")
                .setRequired(true)),
    usage: "<opponent>",
    async execute(interaction) {
        // Variables
        const client = interaction.client;
        const opponent = await interaction.guild.members.fetch(interaction.options.getUser("opponent"));
        // Error Check
        if (client.utttGames.has(interaction.member)) return interaction.reply("You are already in a game");
        if (client.utttGames.has(opponent)) return interaction.reply("Opponent is in a game");
        if (interaction.member === opponent) return interaction.reply("Get some friends smh...");
        // Ask opponent to accept
        const acceptButton = new MessageButton()
            .setCustomId("utttAccept")
            .setLabel("Accept")
            .setStyle("SUCCESS");
        const declineButton = new MessageButton()
            .setCustomId("utttDecline")
            .setLabel("Decline")
            .setStyle("DANGER");
        const row = new MessageActionRow().addComponents(acceptButton, declineButton);
        await interaction.reply({
            content: "<@" + opponent.id + ">, " + interaction.member.user.username + " has challenged you to a match of Ultimate Tic Tac Toe! Do you accept?",
            components: [row]
        });
        const acceptMsg = await interaction.fetchReply();
        const collector = acceptMsg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 60000
        });
        collector.on("collect", i => {
            // Error Check
            if (i.user.id !== opponent.id) {
                return i.reply({ content: "Not meant for you :triumph:", ephemeral: true });
            }
            if (client.tttGames.has(i.user.id)) {
                return i.reply({ content: "You have already joined another game...", ephemeral: true });
            }
            acceptMsg.delete();
            if (i.customId === "utttDecline") return i.reply("Challenge Declined.");
            // Initialize game
            const embed = new MessageEmbed()
                .setColor("#000000")
                .setTitle("Ultimate TicTacToe!")
                .setDescription("Welcome to a game of Ultimate TicTacToe! Ultimate Tic Tac Toe is a game that takes Tic Tac Toe to a new level! This game is played by selecting one of the 9 Tic Tac Toe boards to play on, forcing the next player to play in a Tic Tac Toe board indicative of the position last played on a Tic Tac Toe board!" +
                    "\n```q|w|e" +
                    "\n-+-+-" +
                    "\na|s|d" +
                    "\n-+-+-" +
                    "\nz|x|c```");
            interaction.channel.send({ embeds: [embed] });
            interaction.channel.send("⭐⭐⭐").then(msg => {
                const uttt = new UltimateTicTacToe(msg, interaction.member, opponent);
                client.utttGames.set(interaction.member, uttt);
                client.utttGames.set(opponent, uttt);
                // Show board to players
                uttt.displayState();
            });
        });
        collector.on("end", () => {
            acceptMsg.delete();
        });
    }
}
