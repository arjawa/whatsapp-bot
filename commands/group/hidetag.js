let { MessageType, mentionedJid } = require("@adiwajshing/baileys")

module.exports = {
    name: ["hidetag"],
    type: ['group'],
    description: "tag semua anggota group (hidden)",
    group: true,
    admin: true,
    utilisation: global.userbot.prefix + "hidetag",
    
    async execute(m) {
        let { conn, text } = data
        if (!text) return m.reply(`contoh: ${userbot.prefix}hidetag hehe:v`)
        conn.fetchGroupMetadataFromWA(m.chat).then(({ participants }) => {
            let members = []
        	for (let i of participants){
        	    members.push(i.jid)
            }
            conn.sendMessage(m.chat, text, MessageType.text, { quoted: m, contextInfo: {"mentionedJid": members}})
        })
    }
}
