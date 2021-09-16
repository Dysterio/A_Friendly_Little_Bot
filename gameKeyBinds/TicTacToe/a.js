module.exports = {
    name: "a",
    game: "Tic Tac Toe",
    desc: "Places a icon in the middle left cell",
    async execute(message) {
        // Error Check
        const client = message.client;
        const player = message.member;
        const game = client.tttGames.get(player);
        if (!game) return;
        game.makeMove(message, player, 1, 0);
    }
}