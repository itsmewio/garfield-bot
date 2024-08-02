const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lasagne')
        .setDescription('Gibt eine Nachricht aus die Garfield gespeichert hat.'),
    async execute(interaction) {
        const responses = fs.readFileSync('responses.txt', 'utf-8').split('\n');
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply(randomResponse);
    },
};
