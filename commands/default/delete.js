module.exports = {
    name: ['delete'],
    type: ['default'],
    description: 'delete message from bot',
    utilisation: global.userbot.prefix + 'delete',
    
    async execute(m) {
        let { conn } = data
        
        if (!m.quoted) return m.reply('tag pesan bot yang ingin dihapus!')
        let { chat, fromMe, id, isBaileys } = m.quoted
        if (!fromMe) return false
        if (!isBaileys) return m.reply('pesan tersebut bukan dikirim oleh bot!')
        this.deleteMessage(chat, {
            fromMe,
            id,
            remoteJid: chat
        })
    }
}
