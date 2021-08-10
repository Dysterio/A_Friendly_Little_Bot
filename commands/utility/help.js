const Discord = require("discord.js");

module.exports = {
	name: "help",
	description: "Display all commands.",
    botUsable: true,
	execute(message, args) {
		const embed = new Discord.MessageEmbed();
        embed.setTitle("Commands");
        embed.setColor(0x000000);

        message.client.commands.forEach(command => {
            embed.addField(`${command.name}`, `${command.description}`, false);
        });

        message.channel.send(embed);
        return true;
    }
}