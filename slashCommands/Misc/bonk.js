const {MessageEmbed} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("bonk")
        .setDescription("Records a horny violation for a user and bonks them.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to target")
                .setRequired(true)),
    usage: "<target>",
    async execute(interaction) {
        const userID = interaction.options.getUser("user");
        if (userID.bot) return interaction.reply("Yeah I doubt that...");
        const embed = new MessageEmbed()
            .setColor("#000000")
            .setTitle("Horny Detected")
            .setThumbnail("https://cdn.discordapp.com/attachments/891134318565535855/982768889383485530/unknown.png")
            .setDescription(`${userID} has been reported for being publicly horny.\nRemember to keep it PG lads smh...`);
        interaction.client.db.query(`SELECT \"count\" FROM \"HORNY_COUNT\" WHERE \"userID\"=\'${userID.id}\';`, (err, res) => {
            if (err) throw err;
            let query = `INSERT INTO "HORNY_COUNT" VALUES (${userID.id}, ${1});`
            if (res.rows.length !== 0) {
                const newCount = parseInt(res.rows[0].count) + 1;
                query = `UPDATE "HORNY_COUNT" SET "count"=${newCount} WHERE "userID"='${userID.id}';`
            }
            interaction.client.db.query(query)
        });
        await interaction.reply({embeds: [embed]});
    }
}