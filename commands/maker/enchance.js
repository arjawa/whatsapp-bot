const fetch = require('node-fetch')
const FormData = require('form-data')

module.exports = {
    name: ["hd"],
    type: ['maker'],
    description: "enchance image",
    utilisation: `kirim/reply gambar dengan ${userbot.prefix}hd`,
    
    async execute(m) {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) return m.reply('Tidak ada foto')
        if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Mime ${mime} tidak support`)
        let img = await q.download()
        let body = new FormData
        body.append('image', img, 'image')
        let res = await fetch('http://max-image-resolution-enhancer.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud/model/predict', {
            method: 'POST',
            body
        })
        if (!res.ok) return m.reply(Ft.Res(await res.json()))
        await conn.sendFile(m.chat, await res.buffer(), 'hd.jpg', 'Nih, hd kan?', m)
    }
}