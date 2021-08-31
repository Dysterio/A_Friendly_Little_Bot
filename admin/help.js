const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    usage: "?command?",
    desc: "Displays all the admin commands",
    async execute(message, args) {
        // Create embed
        let commands = new MessageEmbed()
            .setColor("#0000000")
            .setTitle("Admin Commands")
            .setThumbnail(message.client.user.avatarURL());
        // Check for args
        if (!args.length) {
            message.client.admin.forEach(command => {
                commands.addField(`!${command.name} ${command.usage}`, command.desc);
            })
        } else {
            const commandName = args.shift();
            const command = message.client.admin.get(commandName);
            commands.addField(`!${command.name} ${command.usage}`, command.desc);
        }
        // Send message
        message.reply({ embeds: [commands] }).then(() => {
            message.client.logger.info("Retrieved admin commands");
        })
    }
}