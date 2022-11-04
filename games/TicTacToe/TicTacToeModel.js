const GameModel = require('../GameModel');

/**
 * The following class handles the logic for a
 * Tic Tac Toe game.
 */
class TicTacToeModel extends GameModel {
    /**
     * Initializes a new game with the given players.
     *
     * @param {number} player1 Player 1's ID
     * @param {number} player2 Player 2's ID
     */
    constructor(player1, player2) {
        super(player1, player2);
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ];
        this.movesMade = 0;
    }

    /**
     * Makes a move for the current player.
     *
     * @param {number} row The row to make the move in.
     * @param {number} col The column to make the move in.
     * @returns {void} Whether or not the move was successful.
     */
    move(row, col) {
        // Check if the tile is free
        if (this.board[row][col]) throw new Error('Tile is not free.');

        // Make move
        this.board[row][col] = this.turn;
        this.movesMade++;
        this.toggleTurn();
    }

    /**
     * Checks if the game has been won by either player.
     *
     * @returns {number | undefined} The winning player's ID, or undefined if no one has won.
     */
    checkWin() {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (this.board[row][0] &&
                this.board[row][0] === this.board[row][1] &&
                this.board[row][0] === this.board[row][2]) return this.board[row][0];
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (this.board[0][col] &&
                this.board[0][col] === this.board[1][col] &&
                this.board[0][col] === this.board[2][col]) return this.board[0][col];
        }

        // Check diagonals
        if (this.board[0][0] &&
            this.board[0][0] === this.board[1][1] &&
            this.board[0][0] === this.board[2][2]) return this.board[0][0];
        if (this.board[0][2] &&
            this.board[0][2] === this.board[1][1] &&
            this.board[0][2] === this.board[2][0]) return this.board[0][2];

        return undefined;
    }

    /**
     * Checks if the game has reached a draw.
     *
     * @returns {boolean} Whether or not the game has reached a draw.
     */
    checkDraw() {
        return this.movesMade === 9;
    }
}

module.exports = TicTacToeModel;