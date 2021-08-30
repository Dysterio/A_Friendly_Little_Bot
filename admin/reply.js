module.exports = {
    name: "reply",
    async execute(message, args) {
        if (args.length < 2) return;
        const channelID = args.shift();
        const messageID = args.shift();
        const text = args.join(" ");

        message.client.channels.fetch(channelID).then(channel => {
            channel.messages.fetch(messageID).then(msg => {
                // Error Check
                if ((!text) &&
                    (!message.embeds.length) &&
                    (!message.attachments) &&
                    (!message.components.length)) { return message.reply("Message must have body!"); }

                // Send Reply
                msg.reply({
                    ...(text ? {content: text} : {}),
                    ...(message.embeds.length ? {embeds: message.embeds} : {}),
                    ...(message.attachments ? {files: message.attachments} : {}),
                    ...(message.components.length ? {components: message.components} : {})
                }).then(() => {
                    message.reply("Reply sent successfully!");
                });
            });
        });
    }
}