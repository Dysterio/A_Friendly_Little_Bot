const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("comeback")
        .setDescription("Replies with a sick comeback!")
        .addMentionableOption(option =>
            option.setName("user")
                .setDescription("The user to target")
                .setRequired(true)),
    usage: "<target>",
    async execute(interaction) {
        let msg = "<@" + interaction.options.getMentionable("user") + ">";
        msg += ", you are dumber than me. I am more experienced in life, and you are so much dumber that you don't know what you don't know, hence you think that this makes no sense which simply proves how dumb you are, and how far out of touch you are from this world, you need to see a therapist, and eat more cucumbers before it is too late before all the bob's take over the world and your mind, and everything you own and wish to own and you wake up and it is all a dream, but it is not, so you go cry yourself back to the rock that you crawled out of."
        await interaction.reply(msg);
    }
}