const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, userMention } = require('@discordjs/builders');
const TicTacToeView = require('../games/TicTacToe/TicTacToeView');
const GameStats = require('../models/GameStats');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Shows a list of games you can play.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Shows your game stats.'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tictactoe')
                .setDescription('Play a game of Tic Tac Toe.')
                .addUserOption(option =>
                    option.setName('opponent')
                        .setDescription('The user you want to play against.')
                        .setRequired(true),
                ),
        ),
    async execute(interaction) {
        // Execute subcommand
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'stats')
            return await this.stats(interaction);
        if (subcommand === 'tictactoe')
            return this.tictactoe(interaction);
    },
    async stats(interaction) {
        // Get game stats
        const gameStats = await GameStats.findOne({ _id: interaction.user.id });
        if (!gameStats) {
            await interaction.reply({ content: 'You have not played any games yet.', ephemeral: true });
            return;
        }

        // Generate game stats embed
        const embed = {
            title: 'Game Stats',
            thumbnail: {
                url: interaction.user.displayAvatarURL({ dynamic: true }),
            },
            fields: [],
        };
        Object.keys(gameStats.games).forEach(game => {
            embed.fields.push({
                name: game,
                value: `Wins: ${gameStats.games[game].wins}\nLosses: ${gameStats.games[game].losses}\nTies: ${gameStats.games[game].ties}`,
                inline: true,
            });
        });

        // Send game stats embed
        await interaction.reply({ embeds: [embed] });
    },
    async tictactoe(interaction) {
        // Get opponent
        const opponent = interaction.options.getUser('opponent');
        if (interaction.user.id === opponent.id) {
            await interaction.reply({ content: 'You can\'t play against yourself!', ephemeral: true });
            return;
        }
        // Ask opponent to accept
        await interaction.reply({
            content: `${userMention(opponent.id)}, ${interaction.user.username} has challenged you to a match of Tic Tac Toe. Do you accept?`,
            components: [this.challengeButtons()],
        });
        await this.handleChallenge(interaction, opponent);
    },
    challengeButtons() {
        const acceptButton = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Accept')
            .setStyle('Success');
        const declineButton = new ButtonBuilder()
            .setCustomId('decline')
            .setLabel('Decline')
            .setStyle('Danger');
        return new ActionRowBuilder().addComponents(acceptButton, declineButton);
    },
    async handleChallenge(interaction, opponent) {
        // Assign button listener
        const challengeMsg = await interaction.fetchReply();
        const filter = i => i.customId === 'accept' || i.customId === 'decline';
        const collector = challengeMsg.createMessageComponentCollector({ filter, time: 60000 });

        // Handle button press
        collector.on('collect', async i => {
            // Error Check
            if (i.user.id !== opponent.id) {
                await i.reply({ content: 'You can\'t interfere with this challenge!', ephemeral: true });
                return;
            }
            // Handle response
            if (i.customId === 'accept') {
                // Accept
                await i.update({
                    content: `${opponent.username} has accepted the challenge!`,
                    components: [],
                });

                // Start game
                i.channel.send('Game being created...').then(msg => {
                    new TicTacToeView(msg, interaction.user.id, opponent.id);
                });
            } else if (i.customId === 'decline') {
                // Decline
                await i.update({
                    content: `${opponent.username} has declined the challenge.`,
                    components: [],
                });
            }
            collector.stop();
        });

        // Handle timeout
        collector.on('end', async () => {
            // Check if challenge message was deleted
            interaction.channel.messages.fetch(challengeMsg.id).then(msg => {
                if (msg && msg.editedAt === null) {
                    msg.edit('Challenge expired.');
                    msg.edit({ components: [] });
                }
            });
        });
    },
};
