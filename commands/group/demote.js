module.exports = {
    name: ["demote"],
    type: ['group'],
    group: true,
    admin: true,
    botAdmin: true,
    description: "menjadikan admin sebagai member",
    utilisation: global.userbot.prefix + "demote <tag/reply_pesan>",
    
    async execute(m) {
        let { conn } = data
        if (m.quoted && m.quoted.sender === conn.user.jid) return m.reply('tidak dapat mengunadmin diri sendiri')
        if (m.quoted && m.quoted.sender) {
            per = await conn.groupDemoteAdmin(m.chat, [m.quoted.sender])
            teks = `@${m.quoted.sender.split('@')[0]} telah di unadmin`
            conn.sendMessage(m.chat, teks, mediaType.text, {quoted:m, contextInfo:{mentionedJid:[m.quoted.sender]}})
        } else {
            if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) return m.reply('tag/reply member yang ingin di unadmin!')
            ment = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
            if (ment === conn.user.jid) return m.reply('tidak dapat mengunadmin diri sendiri')
            per = await conn.groupDemoteAdmin(m.chat, [ment])
            teks = `@${ment.split('@')[0]} telah di unadmin`
            conn.sendMessage(m.chat, teks, mediaType.text, {quoted:m, contextInfo:{mentionedJid:[ment]}})
        }
    }
}
