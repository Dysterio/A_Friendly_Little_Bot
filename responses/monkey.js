module.exports = {
    name: "monkey",
    async execute(message) {
        await message.react("🐵");
    }
}