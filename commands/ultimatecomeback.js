const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ultimatecomeback")
        .setDescription("Replies with the ultimate comeback!")
        .addMentionableOption(option =>
            option.setName("user")
                .setDescription("The user to target")
                .setRequired(true)),
    async execute(interaction) {
        let msg = "<@" + interaction.options.getMentionable("user") + ">, u dumb. Boom, I win!";
        await interaction.reply(msg);
    }
}