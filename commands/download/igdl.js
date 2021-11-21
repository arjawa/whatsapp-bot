const { igvideo, igfoto } = require("../../lib/scrape")

module.exports = {
    name: ['ig'],
    type: ['download'],
    description: "download image from ig or video",
    utilisation: userbot.prefix + 'ig <foto/video> <link>',
    
    async execute(m) {
        try {
            let { args, conn, isUrl } = data
            if (!args[1]) return m.reply(`contoh: ${userbot.prefix}ig foto https://www.instagram.com/p/CWPo24xxx/?utm_medium=copy_link`, false, { detectLinks: false })
            if (!isUrl(args[1])) return m.reply('url tidak valid')
            if (args[0] === 'foto' && args[1]) {
                m.reply('Mendownload foto...')
                await igfoto(args[1]).then(res => {
                    conn.sendFile(m.chat, res.link, null, null, m)
                })
            }
            if (args[0] === 'video' && args[1]) {
                m.reply('Mendownload video...')
                await igvideo(args[1]).then(res => {
                    conn.sendFile(m.chat, res.link, null, null, m)
                })
            }
        } catch (e) {
            console.log(e)
            m.reply('Download gagal!')
        }
    }
}
