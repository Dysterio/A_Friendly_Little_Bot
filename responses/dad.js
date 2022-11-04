module.exports = {
    name: 'dad',
    description: 'Replies with a dad joke',
    condition: message => message.content.toLowerCase().startsWith('i\'m')
        || message.content.toLowerCase().startsWith('im')
        || message.content.toLowerCase().startsWith('i am'),
    async execute(message) {
        const content = message.content.toLowerCase();
        let name = '';
        if (content.startsWith('i\'m')) {
            name = content.slice(3).trim();
        } else if (content.startsWith('im')) {
            name = content.slice(2).trim();
        } else if (content.startsWith('i am')) {
            name = content.slice(4).trim();
        }
        message.reply(`Hi "${name}", I'm ${message.client.user.username}!`);
    },
};