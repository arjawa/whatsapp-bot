const fs = require('fs')

module.exports = {
    name: 'afk',
    
    async functions (m) {
        try {
            const afk = JSON.parse(fs.readFileSync('./db/afk.json'))
            const sender = m.sender.split("@")[0]
            
            const mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
            for (let x of mentionUser) {
                if (afk.hasOwnProperty(x.split('@')[0])) {
                    alasan = "maaf orang yang anda tag/reply sedang afk"
                    if (afk[x.split('@')[0]] != "") {
                        alasan += " dengan alasan " + afk[x.split('@')[0]]
                    }
                    m.reply(alasan)
                }
            }
            if (afk.hasOwnProperty(sender.split('@')[0])) {
                m.reply("anda sekarang telah keluar dari mode afk")
                delete afk[sender.split('@')[0]]
                fs.writeFileSync("./db/afk.json", JSON.stringify(afk))
            }
        } catch (e) {
            console.log('Error : %s', e)
        }
    }
}