module.exports = {
    name: "say",
    description: "Make the bot say something in the chat.",
    execute(message, args) {
        if (args.length == 0) {
            message.channel.send("Invalid arguments...");
            return false;
        }
        if (args[2] === "!say") {
          message.channel.send("Can't nest more than 3 says...");
          return false;
        }
        if (message.attachments.size > 0) {
          nsfwjs.load()
            .then(function (model) {
              // Classify the image
              return model.classify(message.attachments.array()[0])
            })
            .then(function (predictions) {
              console.log('Predictions: ', predictions)
            })
        }
        message.delete().catch(console.error);
        output = "";
        for (i = 0; i < args.length; i++) {
            output += args[i] + " ";
        }
        message.channel.send(output);
        return true;
    }
}