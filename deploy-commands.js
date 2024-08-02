const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const fs = require('fs');

console.log(`Client ID: ${clientId}`);
console.log(`Guild ID: ${guildId}`);

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started deleting application (/) commands.');

        // Get all existing commands
        const existingCommands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        );

        // Delete all existing commands
        for (const command of existingCommands) {
            await rest.delete(
                Routes.applicationGuildCommand(clientId, guildId, command.id)
            );
        }

        console.log('Successfully deleted all existing application (/) commands.');

        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
