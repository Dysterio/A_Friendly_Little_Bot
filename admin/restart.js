const execSync = require("child_process").execSync;

module.exports = {
    name: "restart",
    usage: "<hardReset>",
    desc: "Restarts the bot",
    async execute(message, args) {
        if (args.length !== 1) return;
        const hardRestart = args[0] === "true";
        let output = "";
        if (hardRestart) {
            output += "```" + (await execSync("git reset --hard origin/master", {encoding: "utf-8"})) + "```";
            message.reply(output);
        }
        execSync("busybox reboot", { encoding: "utf-8" });
        message.client.logger.warn(((hardRestart) ? "Hard-" : "") + "Restarted the bot");
    }
}