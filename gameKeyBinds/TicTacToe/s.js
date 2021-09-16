module.exports = {
    name: "s",
    game: "Tic Tac Toe",
    desc: "Places a icon in the center cell",
    async execute(message) {
        // Error Check
        const client = message.client;
        const player = message.member;
        const game = client.tttGames.get(player);
        if (!game) return;
        game.makeMove(message, player, 1, 1);
    }
}