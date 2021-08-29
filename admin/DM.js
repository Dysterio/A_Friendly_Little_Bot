module.exports = {
    name: "DM",
    async execute(message, args) {
        if (args.length < 2) return;
        const recipientID = args.shift();
        const msg = args.join(" ");

        message.client.users.fetch(recipientID).then(recipient => {
            recipient.send({
                content: msg,
                embeds: message.embeds,
                files: Array.from(message.attachments.values()),
                components: message.components
            }).then(() => { message.reply("DM sent successfully!"); });
        });
    }
}