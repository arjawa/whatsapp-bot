let { webp2png } = require('../../lib/webp2mp4')

module.exports = {
name: ["toimg"],
type: ["maker"],
description: "sticker to image",
utilisation: `reply sticker dengan ${userbot.prefix}toimg`,

    async execute(m) {
        let { conn } = data
        
        if (!m.quoted) return m.reply(`balas stiker dengan perintah ${userbot.prefix}toimg`)
        let mime = m.quoted.mimetype || ''
        if (!/webp/.test(mime)) return m.reply(`balas stiker dengan perintah ${userbot.prefix}toimg`)
        let media = await m.quoted.download()
        let out = Buffer.alloc(0)
        if (/webp/.test(mime)) {
            m.reply('Processing...')
            out = await webp2png(media)
        }
        await conn.sendFile(m.chat, out, 'out.png', 'Done!', m, false, { thumbnail: out })
    }
}
