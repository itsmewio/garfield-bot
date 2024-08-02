const { autoReactChannelId, autoReactEmojis, autoReactProbability, randomMessagesChannelId, randomMessageProbability } = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Ignoriere Nachrichten des Bots selbst
        if (message.author.bot) return;

        // AutoReact
        if (message.channel.id === autoReactChannelId && Math.random() < autoReactProbability) {
            const randomEmoji = autoReactEmojis[Math.floor(Math.random() * autoReactEmojis.length)];
            await message.react(randomEmoji);
        }

        // RandomMessages
        if (message.channel.id === randomMessagesChannelId && Math.random() < randomMessageProbability) {
            const responses = fs.readFileSync('responses.txt', 'utf-8').split('\n');
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            await message.channel.send(randomResponse);
        }
    },
};
