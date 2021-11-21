const fetch = require('node-fetch')

module.exports = {
    name: ["add"],
    type: ['group'],
    description: "add nomer ke grup (admin only)",
    group: true,
    admin: true,
    botAdmin:true,
    utilisation: userbot.prefix + "add",
    
    async execute(m) {
        let { conn, text, participants } = data
        
        if (!text) return m.reply(`contoh: ${userbot.prefix + command + ' 62880376xxx'}`)
        /*let _participants = participants.map(user => user.jid)*/
        let users = (await Promise.all(
            text.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 /*&& !_participants.includes(v + '@s.whatsapp.net')*/)
            .map(async v => [
                v,
                await conn.isOnWhatsApp(v + '@s.whatsapp.net')
            ])
        )).filter(v => v[1]).map(v => v[0] + '@c.us')
        
        let response = await conn.groupAdd(m.chat, users)
        switch (response[users]) {
            case 200:
                return m.reply('Nomor berhasil ditambahkan ke group!')
                break
            case 400:
                return m.reply('Nomor salah!')
                break
            case 403:
                return m.reply('Nomor di privasi!')
                break
            case 408:
                let pp = await conn.getProfilePicture(m.chat).catch(_ => false)
                let jpegThumbnail = pp ? await (await fetch(pp)).buffer() : false
                for (let user of response.participants.filter(user => Object.values(user)[0].code == 403)) {
                    let [[jid, {
                        invite_code,
                        invite_code_exp
                    }]] = Object.entries(user)
                    let teks = `Mengundang @${jid.split`@`[0]} menggunakan invite...\n\n@FtBot`
                    m.reply(teks, null, {
                        contextInfo: {
                            mentionedJid: conn.parseMention(teks)
                        }
                    })
                    await conn.sendGroupV4Invite(m.chat, jid, invite_code, invite_code_exp, false, 'Invitation to join my WhatsApp group', jpegThumbnail ? {
                        jpegThumbnail
                    } : {})
                }
                return m.reply(`Nomor tersebut telah keluar baru² ini\nHanya bisa masuk lewat *${userbot.prefix}link* grup`)
                break
            case 409:
                return m.reply('Nomor sudah ada di dalam group!')
                break
            case 509:
                return m.reply('Group sudah penuh!')
                break
        }
    }
}
