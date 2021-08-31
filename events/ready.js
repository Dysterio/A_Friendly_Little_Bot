module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.users.fetch(process.env.ADMIN_ID).then(admin => {
            admin.send("Bot is online!");
        });
        client.logger.info(`\n\t\t\tReady! Logged in as ${client.user.tag}`);
    }
}