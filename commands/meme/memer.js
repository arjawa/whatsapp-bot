let fetch = require('node-fetch')

module.exports = {
    name: ["memer"],
    type: ["meme"],
    useLimit: true,
    description: "meme from redit",
    utilisation: userbot.prefix + "memer",
    
    async execute(m) {
        let { conn } = data
        try {
            let res = await fetch('https://meme-api.herokuapp.com/gimme')
            let json = await res.json()
            if (json.status) throw json
            let caption = `©Reddit\nAuthor: ${json.author} Subreddit: ${json.subreddit}\n${json.postLink}`.trim()
            conn.sendFile(m.chat, json.url, 'meme.jpg', caption, m)
        } catch (e) {
            console.log(e)
            m.reply('Gagal mengirim gambar!')
        }
    }
}
