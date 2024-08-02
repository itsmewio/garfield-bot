const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Füttere Garfield mit neuen Nachrichten!')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('Die Nachricht oder der Link eines GIFs, das hinzugefügt werden soll.')
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        console.log(`Received message: ${message}`);

        if (message) {
            let fileContent = fs.readFileSync('responses.txt', 'utf-8');
            if (fileContent.trim() !== '') {
                fileContent += '\n';
            }
            fileContent += message;
            fs.writeFileSync('responses.txt', fileContent);
            await interaction.reply('Nachricht hinzugefügt!');
        } else {
            await interaction.reply('Fehler: Nachricht konnte nicht abgerufen werden.');
        }
    },
};
