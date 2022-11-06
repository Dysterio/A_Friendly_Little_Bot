const { userMention } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const GameView = require('../GameView');
const TicTacToeModel = require('./TicTacToeModel');
const GameStats = require('../../models/GameStats');

/**
 * The following class handles the display logic
 * for a Tic Tac Toe game.
 */
class TicTacToeView extends GameView {
    /**
     * Initializes a new game view.
     *
     * @param {Message} message The message to display the game in.
     * @param {number} player1 Player 1's ID
     * @param {number} player2 Player 2's ID
     */
    constructor(message, player1, player2) {
        super(TicTacToeModel, player1, player2);
        this.gameInfo = this.generateGameInfoEmbed();
        this.initialize(message);
    }

    /**
     * Generates the game info embed.
     *
     * @returns {MessageEmbed} The game info embed.
     */
    generateGameInfoEmbed() {
        // Assign symbols
        this.X = this.game.turn;
        this.O = this.X === this.game.player1 ? this.game.player2 : this.game.player1;

        return {
            title: 'Tic Tac Toe',
            description: 'Click a button to make a move.',
            fields: [
                {
                    name: `${userMention(this.X)} X`,
                    value: '\u200b',
                    inline: true,
                },
                {
                    name: `${userMention(this.O)} O`,
                    value: '\u200b',
                    inline: true,
                },
                {
                    name: 'Current Turn:',
                    value: `${userMention(this.game.turn)}`,
                    inline: false,
                },
            ],
        };
    }

    /**
     * Initializes the game view.
     *
     * @param {Message} message The message to display the game in.
     * @returns {Promise<void>}
     */
    initialize(message) {
        // Create buttons
        const allButtons = [];
        for (let r = 0; r < 3; r++) {
            const row = new ActionRowBuilder()
                .addComponents(
                    (() => {
                        const rowButtons = [];
                        for (let c = 0; c < 3; c++) {
                            rowButtons.push(
                                new ButtonBuilder()
                                    .setCustomId(`tictactoe_${r}_${c}`)
                                    .setLabel(' ')
                                    .setStyle('Secondary'),
                            );
                        }
                        return rowButtons;
                    })(),
                );
            allButtons.push(row);
        }

        // Game info
        message.edit({ content: '', embeds: [this.gameInfo], components: allButtons });
        this.bindListener(message);
    }

    /**
     * Binds a listener to the game view's buttons.
     *
     * @param {Message} message The message to display the game in.
     * @returns {Promise<void>}
     */
    bindListener(message) {
        // Error handler
        const filter = (interaction) => {
            if (interaction.user.id !== this.game.turn) {
                interaction.reply({ content: 'It is not your turn.', ephemeral: true });
                return false;
            }
            return true;
        };

        // Button listener
        this.collector = message.createMessageComponentCollector({ filter });
        this.collector.on('collect', async (interaction) => {
            const [row, col] = interaction.customId.split('_').slice(1);
            try {
                this.game.move(row, col);
            } catch (err) {
                return await interaction.reply({ content: err.message, ephemeral: true });
            }
            await this.update(interaction);
        });
    }

    /**
     * Renders the game view.
     *
     * @param {Message} message The message to display the game in.
     * @returns {Promise<void>}
     *    A promise that resolves when the game view message has been updated.
     */
    async update(message) {
        // Check if game is over
        const winner = TicTacToeModel.checkWin(this.game.board);
        if (winner) {
            this.gameInfo.fields[2].name = `${userMention(winner)} won!`;
            this.gameInfo.fields[2].value = '\u200b';
            this.collector.stop();
            await this.updateStats(winner, 1, 0, 0);
            await this.updateStats(winner === this.game.player1 ? this.game.player2 : this.game.player1, 0, 1, 0);
        } else if (this.game.checkDraw()) {
            this.gameInfo.fields[2].name = 'Draw!';
            this.gameInfo.fields[2].value = '\u200b';
            this.collector.stop();
            await this.updateStats(this.game.player1, 0, 0, 1);
            await this.updateStats(this.game.player2, 0, 0, 1);
        } else {
            this.gameInfo.fields[2].value = `${userMention(this.game.turn)}`;
        }

        // Update buttons
        const allButtons = [];
        for (let r = 0; r < 3; r++) {
            const row = new ActionRowBuilder()
                .addComponents(
                    (() => {
                        const rowButtons = [];
                        for (let c = 0; c < 3; c++) {
                            const label = this.game.board[r][c] === this.X ? 'X' :
                                            this.game.board[r][c] === this.O ? 'O' :
                                            ' ';
                            rowButtons.push(
                                new ButtonBuilder()
                                    .setCustomId(`tictactoe_${r}_${c}`)
                                    .setLabel(label)
                                    .setStyle(label.trim() ?
                                        (label === 'X' ? 'Danger' : 'Primary') : 'Secondary'),
                            );
                        }
                        return rowButtons;
                    })(),
                );
            allButtons.push(row);
        }

        // Update message
        message.update({ embeds: [this.gameInfo], components: allButtons });
    }

    /**
     * Update the players' stats.
     *
     * @param {string} playerID The player's ID.
     * @param {string} win 1 if the player won, 0 otherwise.
     * @param {string} loss 1 if the player lost, 0 otherwise.
     * @param {string} tie 1 if the game was a tie, 0 otherwise.
     * @returns {Promise<void>}
     */
    updateStats(playerID, win, loss, tie) {
        GameStats.findOne({ _id: playerID }, async (err, stats) => {
            if (err) return console.error(err);
            if (!stats) {
                const newStats = new GameStats({
                    _id: playerID,
                    games: {
                        'Tic Tac Toe': {
                            wins: win,
                            losses: loss,
                            ties: tie,
                        },
                    },
                });
                await newStats.save();
            } else {
                stats.games['Tic Tac Toe'].wins += win;
                stats.games['Tic Tac Toe'].losses += loss;
                stats.games['Tic Tac Toe'].ties += tie;
                await stats.save();
            }
        });
    }
}

module.exports = TicTacToeView;