module.exports = {
    name: "setUsername",
    async execute(message, args){
        if (args.length === 0) return;
        const username = args.join(" ");
        await message.client.user.setUsername(username)
            .then(() => { message.reply("Username updated to " + username); })
    }
}