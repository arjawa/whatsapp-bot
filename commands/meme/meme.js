let fetch = require('node-fetch')

module.exports = {
    name: ["meme"],
    type: ["meme"],
    description: "random meme",
    utilisation: userbot.prefix + "meme",
    
    async execute(m) {
        let { conn } = data
        try {
            let res = await fetch('https://some-random-api.ml/meme')
            let json = await res.json()
            conn.sendFile(m.chat, json.image, 'meme.jpg', json.caption, m)
        } catch (e) {
            console.log(e)
            m.reply('Gagal mengirim gambar!')
        }
    }
}
