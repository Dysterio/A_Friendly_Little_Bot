module.exports = {
    name: "logs",
    usage: "",
    desc: "Retrieves the logs file",
    async execute(message) {
        message.reply({ files: ["./logs.log"] });
        message.client.logger.info("Retrieved logs");
    }
}