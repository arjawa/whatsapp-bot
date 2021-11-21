const fetch = require('node-fetch')
const { ytmp4 } = require('../../lib/wapi')
let limit = 40

module.exports = {
    name: ["ytv"],
    type: ["download"],
    description: "download video from youtube url",
    utilisation: userbot.prefix + "ytv <link>",
    
    async execute(m) {
        let { conn, args } = data
        try {
            if (!args[0]) return m.reply(`contoh: ${userbot.prefix}ytv https://youtu.be/Ghdyjxxx`, false, { detectLinks: false })
            if (!args[0].includes("youtu")) return m.reply('invalid url!')
            let { dl_link, thumb, title, filesize, raw_filesize } = await ytmp4(args[0])
            
            let isLimit = (limit) * 1024 < raw_filesize
            m.reply(isLimit ? `Ukuran File: ${filesize}\nUkuran file diatas ${limit} MB, download sendiri: ${dl_link}` : 'Processing...' )
            let teks = `*ＹＴＭＰ４*\n*title :* ${title}\n*Size :* ${filesize}`
            conn.sendButtonLoc(m.chat, await (await fetch(thumb)).buffer(), teks.trim(), userbot.packname, 'AUDIO', `audio ${args[0]}`, m)
            if (!isLimit) conn.sendVideo(m.chat, dl_link, null, m)
        } catch (e) {
            console.log(e)
            m.reply('Download gagal!')
        }
    }
}