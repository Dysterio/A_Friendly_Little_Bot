module.exports = {
    name: "SM",
    usage: "<channelID> <msg>",
    desc: "Sends a server message",
    async execute(message, args) {
        if (args.length < 1) return;
        const channelID = args.shift();
        const text = args.join(" ");

        message.client.channels.fetch(channelID).then(channel => {
            // Error Check
            if ((!text) &&
                (!message.embeds.length) &&
                (!message.attachments) &&
                (!message.components.length)) { return message.reply("Message must have body!"); }

            // Send Message
            channel.send({
                ...(text ? {content: text} : {}),
                ...(message.embeds.length ? {embeds: message.embeds} : {}),
                ...(message.attachments ? {files: message.attachments} : {}),
                ...(message.components.length ? {components: message.components} : {})
            }).then(msgSent => {
                const log = `Server messaged on ${channel.guild.name} #${channel.name} (${msgSent.url})`;
                message.client.logger.info(log);
                message.reply(log);
            });
        });
    }
}