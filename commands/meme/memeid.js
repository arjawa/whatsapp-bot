let fetch = require('node-fetch')

module.exports = {
    name: ["memeid"],
    type: ["meme"],
    description: "random meme indo",
    utilisation: userbot.prefix + "memeid",
    
    async execute(m) {
        let { conn } = data
        try {
            let res = await fetch('https://wibu.herokuapp.com/meme')
            let json = await res.json()
            conn.sendFile(m.chat, json.url, 'meme.jpeg', null, m)
        } catch (e) {
            console.log(e)
            m.reply('Gagal mengirim gambar!')
        }
    }
}
