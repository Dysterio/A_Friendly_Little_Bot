module.exports = {
    name: 'ping',
    description: 'Responds to the bot being pinged.',
    condition: message => message.mentions.has(message.client.user),
    async execute(message) {
        message.react('🤔');
    },
};