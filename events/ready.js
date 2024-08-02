const fs = require('fs');
const { supercrushChannelId } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        // Supercrush Funktionalität
        setInterval(async () => {
            const guild = await client.guilds.fetch(client.config.guildId);
            const members = await guild.members.fetch();
            const randomMember = members.random();
            fs.writeFileSync('supercrushuser.txt', randomMember.id);
            const channel = client.channels.cache.get(supercrushChannelId);
            channel.send(`Der heutige Supercrush bekommt ${randomMember}! 🤩`);
        }, 24 * 60 * 60 * 1000); // Jeden Tag um 6 Uhr
    },
};
