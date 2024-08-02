const fs = require('fs');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId, guildId, autoReactChannelId, randomMessagesChannelId, supercrushChannelId, autoReactEmojis, autoReactProbability, randomMessageProbability, ignoreRoleId } = require('./config.json');
const { scheduleSupercrushAnnouncement } = require('./commands/supercrush');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started deleting application (/) commands.');

        const existingCommands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        );

        for (const command of existingCommands) {
            await rest.delete(
                Routes.applicationGuildCommand(clientId, guildId, command.id)
            );
        }

        console.log('Successfully deleted all existing application (/) commands.');

        const commands = [];
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            commands.push(command.data.toJSON());
        }

        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');

        client.login(token);
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    scheduleSupercrushAnnouncement(client);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // Überprüfen, ob der Benutzer die ignorierte Rolle hat
    if (interaction.member.roles.cache.has(ignoreRoleId)) {
        return; // Ignoriere die Interaktion
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Überprüfen, ob der Benutzer die ignorierte Rolle hat
    if (message.member.roles.cache.has(ignoreRoleId)) {
        return; // Ignoriere die Nachricht
    }

    if (message.channel.id === autoReactChannelId && Math.random() < autoReactProbability) {
        const randomEmoji = autoReactEmojis[Math.floor(Math.random() * autoReactEmojis.length)];
        await message.react(randomEmoji);
    }

    if (message.channel.id === randomMessagesChannelId && Math.random() < randomMessageProbability) {
        const responses = fs.readFileSync('responses.txt', 'utf-8').split('\n').filter(Boolean);
        if (responses.length > 0) {
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            if (randomResponse.trim() !== '') {
                await message.channel.send(randomResponse);
            }
        }
    }

    if (message.content.toLowerCase() === 'lasagne') {
        const responses = fs.readFileSync('responses.txt', 'utf-8').split('\n').filter(Boolean);
        if (responses.length > 0) {
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            if (randomResponse.trim() !== '') {
                await message.channel.send(randomResponse);
            }
        }
    }
});
