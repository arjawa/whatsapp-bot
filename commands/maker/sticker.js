const fs = require('fs')
const { MessageType } = require('@adiwajshing/baileys')
const { createSticker, createMetadata, addMetadata } = require('../../lib/sticker')

module.exports = {
    name: ["sticker", "s"],
    type: ["maker"],
    description: "membuat sticker dari gambar/video",
    utilisation: `kirim/reply gambar/video dengan ${userbot.prefix}sticker`,
    
    async execute(m) {
        let {
            conn,
            args,
            text,
            isMedia,
            isQuotedVideo,
            isQuotedImage
        } = data
        
        if (!isMedia && !isQuotedImage && !isQuotedVideo) return m.reply(`balas/kirim gambar/video dengan perintah ${userbot.prefix}sticker`)
        if ((isMedia && !m.message.videoMessage || isQuotedImage) || (isMedia && m.message.videoMessage.seconds < 11 || isQuotedVideo && m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) {
            m.reply('Processing...')
            let q = m.quoted ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
            let webp = './.tmp/stiker.webp'
            const media = await conn.downloadAndSaveMediaMessage(q, './.tmp/sticker')
            if (!media) return m.reply('Gagal membuat sticker')
            stickerNoMeta = await createSticker(media, webp)
            if (args.length > 1) {
                let [packname, author] = text.split`|`
                const metaData = await createMetadata(packname, author)
                const stickerWithMeta = await addMetadata(stickerNoMeta, metaData)
                conn.sendMessage(m.chat, fs.readFileSync(stickerWithMeta), MessageType.sticker)
                fs.unlinkSync(metaData)
            } else {
                conn.sendMessage(m.chat, fs.readFileSync(stickerNoMeta), MessageType.sticker)
            }
            fs.unlinkSync(media)
            fs.unlinkSync(webp)
        }
    }
}