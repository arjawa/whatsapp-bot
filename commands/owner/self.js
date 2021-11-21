module.exports = {
    name: ['self'],
    description: 'self mode',
    utilisation: userbot.prefix + 'self <on/off>',
    type: ['owner'],
    owner: true,
    
    execute(m) {
        let { args } = data
        if (!args[0]) return m.reply(`contoh: ${userbot.prefix}self on`)
        if (args[0] == 'on') {
            if (isPublic == false) return m.reply('Bot sudah dalam mode private')
            isPublic = false
            m.reply('Self mode activated')
        } else if (args[0] == 'off') {
            if (isPublic == true) return m.reply('Bot tidak dalam mode private')
            isPublic = true
            m.reply('Self mode deactivated')
        }
    }
}