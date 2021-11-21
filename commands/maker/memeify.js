const uploadFile = require('../../lib/uploadFile')
const uploadImage = require('../../lib/uploadImage')

module.exports = {
    name: ['memeify'],
    type: ['maker'],
    description: "untuk membuat sticker text meme",
    utilisation: `kirim/reply gambar dengan ${userbot.prefix}memeify <teks_atas>|<teks_bawah>`,
    
    async execute(m) {
        let { text, conn } = data
        
        if (!text) return m.reply(`contoh: ${userbot.prefix + command}memeify <teks_atas>|<teks_bawah>`)
        let [t1, t2] = text.split`|`
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) return m.reply(`Unknown Mimetype`)
        if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Mime ${mime} tidak didukung`)
        let img = await q.download()
        
        m.reply('Processing...')
        let link = await uploadImage(img).catch(e => uploadFile(img))
        /*conn.sendFile(m.chat, (`https://api.memegen.link/images/custom/${encodeURIComponent(t1 ? t1 : '_')}/${encodeURIComponent(t2 ? t2 : '_')}.png`, {
            background: link
        }), 'meme.png', 'tes', m)*/
        conn.sendFile(m.chat, (`https://api.memegen.link/images/custom/${encodeURIComponent(t1 ? t1 : '_')}/${encodeURIComponent(t2 ? t2 : '_')}.png?background=${link}`))
    }
}
