const execSync = require("child_process").execSync;
const fs = require("fs");
const { codeBlock } = require('@discordjs/builders');

module.exports = {
    name: "restart",
    usage: "<hardReset>",
    desc: "Restarts the bot",
    async execute(message, args) {
        if (args.length) {
            let output = codeBlock(await execSync("git fetch --all", { encoding: "utf-8" }));
            output += codeBlock(await execSync("git reset --hard origin/master", { encoding: "utf-8" }));
            await message.reply(output);
            await fs.unlinkSync("logs.log");
        }
        process.exit();
        message.client.logger.warn(((args.length) ? "Hard-" : "") + "Restarted the bot");
    }
}