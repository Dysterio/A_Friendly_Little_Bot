module.exports = {
    name: "eval",
    usage: "<statement(s)>",
    desc: "Executes JS command(s)",
    async execute(message, args) {
        if (!args.length) return;
        const statements = args.join(" ");
        message.reply(eval(statements));
        message.client.logger.info("Executed eval on:" + statements.replaceAll("\n", "\n\t\t\t\t"));
    }
}