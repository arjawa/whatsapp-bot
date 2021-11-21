const { lyrics } = require('../../lib/sra')

module.exports = {
    name: ['lyrics'],
    type: ['misc'],
    description: 'mencari lirik lagu',
    utilisation: userbot.prefix + 'lyrics <judul_lagu>',
    
    async execute(m) {
        let { text, args } = data
        
        if (!args[0]) return m.reply(`contoh: ${userbot.prefix}lyrics double take`)
        try {
            let resp = await lyrics(text)
            m.reply(`Title : ${resp.title}\nAuthor : ${resp.author}\n\n${resp.lyrics}`)
            console.log(resp)
        } catch (e) {
            console.log(e)
        }
    }
}