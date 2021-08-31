module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.users.cache.get(process.env.ADMIN_ID).then(admin => {
            admin.send("Bot is online!");
        });
        client.logger.info(`\n\t\tReady! Logged in as ${client.user.tag}`);
    }
}