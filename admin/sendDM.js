module.exports = {
    name: "sendDM",
    description: "Send a DM to a user",
    execute(client, message, args) {
        const recipient = args[0];
        var text = "";
        for (i = 1; i < args.length; i++) {
          text += args[i] + " ";
        }
        client.users.fetch(`${recipient}`, false).then((user) => {
          user.send(text);
        });
        return true;
    }
}