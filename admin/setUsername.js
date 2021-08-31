module.exports = {
    name: "setUsername",
    async execute(message, args){
        if (args.length === 0) return;
        const username = args.join(" ");
        await message.client.user.setUsername(username)
            .then(() => {
                const log = `Updated username to ${username}`;
                message.client.logger.info(log);
                message.reply(log);
            })
    }
}