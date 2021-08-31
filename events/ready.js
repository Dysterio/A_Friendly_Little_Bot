module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.users.fetch(process.env.ADMIN_ID).then(admin => {
            admin.send(client.user.username + " is online! ✔");
        });
        client.logger.info(`\n\t\t\tReady! Logged in as ${client.user.tag}`);
    }
}