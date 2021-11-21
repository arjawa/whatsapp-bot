const fs = require('fs')

module.exports = {
    name: ["afk"],
    type: ["misc"],
    description: "afk",
    utilisation: userbot.prefix + "afk <alasan>",
    
    async execute(m) {
        const afk = JSON.parse(fs.readFileSync('./db/afk.json'))
        let { conn, text } = data
        
        afk[m.sender.split('@')[0]] = text.toLowerCase()
        fs.writeFileSync("./db/afk.json", JSON.stringify(afk))
        alasan = this.getName(m.sender) + " sekarang berada di mode afk"
        if (text != "") {
            alasan += " dengan alasan " + text
        }
        m.reply(alasan, false, {quoted: false})
    }
}