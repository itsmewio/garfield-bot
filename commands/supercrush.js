const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient } = require('discord.js');
const { supercrushWebhookUrl, supercrushTime, guildId } = require('../config.json');

const webhookClient = new WebhookClient({ url: supercrushWebhookUrl });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supercrush')
        .setDescription('Verkündet den heutigen Supercrush.'),
    async execute(interaction) {
        try {
            const supercrushUserId = fs.readFileSync('supercrushuser.txt', 'utf-8').trim();
            const supercrushUser = await interaction.guild.members.fetch(supercrushUserId);
            await interaction.reply(`Den heutigen Supercrush bekommt ${supercrushUser}! 🤩`);
        } catch (error) {
            console.error('Error executing /supercrush command:', error);
            await interaction.reply('Fehler beim Ausführen des Befehls.');
        }
    },
};

function scheduleSupercrushAnnouncement(client) {
    const [hour, minute] = supercrushTime.split(':').map(Number);
    const now = new Date();
    const firstAnnouncement = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0,
        0
    );

    if (firstAnnouncement < now) {
        firstAnnouncement.setDate(firstAnnouncement.getDate() + 1);
    }

    const timeUntilFirstAnnouncement = firstAnnouncement - now;
    console.log(`First supercrush announcement in ${timeUntilFirstAnnouncement / 1000 / 60} minutes`);

    setTimeout(() => {
        announceSupercrush(client);
        setInterval(() => {
            announceSupercrush(client);
        }, 24 * 60 * 60 * 1000);
    }, timeUntilFirstAnnouncement);
}

async function announceSupercrush(client) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const members = await guild.members.fetch();
        const nonBotMembers = members.filter(member => !member.user.bot);
        const randomMember = nonBotMembers.random();
        if (!randomMember) {
            console.error('No non-bot members found.');
            return;
        }
        
        fs.writeFileSync('supercrushuser.txt', randomMember.id);
        await webhookClient.send(`Den heutigen Supercrush bekommt ${randomMember}! 🤩`);
    } catch (error) {
        console.error('Error announcing supercrush:', error);
    }
}

module.exports.scheduleSupercrushAnnouncement = scheduleSupercrushAnnouncement;
