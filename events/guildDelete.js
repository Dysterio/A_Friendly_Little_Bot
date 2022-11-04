const { Events } = require('discord.js');
const GuildPref = require('../models/GuildPref');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        // Delete guild from database
        await GuildPref.deleteOne({ _id: guild.id });
    },
};