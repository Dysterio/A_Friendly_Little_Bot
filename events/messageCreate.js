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
        const client = message.client;
        if (message.content.startsWith(process.env.PREFIX)) {
            return this.prefixCommandHandler(message);
        }
        const msgContent = message.content.toLowerCase();
        if (client.tttKBs.keybinds.includes(msgContent)) {
            await client.tttKBs.execute(message);
        }
        if (client.utttKBs.keybinds.includes(msgContent)) {
            await client.utttKBs.execute(message);
        }
    },
    async prefixCommandHandler(message) {
        // Get command & args
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift();
        const command = message.client.prefixCommands.get(commandName);
        // Execute command
        if (!command) return;
        command.execute(message, args)
            .catch(error => {
                const log = error.toString();
                message.client.logger.error(log);
                throw error;
            });
    },
};