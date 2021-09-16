const { SlashCommandBuilder } = require("@discordjs/builders");
const TicTacToe = require("../../TicTacToe");
const { MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tictactoe")
        .setDescription("Starts a tic tac toe game")
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
        if (client.tttGames.has(interaction.member)) return interaction.reply("You are already in a game");
        if (client.tttGames.has(opponent)) return interaction.reply("Opponent is in a game");
        //if (interaction.member === opponent) return interaction.reply("Get some friends smh...");
        // As opponent to accept
        const button = new MessageButton()
            .setCustomId("acceptTTT")
            .setLabel("Accept")
            .setStyle("SUCCESS");
        const row = new MessageActionRow().addComponents(button);
        await interaction.reply("Initiating game...");
        await interaction.channel.send({
            content: "<@" + opponent.id + ">, " + interaction.member.user.username + " has challenged you to a match of Tic Tac Toe. Do you accept?",
            components: [row]
        }).then(msg => {
            let accepted = false;
            // Check for accept
            const collector = msg.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 60000
            });
            collector.on("collect", i => {
                if (accepted) return i.reply({ content: "You already accepted it genius...", ephemeral: true });
                if (i.user.id !== opponent.id) return i.reply({ content: "Not meant for u :triumph:", ephemeral: true });
                i.reply("Challenge Accepted");
                accepted = true;
                // Initialize game
                const ttt = new TicTacToe(interaction.member, opponent);
                client.tttGames.set(interaction.member, ttt);
                client.tttGames.set(opponent, ttt);
                // Show board to players
                const embed = new MessageEmbed()
                    .setColor("#000000")
                    .setTitle("TicTacToe!")
                    .setDescription("Welcome to a game of TicTacToe! When it is your turn, press one of the following keys to make your move to the corresponding position on the board!`" + "" +
                        "\nq|w|e" +
                        "\n-+-+-" +
                        "\na|s|d" +
                        "\n-+-+-" +
                        "\nz|x|c`\n" + opponent.user.username + "'s turn.");
                interaction.channel.send({ embeds: [embed] });
                interaction.channel.send(ttt.getBoard());
            });
        })
    }
}