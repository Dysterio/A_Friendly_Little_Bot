const { Events } = require('discord.js');
const GuildPref = require('../models/GuildPref');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        // Check for executable responses
        message.client.responses.forEach(async response => {
            // Check if the response is disabled
            if (message.guild && message.guild.id) {
                const guildPref = await GuildPref.findOne({ _id: message.guild.id });
                if (guildPref && guildPref.disabledResponses.includes(response.name)) return;
            }

            // Trigger response
            if (response.condition(message)) {
                response.execute(message);
            }
        });
    },
};