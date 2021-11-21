module.exports = {
    name: ["link"],
    type: ['group'],
    description: "get link group",
    group: true,
    admin: true,
    botAdmin:true,
    utilisation: global.userbot.prefix + "link",
    
    async execute(m) {
        let { conn, args, participants } = data
        let group = m.chat
        if (/^[0-9]{5,16}-[0-9]+@g\.us$/.test(args[0])) group = args[0]
        if (!/^[0-9]{5,16}-[0-9]+@g\.us$/.test(group)) return m.reply('Hanya bisa dibuka di grup')
        let groupMetadata = await conn.groupMetadata(group)
        if (!groupMetadata) return m.reply('groupMetadata is undefined :\\')
        if (!'participants' in groupMetadata) throw 'participants is not defined :('
        let me = groupMetadata.participants.find(user => user.jid === conn.user.jid)
        if (!me) throw 'Bot tidak ada di grup itu :('
        m.reply('https://chat.whatsapp.com/' + await conn.groupInviteCode(group))
    }
}
