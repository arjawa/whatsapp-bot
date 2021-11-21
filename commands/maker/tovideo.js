let { webp2mp4 } = require('../../lib/webp2mp4')
let { ffmpeg } = require('../../lib/converter')

module.exports = {
name: ["tovideo"],
type: ["maker"],
useLimit: true,
description: "sticker gif to video",
utilisation: userbot.prefix + "tovideo <reply>",

    async execute(m) {
        let { conn, text } = data
    
        if (!m.quoted) return m.reply(`reply stiker/audio yang ingin diubah menjadi video dengan perintah ${userbot.prefix}tovideo`)
        let mime = m.quoted.mimetype || ''
        if (!/webp|audio/.test(mime)) return m.reply(`reply stiker/audio yang ingin diubah menjadi video dengan perintah ${userbot.prefix}tovideo`)
        let media = await m.quoted.download()
        let out = Buffer.alloc(0)
        if (/webp/.test(mime)) {
            m.reply('Processing...')
            out = await webp2mp4(media)
        } else if (/audio/.test(mime)) {
            m.reply('Processing...')
            out = await ffmpeg(media, [
                '-filter_complex', 'color',
                '-pix_fmt', 'yuv420p',
                '-crf', '51',
                '-c:a', 'copy',
                '-shortest'
            ], 'mp3', 'mp4')
        }
        await conn.sendFile(m.chat, out, 'out.mp4', 'succes convert to video', m, 0, { thumbnail: out })
    }
}
