module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot) return;
        const dm = message.channel.type === "DM";
        (dm) ? await this.dmHandler(message) : await this.messageHandler(message);
    },
    async dmHandler(message) {
        const admin = message.author.id === process.env.ADMIN_ID;
        (admin) ? await this.adminHandler(message) : await this.forward(message);
    },
    async adminHandler(message) {
        // Error Check
        if (!message.content.startsWith(process.env.PREFIX)) return;
        // Get command & args
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift();
        const command = message.client.admin.get(commandName);
        // Execute command
        if (!command) return message.reply("No such command found...");
        command.execute(message, args)
            .catch(error => {
                const log = error.toString();
                message.client.logger.error(log);
                throw error;
            });
    },
    async forward(message) {
        const admin = await message.client.users.cache.get(process.env.ADMIN_ID);
        await admin.send({
            content: "<@" + message.author.id + "> said:\n" + message.content,
            embeds: message.embeds,
            files: Array.from(message.attachments.values()),
            components: message.components
        });
    },
    async messageHandler(message) {
        message.client.ticTacToeKB.forEach(kb => {
            if (message.content.toLowerCase() !== kb.name) return;
            kb.execute(message);
        })

        message.client.responses.forEach(response => {
            if (!message.content.toLowerCase().split(/ +/).includes(response.name)) return;
            response.execute(message);
        });
    },
};