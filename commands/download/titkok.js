const { tiktokmusic } = require("../../lib/scrape.js")

module.exports = {
    name: ["tiktok"],
    type: ["download"],
    description: "download video from tiktok with url",
    utilisation: userbot.prefix + "tiktok <url>",
    
    async execute(m) {
        let { conn, args, isUrl } = data
        let url = args[0]
        if (!url) return m.reply(`contoh: ${userbot.prefix}tiktok https://www.tiktok.com/@someperson/video/700564653xxx`, false, {detectLinks: false})
        if (!isUrl(args[0])) return m.reply('invalid url')
        try {
            m.reply('Processing...')
            let ttdata = await tiktokmusic(url)
            
            let teks = `*ＴＩＫＴＯＫ*\n*Nickname :* ${ttdata.meta.author.nickname} (@${ttdata.meta.author.uniqueId})\n*Desc :* ${ttdata.meta.desc}\n*Duration :* ${ttdata.meta.video.duration}`
            conn.send2ButtonImg(m.chat, teks.trim(), await Ft.getBuffer(ttdata.meta.video.cover), userbot.packname, "AUDIO","tmusic "+url, "VIDEO", "tnowm "+url, {contextInfo:{"mentionedJid": conn.parseMention(teks)}})
        } catch (e) {
            m.reply(Ft.util.format(e))
        }
    }
}
