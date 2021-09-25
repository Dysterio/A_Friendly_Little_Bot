module.exports = {
    game: "Tic Tac Toe",
    keybinds: ["q", "w", "e", "a", "s", "d", "z", "x", "c"],
    async execute(message) {
        // Error Check
        const client = message.client;
        const player = message.member;
        const game = client.tttGames.get(player);
        if (!game) return;
        const key = message.content.toLowerCase();
        if (key === "q") game.makeMove(message, player, 0, 0);
        if (key === "w") game.makeMove(message, player, 0, 1);
        if (key === "e") game.makeMove(message, player, 0, 2);
        if (key === "a") game.makeMove(message, player, 1, 0);
        if (key === "s") game.makeMove(message, player, 1, 1);
        if (key === "d") game.makeMove(message, player, 1, 2);
        if (key === "z") game.makeMove(message, player, 2, 0);
        if (key === "x") game.makeMove(message, player, 2, 1);
        if (key === "c") game.makeMove(message, player, 2, 2);
    }
}