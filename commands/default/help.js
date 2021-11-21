const { readdirSync } = require('fs')
module.exports = {
    name: ['help'],
    type: ['default'],
    description: 'mengetahui deskripsi commands lain',
    utilisation: userbot.prefix +'help <command_name>',
 
    execute(m) {
    	let { args } = data
        try {
            if (!args[0]) return m.reply(`contoh: ${userbot.prefix}help ytmp3`)
            if (['sticker', 's'].includes(args[0])) args[0] = 'sticker,s'
            let { description, utilisation } = global.Events[args[0]]
            m.reply(`Description: ${description}\nUse: ${utilisation}`)
        } catch {
            m.reply(`tidak ada command ("${args[0]}")!`)   
        }
    }
}