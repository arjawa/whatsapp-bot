const fs = Ft.fs
let limit = 30
const { servers, yta } = require('../../lib/y2mate')
const fetch = require('node-fetch')


module.exports = {
    name: ["yta"],
    type: ["download"],
    useLimit: true,
    description: "download audio from youtube url",
    utilisation: userbot.prefix + "yta <link>",
    
    async execute(m) {
        let { conn, args } = data
        try {
            if (!args[0]) return m.reply(`contoh: ${userbot.prefix}yta https://youtu.be/Ghdyjxxx`, false, { detectLinks: false })
            if (!args[0].includes("youtu")) return m.reply('invalid url!')
            let server = (args[1] || servers[0]).toLowerCase()
            let { dl_link, thumb, title, filesize, filesizeF } = await yta(args[0], servers.includes(server) ? server : servers[0])
            let isLimit = (limit) * 1024 < filesize  
            m.reply(isLimit ? `Ukuran File: ${filesize}\nUkuran file diatas ${limit} MB, download sendiri: ${dl_link}` : 'Processing...' )
            conn.sendButtonLoc(m.chat, await (await fetch (thumb)).buffer(), `
            *ＹＴＭＰ３*\n*Title :* ${title}\n*Size :* ${filesizeF}`, userbot.packname, 'Menu', 'menu', m)
            if (!isLimit) conn.sendFile(m.chat, dl_link, title + ".mp3", null, m)
        } catch (e) {
            m.reply("Gagal mendownload audio!")
            console.log(e)
        }
    }
}
