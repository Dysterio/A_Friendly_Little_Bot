const {MessageEmbed} = require("discord.js");

class TicTacToe {
    static colors = ["blue", "brown", "orange", "purple", "yellow"];
    #infoMsg;
    #board;
    #player1;
    #player2;
    #p1Turn;
    #player1Symb = ":o2:";
    #player2Symb = ":negative_squared_cross_mark:";
    #bgTile;
    constructor(msg, p1, p2) {
        this.#infoMsg = msg;
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

    // Makes a turn
    move(row, col) {
        if (this.#board[row][col] !== this.#bgTile) return false;

        if (this.#p1Turn) this.#board[row][col] = this.#player1Symb;
        if (!this.#p1Turn) this.#board[row][col] = this.#player2Symb;
        this.#p1Turn = !this.#p1Turn;
        return true;
    }

    // Checks for win
    checkWin() {
        for (let row = 0; row < 3; row++) {
            if (this.#board[row][0] === this.#bgTile) continue;
            if ((this.#board[row][0] === this.#board[row][1])
                && (this.#board[row][1] === this.#board[row][2])) return true;
        }

        for (let col = 0; col < 3; col++) {
            if (this.#board[0][col] === this.#bgTile) continue;
            if ((this.#board[0][col] === this.#board[1][col])
                && (this.#board[1][col] === this.#board[2][col])) return true;
        }

        if (this.#board[0][0] !== this.#bgTile) {
            if ((this.#board[0][0] === this.#board[1][1])
                && (this.#board[1][1] === this.#board[2][2])) return true;
        }

        if (this.#board[0][2] !== this.#bgTile) {
            if ((this.#board[0][2] === this.#board[1][1])
                && (this.#board[1][1] === this.#board[2][0])) return true;
        }

        return false;
    }

    // Check for draw
    checkDraw() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.#board[row][col] === this.#bgTile) return false;
            }
        }
        return true;
    }

    // Output the board
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

    announceNextTurn(state, who) {
        if (state) return this.#infoMsg.edit({ content: this.getBoard(), embeds: [state] });
        const embed = new MessageEmbed()
            .setColor("#000000")
            .setTitle("TicTacToe!")
            .setDescription(who.user.username + "'s turn...");

        this.#infoMsg.channel.send({ content: this.getBoard(), embeds: [embed] }).then(msg => {
            this.#infoMsg.delete();
            this.#infoMsg = msg;
        });
    }

    // Delete the current game
    deleteGame(games) {
        games.delete(this.#player1);
        games.delete(this.#player2);
    }

    // Get current player
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

    currPlayer() {
        return this.#p1Turn ? this.#player1 : this.#player2;
    }
}

module.exports = TicTacToe;