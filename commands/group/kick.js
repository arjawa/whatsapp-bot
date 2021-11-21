module.exports = {
    name: ["kick"],
    type: ['group'],
    group: true,
    admin: true,
    botAdmin:true,
    description: "mengeluarkan member dari grup",
    utilisation: global.userbot.prefix + "kick <tag/reply_pesan>",
    
    async execute(m) {
        let { conn } = data
        if (m.quoted && m.quoted.sender === conn.user.jid) return m.reply('tidak dapat mengeluarkan diri sendiri')
        if (m.quoted && m.quoted.sender) {
            per = await conn.groupRemove(m.chat, [m.quoted.sender])
            teks = `@${m.quoted.sender.split('@')[0]} telah dikeluarkan`
            conn.sendMessage(m.chat, teks, mediaType.text, {quoted:m, contextInfo:{mentionedJid:[m.quoted.sender]}})
        } else {
            if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) return m.reply('tag/reply member yang ingin dikeluarkan!')
            ment = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
            if (ment === conn.user.jid) return m.reply('tidak dapat mengeluarkan diri sendiri')
            per = await conn.groupRemove(m.chat, [ment])
            teks = `@${ment.split('@')[0]} telah dikeluarkan`
            conn.sendMessage(m.chat, teks, mediaType.text, {quoted:m, contextInfo:{mentionedJid:[ment]}})
        }
    }
}
