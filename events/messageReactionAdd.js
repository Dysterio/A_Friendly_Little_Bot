module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user) {
        if (reaction.partial) {
            try { await reaction.fetch(); }
            catch(error) { return console.log(error); }
        }
        this.jacobISleep(reaction, user);
    },
    jacobISleep: async (reaction, user) => {
      if (reaction.message.guildId !== "442268458072276992") return;
        if (user.id !== "202206936601460736") return;
        if (reaction.emoji.name !== "isleep") return;
        const emoji = reaction.message.guild.emojis.cache.find(emoji => emoji.name === "nosleep");
        await reaction.message.react(emoji);
    }
};