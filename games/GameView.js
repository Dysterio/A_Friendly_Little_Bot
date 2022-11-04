/**
 * Abstract class for a game view.
 * This class should be extended by all game views.
 */
class GameView {
    /**
     * Initializes a new game view.
     *
     * @param {GameModel} Game The game model to display.
     * @param {number} player1 Player 1's ID
     * @param {number} player2 Player 2's ID
     */
    constructor(Game, player1, player2) {
        this.game = new Game(player1, player2);
    }

    /**
     * Renders the game view.
     *
     * @returns {Promise<void>}
     *    A promise that resolves when the game view message has been updated.
     */
    update() {
        throw new Error('update() not implemented.');
    }
}

module.exports = GameView;