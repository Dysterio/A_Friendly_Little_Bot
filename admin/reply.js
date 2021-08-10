module.exports = {
    name: "reply",
    description: "Forward messages to owner",
    execute(client, message) {
      client.users.fetch("775649015944708096", false).then((user) => {
        var text = "<@" + message.author.id + "> said:\n" + message.content ;
        if (message.attachments.size > 0) {
          user.send(text, {files: [message.attachments.array()[0].url]});   
        } else {
          user.send(text);
        }
      })
      return true;
    }
}