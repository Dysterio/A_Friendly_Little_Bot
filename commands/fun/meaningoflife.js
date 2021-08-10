module.exports = {
    name: "meaningoflife",
    description: "Shares the secret of life.",
    execute(message, args) {
        message.channel.send(`<:monkey_face:843103351230431253>`);
        return true;
    }
}