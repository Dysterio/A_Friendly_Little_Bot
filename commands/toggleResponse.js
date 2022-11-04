const { SlashCommandBuilder, PermissionFlagsBits, inlineCode } = require('discord.js');
const GuildPref = require('../models/GuildPref');

const responses = [
    { name: 'Dad Jokes', value: 'dad' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-response')
        .setDescription('Toggles a response on or off.')
        .addStringOption(option =>
            option.setName('response')
                .setDescription('The response to toggle.')
                .setRequired(true)
                .addChoices(...responses))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        // Get input
        const responseVal = interaction.options.getString('response');
        const guild = await GuildPref.findOne({ _id: interaction.guild.id });
        let responseState;

        // Toggle the response's state
        if (guild.disabledResponses.includes(responseVal)) {
            guild.disabledResponses = guild.disabledResponses.filter(r => r !== responseVal);
            responseState = 'enabled';
        } else {
            guild.disabledResponses.push(responseVal);
            responseState = 'disabled';
        }
        await guild.save();

        // Send response
        const responseName = responses.find(r => r.value === responseVal).name;
        await interaction.reply(`The ${inlineCode(responseName)} response has been ${responseState}.`);
    },
};
