module.exports = {
    name: "!hasan",
    description: "Increment Hasan's 's' count",
    botUsable: false,
    execute(message) {
        let origMsg = message.content;
        let newMsg = origMsg;
        let incrementIndex = origMsg.toLowerCase().indexOf("hasan") + 2;
        message.channel.send(origMsg).then((msg) => {
            let counter = 0;
            let interval = setInterval(() => {
                newMsg = newMsg.substring(0, incrementIndex) + "s" + newMsg.substring(incrementIndex, newMsg.length);
                msg.edit(newMsg);
                counter++;
                if (counter == 10) {
                    clearInterval(interval);
                }
            }, 100);
        });
        return true;
    }
}