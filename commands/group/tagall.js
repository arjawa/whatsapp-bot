module.exports = {
    name: ["tagall"],
    type: ["group"],
    description: "tag semua anggota group",
    group: true,
    admin: true,
    utilisation: userbot.prefix + "tagall",
    
    async execute(m) {
        let { conn, args } = data
        
        info = (args.length >= 1) ? `Info: ${args.join(' ')}\n\n` : ''
        conn.fetchGroupMetadataFromWA(m.chat).then(({ participants }) => {
            let text = ''
            for (i of participants){
                text += `@${i.jid.split("@")[0]}\n`
            }
            m.reply(info + text)
        })
    }
}
