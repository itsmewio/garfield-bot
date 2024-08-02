const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Berechnet die Liebesprozent zwischen zwei Nutzern.')
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('Der erste Nutzer')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('Der zweite Nutzer')
                .setRequired(true)),
    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');
        const lovePercentage = Math.floor(Math.random() * 101); // Generiert eine Zufallszahl zwischen 0 und 100

        let emoji;
        if (lovePercentage < 10) {
            emoji = '💔';
        } else if (lovePercentage <= 25) {
            emoji = '❤️‍🩹';
        } else if (lovePercentage <= 50) {
            emoji = '❤️';
        } else if (lovePercentage <= 80) {
            emoji = '💕';
        } else if (lovePercentage <= 90) {
            emoji = '💘';
        } else {
            emoji = '❤️‍🔥';
        }

        await interaction.reply(`Die Liebe zwischen ${user1} und ${user2} beträgt ${lovePercentage}%. ${emoji}`);
    },
};
