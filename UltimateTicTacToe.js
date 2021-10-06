const {MessageEmbed} = require("discord.js");

class UltimateTicTacToe {
    /** Fields */
    #gameStateMsg;
    #board;
    #player1;
    #player2;
    #p1Turn;
    #player1Symb = ":green_square:";
    #player2Symb = ":red_square:";
    #bgTile;
    #highlightTile;
    #drawTile;
    #currGame = null;

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
        this.setupBoard();
        this.#player1 = p1;
        this.#player2 = p2;
        this.#p1Turn = Math.round(Math.random()) == 1;
    }

    /**
     * Initializes the game board.
     */
    setupBoard() {
        this.#board = [];
        this.#bgTile = "⬜";
        this.#highlightTile = "🟨";
        this.#drawTile = "⬛";
        for (let boardRow = 0; boardRow < 3; boardRow++) {
            this.#board.push([]);
            for (let boardCol = 0; boardCol < 3; boardCol++) {
                this.#board[boardRow].push([]);
                for (let gameRow = 0; gameRow < 3; gameRow++) {
                    this.#board[boardRow][boardCol].push([]);
                    for (let gameCol = 0; gameCol < 3; gameCol++) {
                        this.#board[boardRow][boardCol][gameRow].push(this.#highlightTile);
                    }
                }
            }
        }
    }

    /**
     * Check if the game has been won by either player.
     *
     * @returns {boolean} Whether or not the game has been won
     */
    checkGameWin() {
        // Check for horizontal win
        for (let row = 0; row < 3; row++) {
            if ((this.#currGame.board[row][0] === this.#bgTile) || (this.#currGame.board[row][0] === this.#highlightTile)) continue;
            if ((this.#currGame.board[row][0] === this.#currGame.board[row][1])
                && (this.#currGame.board[row][1] === this.#currGame.board[row][2])) return true;
        }
        // Check for vertical win
        for (let col = 0; col < 3; col++) {
            if ((this.#currGame.board[0][col] === this.#bgTile) || (this.#currGame.board[0][col] === this.#highlightTile)) continue;
            if ((this.#currGame.board[0][col] === this.#currGame.board[1][col])
                && (this.#currGame.board[1][col] === this.#currGame.board[2][col])) return true;
        }
        // Check for right diagonal win
        if ((this.#currGame.board[0][0] !== this.#bgTile) && (this.#currGame.board[0][0] !== this.#highlightTile)) {
            if ((this.#currGame.board[0][0] === this.#currGame.board[1][1])
                && (this.#currGame.board[1][1] === this.#currGame.board[2][2])) return true;
        }
        // Check for left diagonal win
        if ((this.#currGame.board[0][2] !== this.#bgTile) && (this.#currGame.board[0][2] !== this.#highlightTile)) {
            if ((this.#currGame.board[0][2] === this.#currGame.board[1][1])
                && (this.#currGame.board[1][1] === this.#currGame.board[2][0])) return true;
        }
        // Game has not been won yet
        return false;
    }

    /**
     * Checks if the game has reached a draw.
     *
     * @returns {boolean} Whether or not the current game has ended in a draw.
     */
    checkGameDraw() {
        // Check for free tiles
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if ((this.#currGame.board[row][col] === this.#bgTile) ||
                    (this.#currGame.board[row][col] === this.#highlightTile)) return false;
            }
        }
        return true;
    }

    /**
     * Check if the game has been won by either player.
     *
     * @returns {boolean} Whether or not the game has been won
     */
    checkBoardWin() {
        // Check for horizontal win
        for (let row = 0; row < 3; row++) {
            if ((this.#board[row][0] === this.#player1Symb) || (this.#board[row][0] === this.#player2Symb)) continue;
            if ((this.#board[row][0] === this.#board[row][1])
                && (this.#board[row][1] === this.#board[row][2])) return true;
        }
        // Check for vertical win
        for (let col = 0; col < 3; col++) {
            if ((this.#board[0][col] === this.#player1Symb) || (this.#board[0][col] === this.#player2Symb)) continue;
            if ((this.#board[0][col] === this.#board[1][col])
                && (this.#board[1][col] === this.#board[2][col])) return true;
        }
        // Check for right diagonal win
        if ((this.#board[0][0] === this.#player1Symb) || (this.#board[0][0] === this.#player2Symb)) {
            if ((this.#board[0][0] === this.#board[1][1])
                && (this.#board[1][1] === this.#board[2][2])) return true;
        }
        // Check for left diagonal win
        if ((this.#board[0][2] === this.#player1Symb) || (this.#board[0][2] === this.#player2Symb)) {
            if ((this.#board[0][2] === this.#board[1][1])
                && (this.#board[1][1] === this.#board[2][0])) return true;
        }
        // Game has not been won yet
        return false;
    }

    checkBoardDraw() {
        // Check for free tiles
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (Array.isArray(this.#board[row][col])) return false;
            }
        }
        return true;
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
        if (this.#currGame.board[row][col] !== this.#highlightTile) return false;

        if (this.#p1Turn) this.#currGame.board[row][col] = this.#player1Symb;
        else this.#currGame.board[row][col] = this.#player2Symb;
        this.#p1Turn = !this.#p1Turn;
        return true;
    }

    highlightGame() {
        for (let boardRow = 0; boardRow < 3; boardRow++) {
            for (let boardCol = 0; boardCol < 3; boardCol++) {
                for (let gameRow = 0; gameRow < 3; gameRow++) {
                    for (let gameCol = 0; gameCol < 3; gameCol++) {
                        if (!Array.isArray(this.#board[boardRow][boardCol])) continue;
                        if (this.#board[boardRow][boardCol][gameRow][gameCol] === this.#highlightTile) {
                            this.#board[boardRow][boardCol][gameRow][gameCol] = this.#bgTile;
                        }
                    }
                }
            }
        }

        for (let gameRow = 0; gameRow < 3; gameRow++) {
            for (let gameCol = 0; gameCol < 3; gameCol++) {
                if (this.#currGame.board[gameRow][gameCol] === this.#bgTile) {
                    this.#currGame.board[gameRow][gameCol] = this.#highlightTile;
                }
            }
        }
    }

    highlightBoard() {
        for (let boardRow = 0; boardRow < 3; boardRow++) {
            for (let boardCol = 0; boardCol < 3; boardCol++) {
                if (!Array.isArray(this.#board[boardRow][boardCol])) continue;
                for (let gameRow = 0; gameRow < 3; gameRow++) {
                    for (let gameCol = 0; gameCol < 3; gameCol++) {
                        if (this.#board[boardRow][boardCol][gameRow][gameCol] === this.#bgTile) {
                            this.#board[boardRow][boardCol][gameRow][gameCol] = this.#highlightTile;
                        }
                    }
                }
            }
        }
    }

    /**
     * Makes a move
     */
    makeMove(msg, player, row, col) {
        msg.delete();
        // Select game
        if (!this.#currGame) {
            this.#currGame = {
                board: this.#board[row][col],
                row: row,
                col: col
            };
            this.highlightGame();
            return this.displayState();
        }

        // Make move
        const validMove = this.move(row, col);
        if (!validMove) return msg.reply("Invalid move");

        // Check game status
        const symb = (!this.#p1Turn) ? this.#player1Symb : this.#player2Symb;
        if (this.checkGameWin()) {
            this.#board[this.#currGame.row][this.#currGame.col] = symb;
        } else if (this.checkGameDraw()) {
            this.#board[this.#currGame.row][this.#currGame.col] = this.#drawTile;
        }

        // Check board status
        if (this.checkBoardWin()) {
            this.displayState("win");
            msg.client.utttGames.delete(this.#player1);
            msg.client.utttGames.delete(this.#player2);
            return;
        } else if (this.checkBoardDraw()) {
            msg.client.utttGames.delete(this.#player1);
            msg.client.utttGames.delete(this.#player2);
            this.displayState("draw");
            return;
        }

        // Change games
        this.#currGame = {
            board: this.#board[row][col],
            row: row,
            col: col
        };
        if (!Array.isArray(this.#currGame.board)) {
            this.#currGame = null;
            this.highlightBoard();
        } else {
            this.highlightGame();
        }

        this.displayState();
    }

    displayState(state) {
        const currPlayer = this.#p1Turn ? this.#player1 : this.#player2;
        const lastPlayer = this.#p1Turn ? this.#player2 : this.#player1;
        let desc;
        if (!state) {
            desc = currPlayer.user.username + "'s turn.";
        } else {
            if (state === "win") {
                desc = lastPlayer.user.username + " won!";
            } else {
                desc = "Draw!";
            }
        }

        const embed = new MessageEmbed()
            .setColor("#000000")
            .setTitle("Ultimate Tic Tac Toe!")
            .setDescription(desc);


        this.#gameStateMsg.channel.send({
            content: this.getBoard(),
            embeds: [embed]
        }).then(msg => {
            this.#gameStateMsg.delete();
            this.#gameStateMsg = msg;
        })
    }


    getBoard() {
        let boardString = "";

        boardString += "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n"
        for (let boardRow = 0; boardRow < 3; boardRow++) {
            for (let gameRow = 0; gameRow < 3; gameRow++) {
                boardString += "⬛";
                for (let boardCol = 0; boardCol < 3; boardCol++) {
                    for (let gameCol = 0; gameCol < 3; gameCol++) {
                        if (!Array.isArray(this.#board[boardRow][boardCol])) {
                            boardString += this.#board[boardRow][boardCol];
                            continue;
                        }
                        boardString += this.#board[boardRow][boardCol][gameRow][gameCol];
                    }
                    boardString += "⬛";
                }
                boardString += "\n";
            }
            boardString += "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n";
        }



        return boardString;
    }

}

module.exports = UltimateTicTacToe;