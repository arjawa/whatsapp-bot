module.exports = {
    name: ["promote"],
    type: ['group'],
    description: "menjadikan member sebagai admin",
    group: true,
    admin: true,
    botAdmin:true,
    utilisation: global.userbot.prefix + "promote <tag/reply_pesan>",
    
    async execute(m) {
        let { conn } = data
        if (m.quoted && m.quoted.sender) {
            per = await conn.groupMakeAdmin(m.chat, [m.quoted.sender])
            teks = `@${m.quoted.sender.split('@')[0]} sekarang adalah admin`
            conn.sendMessage(m.chat, teks, mediaType.text, {quoted:m, contextInfo:{mentionedJid:[m.quoted.sender]}})
        } else {
            if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) return m.reply('tag/reply target yang ingin di jadikan admin!')
            ment = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
            per = await conn.groupMakeAdmin(m.chat, [ment])
            teks = `@${ment.split('@')[0]} sekarang adalah admin`
            conn.sendMessage(m.chat, teks, mediaType.text, {quoted:m, contextInfo:{mentionedJid:[ment]}})
        }
    }
}
