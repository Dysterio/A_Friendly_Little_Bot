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
        return TicTacToeModel.checkWin(this.board);
    }
    static checkWin(board) {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (board[row][0] &&
                board[row][0] === board[row][1] &&
                board[row][0] === board[row][2]) return board[row][0];
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (board[0][col] &&
                board[0][col] === board[1][col] &&
                board[0][col] === board[2][col]) return board[0][col];
        }

        // Check diagonals
        if (board[0][0] &&
            board[0][0] === board[1][1] &&
            board[0][0] === board[2][2]) return board[0][0];
        if (board[0][2] &&
            board[0][2] === board[1][1] &&
            board[0][2] === board[2][0]) return board[0][2];

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

    /**
     * Returns the row and column of the best move for the AI.
     */
    aiMove() {
        let bestScore = -Infinity;
        let bestMove = undefined;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col]) continue;
                this.board[row][col] = process.env.CLIENT_ID;
                const score = this.minimax(this.board, false, this.movesMade + 1);
                this.board[row][col] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row, col };
                }
            }
        }
        return bestMove;
    }

    /**
     * This is the minimax algorithm. It is used to determine the best move for the AI.
     *
     * @param {string[][]} board The board to make the move on.
     * @param {boolean} isMaximizing Whether or not the AI is maximizing.
     * @param {number} movesMade The number of moves made.
     */
    minimax(board, isMaximizing, movesMade) {
        // Check if the game has been won
        const result = TicTacToeModel.checkWin(board);
        if (result === process.env.CLIENT_ID) return 1;
        else if (result) return -1;
        else if (movesMade === 9) return 0;

        // Check if the AI is maximizing
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (!board[row][col]) {
                        board[row][col] = process.env.CLIENT_ID;
                        const score = this.minimax(board, false, movesMade + 1);
                        board[row][col] = '';
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (!board[row][col]) {
                        board[row][col] = this.player1;
                        const score = this.minimax(board, true, movesMade + 1);
                        board[row][col] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    /**
     * Switches the turn to the other player.
     *
     * @returns {void}
     */
    toggleTurn() {
        super.toggleTurn();
        if (this.turn === process.env.CLIENT_ID) {
            const bestMove = this.aiMove(this.board, this.player1, this.movesMade);
            if (bestMove) this.move(bestMove.row, bestMove.col);
        }
    }
}

module.exports = TicTacToeModel;