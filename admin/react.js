module.exports = {
    name: "react",
    async execute(message, args) {
        if (args.length !== 3) return;
        const channelID = args[0];
        const messageID = args[1];
        const emoji = args[2];

        message.client.channels.fetch(channelID).then(channel => {
            channel.messages.fetch(messageID).then(msg => {
                // Send Reaction
                msg.react(emoji).then(() => {
                    message.reply("Reaction sent successfully!");
                });
            });
        });
    }
}