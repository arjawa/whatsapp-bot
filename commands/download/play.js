const { ytsearch } = require('../../lib/wapi')
const fetch = require('node-fetch')

module.exports = {
    name: ['play'],
    type: ['download'],
    useLimit: true,
    description: 'download audio dari youtube dengan text',
    utilisation: userbot.prefi + 'play <judul_lagu>',
    
    async execute(m) {
        let { conn, text } = data
        try {
            if (!text) return m.reply(`contoh: ${userbot.prefix}play eminem venom`)
            m.reply('Processing...')
            let { url, thumb, title, video_url, video_size, video_raw_size, audio_url, audio_size, audio_raw_size } = await ytsearch(text)
            let teks = `*ＰＬＡＹ*\n*Title :* ${title}\n*Size Audio :* ${audio_size}\n*Size Video :* ${video_size}`
            conn.send2ButtonLoc(m.chat, await (await fetch(thumb)).buffer(), teks.trim(), userbot.packname , 'AUDIO', `audio ${url}`, 'VIDEO', `video ${url}`)
        } catch (e) {
            console.log(e)
        }
    }
}