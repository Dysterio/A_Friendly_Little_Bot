/**
 * Abstract class for a game.
 * This class should be extended by all games.
 */
class GameModel {
    /**
     * Initializes a new game with the given players.
     *
     * @param {number} player1 Player 1's ID
     * @param {number} player2 Player 2's ID
     */
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        if (this.player2 === process.env.CLIENT_ID) this.turn = this.player1;
        else this.turn = Math.random() < 0.5 ? this.player1 : this.player2;
    }

    /**
     * Switches the turn to the other player.
     *
     * @returns {void}
     */
    toggleTurn() {
        this.turn = this.turn === this.player1 ? this.player2 : this.player1;
    }

    /**
     * Makes a move for the current player.
     *
     * @param {number} row The row to make the move in.
     * @param {number} col The column to make the move in.
     * @returns {void} Whether or not the move was successful.
     */
    move(row, col) {
        throw new Error('move() not implemented.');
    }

    /**
     * Calls the AI to make a move.
     */
    aiMove() {
        throw new Error('aiMove() not implemented.');
    }

    /**
     * Checks if the game has been won by either player.
     *
     * @returns {number | undefined} The winning player's ID, or undefined if no one has won.
     */
    static checkWin(board) {
        throw new Error('checkWin() not implemented.');
    }

    /**
     * Checks if the game has reached a draw.
     *
     * @returns {boolean} Whether or not the game has reached a draw.
     */
    checkDraw() {
        throw new Error('checkDraw() not implemented.');
    }
}

module.exports = GameModel;