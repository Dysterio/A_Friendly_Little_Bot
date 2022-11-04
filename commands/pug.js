const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pug')
        .setDescription('Randomly splits the names passed into teams.')
        .addStringOption(option =>
            option.setName('names')
                .setDescription('The names separated by spaces.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('teams')
                .setDescription('The number of teams to split into.')
                .setRequired(true)),
    async execute(interaction) {
        // Get pug info
        const names = interaction.options.getString('names').split(' ');
        const teams = interaction.options.getInteger('teams');
        const teamNames = [];
        for (let i = 0; i < teams; i++) {
            teamNames.push(`Team ${i + 1}`);
        }

        // Error handling
        if (names.length < teams)
            return await interaction.reply('There are more teams than players!');
        if (names.length === 2)
            return await interaction.reply('I\'m sure you can split that yourself 🤨');
        if (names.length === teams.length) {
            return await interaction.reply('You\'re already in teams!');
        }

        // Shuffle names
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }

        // Split names into teams
        const teamsObj = {};
        teamNames.forEach(teamName => {
            teamsObj[teamName] = [];
        });
        let i = 0;
        while (names.length > 0) {
            const randomIndex = Math.floor(Math.random() * names.length);
            teamsObj[teamNames[i]].push(names[randomIndex]);
            names.splice(randomIndex, 1);
            i = (i + 1) % teams;
        }
        let response = '';
        for (const teamName in teamsObj) {
            response += `${teamName}: ${teamsObj[teamName].join(', ')}\n`;
        }
        await interaction.reply(response);
    },
};