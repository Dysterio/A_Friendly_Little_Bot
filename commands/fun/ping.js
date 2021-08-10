module.exports = {
    name: "ping",
    description: "PingPong!",
    execute(message, args) {
        message.channel.send("Pong!");
        return true;
    }
}