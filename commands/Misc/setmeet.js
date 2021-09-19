const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageButton, MessageActionRow, MessageEmbed} = require("discord.js");
const TicTacToe = require("../../TicTacToe");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setmeet")
        .setDescription("Setup a meet!")
        .addStringOption(option =>
            option.setName("msg")
                .setDescription("The msg to display")
                .setRequired(true)),
    usage: "<msg>",
    async execute(interaction) {
        if (interaction.member.id !== process.env.ADMIN_ID) return interaction.reply("You can not use this command.");
        const msg = interaction.options.getString("msg");
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("opt-in")
                    .setLabel("Accept")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("opt-out")
                    .setLabel("Decline")
                    .setStyle("DANGER"));
        await interaction.reply({ content: msg, components: [row] });
        const i = await interaction.fetchReply();
        const collector = i.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 86400000
        });
        collector.on("collect", button => {
            let partOfTeam;
            if (button.customId === "opt-in") partOfTeam = this.accept(i, button);
            if (button.customId === "opt-out") partOfTeam = this.decline(i, button);
            if (!partOfTeam) return button.reply({ content: "You are not part of the current roster", ephemeral: true });
        });
    },
    async accept(msg, button) {
        if (button.user.id === process.env.ADMIN_ID) await msg.react("⬛");
        else if (button.user.id === "407699831276961802") await msg.react("🟦");
        else return;
        button.reply({ content: "You have opt-in for the meet!", ephemeral: true });
    },
    async decline(msg, button) {
        try {
            if (button.user.id === process.env.ADMIN_ID) return msg.reactions.resolve(":black_large_square:").remove();
            if (button.user.id === "407699831276961802") return msg.reactions.cache.get("🟦").remove();
            button.reply({content: "You have opt-out for the meet!", ephemeral: true});
        } catch (error) {
            console.log(error);
            button.reply({ content: "You gotta opt-in first...", ephemeral: true});
        }
    }
}