module.exports = {
    name: "react",
    usage: "<channelID> <messageID> <emoji>",
    desc: "Reacts to a message",
    async execute(message, args) {
        if (args.length !== 3) return;
        const channelID = args[0];
        const messageID = args[1];
        const emoji = args[2];

        message.client.channels.fetch(channelID).then(channel => {
            channel.messages.fetch(messageID).then(msg => {
                // Send Reaction
                msg.react(emoji).then(() => {
                    const log = `Reacted ${emoji} to ${msg.author.username} (${msg.url})`;
                    message.client.logger.info(log);
                    message.reply(log);
                });
            });
        });
    }
}