module.exports = {
    name: "logs",
    async execute(message) {
        message.reply({ files: ["./logs.log"] });
        message.client.logger.info("Retrieved logs");
    }
}