const {MessageEmbed} = require("discord.js");

class TicTacToe {
    /** Fields */
    static colors = ["blue", "brown", "orange", "purple", "yellow"];
    #gameStateMsg;
    #board;
    #player1;
    #player2;
    #p1Turn;
    #player1Symb = ":o2:";
    #player2Symb = ":negative_squared_cross_mark:";
    #bgTile;

    /**
     * Create a new instance of the tic tac toe game.
     *
     * @param msg The game state message.
     * @param p1 The first player
     * @param p2 The second player
     */
    constructor(msg, p1, p2) {
        // Variables
        this.#gameStateMsg = msg;
        this.#bgTile = ":" + TicTacToe.colors[Math.floor(Math.random() * TicTacToe.colors.length)] + "_square" + ":";
        this.#board = [
            [this.#bgTile, this.#bgTile, this.#bgTile],
            [this.#bgTile, this.#bgTile, this.#bgTile],
            [this.#bgTile, this.#bgTile, this.#bgTile]
        ]
        this.#player1 = p1;
        this.#player2 = p2;
        this.#p1Turn = Math.round(Math.random()) == 1;
    }

    /**
     * Makes a move for the current player.
     *
     * @param row The row to make the move in
     * @param col The column to make the move in
     * @returns {boolean} Whether or not the move was successful.
     */
    move(row, col) {
        // Check if the tile is free
        if (this.#board[row][col] !== this.#bgTile) return false;

        if (this.#p1Turn) this.#board[row][col] = this.#player1Symb;
        else this.#board[row][col] = this.#player2Symb;
        this.#p1Turn = !this.#p1Turn;
        return true;
    }

    /**
     * Check if the game has been won by either player.
     *
     * @returns {boolean} Whether or not the game has been won
     */
    checkWin() {
        // Check for horizontal win
        for (let row = 0; row < 3; row++) {
            if (this.#board[row][0] === this.#bgTile) continue;
            if ((this.#board[row][0] === this.#board[row][1])
                && (this.#board[row][1] === this.#board[row][2])) return true;
        }
        // Check for vertical win
        for (let col = 0; col < 3; col++) {
            if (this.#board[0][col] === this.#bgTile) continue;
            if ((this.#board[0][col] === this.#board[1][col])
                && (this.#board[1][col] === this.#board[2][col])) return true;
        }
        // Check for right diagonal win
        if (this.#board[0][0] !== this.#bgTile) {
            if ((this.#board[0][0] === this.#board[1][1])
                && (this.#board[1][1] === this.#board[2][2])) return true;
        }
        // Check for left diagonal win
        if (this.#board[0][2] !== this.#bgTile) {
            if ((this.#board[0][2] === this.#board[1][1])
                && (this.#board[1][1] === this.#board[2][0])) return true;
        }
        // Game has not been won yet
        return false;
    }

    /**
     * Checks if the game has reached a draw.
     *
     * @returns {boolean} Whether or not the current game has ended in a draw.
     */
    checkDraw() {
        // Check for free tiles
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.#board[row][col] === this.#bgTile) return false;
            }
        }
        return true;
    }

    /**
     * Returns the board as a string to print to the user.
     *
     * @returns {string} The board as a string
     */
    getBoard() {
        let boardString = "⬛⬛⬛⬛⬛\n";
        for (let row = 0; row < 3; row++) {
            boardString += "⬛";
            for (let col = 0; col < 3; col++) {
                boardString += this.#board[row][col];
            }
            boardString += "⬛\n";
        }
        boardString += "⬛⬛⬛⬛⬛";
        return boardString;
    }

    /**
     * Updates the board and current player's turn
     *
     * @param state The state of the game
     * @param who Who's turn is next
     * @returns {*}
     */
    announceNextTurn(state, who) {
        if (state) return this.#gameStateMsg.edit({ content: this.getBoard(), embeds: [state] });
        const embed = new MessageEmbed()
            .setColor("#000000")
            .setTitle("TicTacToe!")
            .setDescription(who.user.username + "'s turn...");

        this.#gameStateMsg.channel.send({ content: this.getBoard(), embeds: [embed] }).then(msg => {
            this.#gameStateMsg.delete();
            this.#gameStateMsg = msg;
        });
    }

    /**
     * Delete the game.
     *
     * @param games The current game object
     */
    deleteGame(games) {
        games.delete(this.#player1);
        games.delete(this.#player2);
    }

    /**
     * Makes a move.
     *
     * @param msg The move message
     * @param player The player making the move
     * @param row The row to move into
     * @param col The column to move into
     * @returns {*}
     */
    makeMove(msg, player, row, col) {
        const nextPlayer = this.#p1Turn ? this.#player2 : this.#player1;
        if (player !== this.currPlayer()) return msg.reply("It's not your turn");
        if (!this.move(row, col)) return msg.reply("Invalid move");
        let state = null;
        if (this.checkWin()) {
            state = new MessageEmbed()
                .setColor("#000000")
                .setTitle(player.user.username + " has won!");
            this.deleteGame(msg.client.tttGames);
        } else if (this.checkDraw()) {
            state = new MessageEmbed()
                .setColor("#000000")
                .setTitle("Draw!");
            this.deleteGame(msg.client.tttGames)
        }
        this.announceNextTurn(state, nextPlayer);
        msg.delete();
    }

    /**
     * Get the current player object.
     *
     * @returns {*} The current player object
     */
    currPlayer() {
        return this.#p1Turn ? this.#player1 : this.#player2;
    }
}

module.exports = TicTacToe;