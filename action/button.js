const { MessageType }= require('@adiwajshing/baileys')
const fs = Ft.fs
const { ytmp3, ytmp4 } = require("../lib/wapi")
const { yta, servers } = require("../lib/y2mate")
const { tiktok, tiktokmusic } = require("../lib/scrape")
const Menu = require('../commands/default/menu')

module.exports = {
    async execute(m, {button}) {
        try {
            switch (button.split(" ")[0].toLowerCase()) {
                case "creator":
                    {
                        this.sendContact(m.chat, conn.user.jid, "_htrash", m)
                    }
                    break
                
                case "ghfollow":
                   m.reply(button.split(' ')[1], false, { detectLinks: true })
                   break
                    
                case "tnowm":
                   m.reply('Mendownload video...')
                   download = await tiktok(button.split(" ")[1])
                   conn.sendMessage(m.chat, await (await Ft.fetch(download.result.nowm)).buffer(),"videoMessage",{quoted:m})
                   break
                   
                case "tmusic":
                   m.reply('Mendownload audio...')
                   let p = await tiktokmusic(button.split(" ")[1])
                   conn.sendFile(m.chat, p.meta.music.playUrl, null, null, m)
                   break
                   
                case "audio":
                    try {
                        let yt = false
                        let usedServer = servers[0]
                        for (let i in servers) {
                            let server = servers[i]
                            try {
                                yt = await yta(button.split(" ")[1], server)
                                usedServer = server
                                break
                            } catch (e) {
                                m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nmencoba server lain...'}`)
                            }
                        }
                        if (yt === false) throw 'Semua server gagal!'
                        conn.sendFile(m.chat,yt.dl_link,"m.mp3",null,m)
                    } catch (e) {
                        throw e
                    }
                    break
                    
                case "video":
                    m.reply('Mendownload video...')
                    try {
                        video = await ytmp4(button.split(" ")[1])
                        conn.sendVideo(m.chat, video.dl_link, null, m)
                    } catch (e) {
                        m.reply(`Download gagal!`)
                    }
                    break
                    
                case 'menu':
                    Menu.execute(m)
                    break
                
                case 'help':
                    m.reply(userbot.prefix + button)
                    break
                    
            }
        } catch (e) {
            console.log(e)
        }
    }
}
