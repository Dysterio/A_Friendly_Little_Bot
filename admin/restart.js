const execSync = require("child_process").execSync;
const fs = require("fs");

module.exports = {
    name: "restart",
    usage: "<hardReset>",
    desc: "Restarts the bot",
    async execute(message, args) {
        let output = "";
        if (args.length) {
            output += "```" + (await execSync("git reset --hard " + args[0], {encoding: "utf-8"})) + "```";
            await message.reply(output);
            await fs.unlinkSync("logs.log");
        }
        process.exit();
        message.client.logger.warn(((args.length) ? "Hard-" : "") + "Restarted the bot");
    }
}