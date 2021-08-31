const execSync = require("child_process").execSync;

module.exports = {
    name: "exec",
    usage: "",
    desc: "Executes a command on the terminal",
    async execute(message, args) {
        if (!args.length) return;
        const command = args.join(" ");
        const output = execSync(command, { encoding: "utf-8" });
        message.reply("```" + output + "```");
        message.client.logger.info("Executed " + command);
    }
}
