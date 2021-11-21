module.exports = {
    async Command(conn, m) {
        try {
            let usedPrefix
            if (typeof m.text !== 'string') m.text = ''
            const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {} || {}
            const participants = m.isGroup ? groupMetadata.participants : [] || []
            const user = m.isGroup ? participants.find(u => u.jid == m.sender) : {} 
            const bot = m.isGroup ? participants.find(u => u.jid == conn.user.jid) : {} 
            const isBotAdmin = bot.isAdmin || bot.isSuperAdmin || false
            const isAdmin = user.isAdmin || user.isSuperAdmin || false // Is User Admin?
            const isOwner = userbot['owner'].map(v => v + '@s.whatsapp.net').includes(m.sender) || false
            const isUrl = (url) =>  url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
            
            const content = JSON.stringify(m.message)
            const msgType = Object.keys(m.message)[0]
            const isMedia = (msgType === 'imageMessage' || msgType === 'videoMessage')
            const isQuotedImage = msgType === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = msgType === 'extendedTextMessage' && content.includes('videoMessage')
            
            global.dfail = async (type, m, conn) => {
                let errorMessage = {
                    selfmode: global.userbot['setting'].selfmode,
                    group: global.userbot['setting'].group,
                    admin: global.userbot['setting'].admin,
                    botAdmin: global.userbot['setting'].botadmin,
                    user: global.userbot['setting'].jadibot,
                    owner: global.userbot['setting'].owner,
                }[type]
                if (type == 'selfmode') return conn.sendFile(m.chat, await Ft.fs.readFileSync(errorMessage), null, null, m)
                if (errorMessage) return m.reply(errorMessage)
            }
            
            let noPrefix = m.text.replace(global.prefix, '')
            let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
            args = args || []
            let _args = noPrefix.trim().split` `.slice(1)
            let text = _args.join` `
            commands = (command || '').toLowerCase()
            
            global.data = {
                conn,
                args,
                text,
                participants,
                commands,
                isAdmin,
                isMedia,
                isQuotedVideo,
                isQuotedImage,
                isUrl
            }
            
            if (!isPublic && !isOwner && m.text.startsWith(global.prefix)) return dfail("selfmode", m, conn)
            if (!isPublic & !isOwner) return
            const sender = m.sender.split("@")[0]
            const button = (Object.keys(m.message)[0] == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : ''
            if (m.quoted && m.quoted.sender == conn.user.jid && button) {
                console.log('\x1b[1;37m> [' + Ft.color('BTN', 'yellow') + ']', Ft.color(Ft.moment.tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm'), 'cyan'), 'Button response => ' + button)
                await require("./button.js").execute.call(conn, m, {
                    this: conn,
                    text,
                    args,
                    button
                })
            }
            
            for (i in global.Functions) {
                type = global.Functions[i]
                if (typeof type.functions !== "function") continue
                await type.functions.call(conn, m, {
                    this: conn
                })
            }
            
            for (i in Events) {
                cmd = Events[i]
                let custom = cmd.custom
                if (!custom) continue
                if (m.text.startsWith(cmd.name)) {
                    if (cmd.group && !m.isGroup) return dfail("group", m, conn)
                    if (cmd.admin && !isAdmin) return dfail("admin", m, conn)
                    if (cmd.owner && !isOwner) return dfail("owner", m, conn)
                    if (cmd.botAdmin && !isBotAdmin) return dfail("botAdmin", m, conn)
                    await cmd.execute.call(conn, m, data)
                }
            }
                
            for (let Commands in Events) {
                var Command = Events[Commands]
                cmd = Array.isArray(Command.name) ? Command.name.some(cmd => cmd === global.command) : global.command.startsWith(Command.name)
                if (!global.command) continue
                if (!cmd) continue
                if (Command.group && !m.isGroup) return dfail("group", m, conn)
                if (Command.admin && !isAdmin) return dfail("admin", m, conn)
                if (Command.owner && !isOwner) return dfail("owner", m, conn)
                if (Command.botAdmin && !isBotAdmin) return dfail("botAdmin", m, conn)
                await Command.execute.call(conn, m, data)
            }
        } catch (e) {
            console.log(e)
        }
    }
}
