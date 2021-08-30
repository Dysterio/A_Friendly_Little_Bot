module.exports = {
  name: "<:isleep:788228137074425866>",
  async execute(message) {
    if (message.guildId !== "442268458072276992") return;
    if (message.content !== "<:isleep:788228137074425866>") return;
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === "nosleep");
    await message.react(emoji);
  },
}