const mongoose = require('mongoose');

const GuildPref = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    disabledResponses: {
        type: Array,
        required: true,
    },
}, {
    versionKey: false,
});

module.exports = mongoose.model('GuildPref', GuildPref);