const fs = require('fs')
const uploadImage = require('../../lib/uploadImage')

module.exports = {
    name: ['upload'],
    type: ['misc'],
    description: 'upload image to telegraph',
    utilisation: `kirim/reply gambar dengan ${userbot.prefix}upload`,
    
    async execute(m) {
        let {
            conn,
            args,
            isMedia,
            isQuotedVideo,
            isQuotedImage
        } = data
        
        if ((isMedia && !m.message.videoMessage || isQuotedImage) && args.length == 0) {
            let q = m.quoted ? m.quoted : m
            let img = await q.download()
            if (!img) return m.reply(`kirim/balas gambar dengan perintah ${userbot.prefix}upload`)
            let result = await uploadImage(img)
            m.reply(result)
        }
    }
}