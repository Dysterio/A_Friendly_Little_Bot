module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.logger.info(`Ready! Logged in as ${client.user.tag}`);
    }
}