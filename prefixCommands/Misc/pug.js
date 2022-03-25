const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "pug",
    usage: "?numOfTeams? <...names>",
    desc: "Randomly distribute the members passed into teams.",
    async execute(message, args) {
        // Error check
        let numOfTeams = 2;
        let people = args;
        if (people[0].match(/^-?\d+$/)) {
            numOfTeams = parseInt(people.shift());
        }
        if (people.length < 3 || numOfTeams < 2) {
            message.reply("Yeah... no...");
            return;
        }
        // Distribute into teams
        let teams = [];
        for (let i = 0; i < numOfTeams; i++) {
            teams.push([]);
        }
        let teamsIndex = 0;
        for (let i = people.length - 1; i >= 0; i--) {
            teams[teamsIndex].push(people.splice(Math.floor(Math.random() * people.length), 1)[0]);
            if (++teamsIndex === teams.length) teamsIndex = 0;
        }
        // Create embed
        let allTeams = new MessageEmbed()
            .setColor("#0000000")
            .setTitle("PuG");
        for (let tI = 0; tI < numOfTeams; tI++) {
            let teamMembers = "";
            for (let i = 0; i < teams[tI].length; i++) {
                teamMembers += teams[tI][i] + "\n";
            }
            allTeams.addField("Team " + (tI + 1), teamMembers, true);
        }
        // Send message
        message.reply({ embeds: [allTeams] }).then(() => {
            message.client.logger.info("Pugged woof");
        })
    }
}