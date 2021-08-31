module.exports = {
    name: "DM",
    usage: "<recipientID> <msg>",
    desc: "Direct messages a specific user",
    async execute(message, args) {
        if (args.length < 1) return;
        const recipientID = args.shift();
        const text = args.join(" ");

        message.client.users.fetch(recipientID).then(recipient => {
            // Error Check
            if ((!text) &&
                (!message.embeds.length) &&
                (!message.attachments) &&
                (!message.components.length)) { return message.reply("Message must have body!"); }

            // Send Message
            recipient.send({
                ...(text ? {content: text} : {}),
                ...(message.embeds.length ? {embeds: message.embeds} : {}),
                ...(message.attachments ? {files: message.attachments} : {}),
                ...(message.components.length ? {components: message.components} : {})
            }).then(() => {
                const log = `Direct messaged ${recipient.username} (${message.url})`;
                message.client.logger.info(log);
                message.reply(log);
            });
        });
    }
}