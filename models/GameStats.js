const mongoose = require('mongoose');

const GameStats = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    games: {
        'Tic Tac Toe': {
            wins: {
                type: Number,
                required: true,
            },
            losses: {
                type: Number,
                required: true,
            },
            ties: {
                type: Number,
                required: true,
            },
        },
    },
}, {
    versionKey: false,
});

module.exports = mongoose.model('GameStats', GameStats);