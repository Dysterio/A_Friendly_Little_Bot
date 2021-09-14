module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        await command.execute(interaction);
        interaction.client.logger.info(`${interaction.user.username} triggered ${interaction.commandName} in ${interaction.guild.name} #${interaction.channel.name}`);
    },
};