const { Events } = require('discord.js');
const GuildPref = require('../models/GuildPref');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        // Create new guild in database
        const newGuild = new GuildPref({
            _id: guild.id,
            disabledResponses: [],
        });
        await newGuild.save();
    },
};