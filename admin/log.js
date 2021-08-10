module.exports = {
    name: "log",
    description: "Get the log",
    execute(client, message, args) {
      message.reply({ files: ["./log.txt"] });
      return true;
    }
}