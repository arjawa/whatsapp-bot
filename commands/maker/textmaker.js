const { textpro } = require('../../lib/textmaker')
const styles = require('../../db/styles.json')


module.exports = {
    name: ['textmaker'],
    type: ['maker'],
    description: 'membuat text art dari template',
    utilisation: userbot.prefix + 'textmaker <style> <text>',
    
    async execute(m) {
        let { args, text } = data
        
        if (args[0] == 'list') {
            let teks = []
            Object.keys(styles).forEach(function(key) {
                teks.push("\n\n*" + key.toUpperCase() + "*")
                for (i in styles[key]) {
                    teks.push("\n*❖* " + styles[key][i])
                }
            })
            
            return conn.sendButtonLoc(m.chat, await Ft.fs.readFileSync('./src/image/textmaker.jpg'), `*ＴＥＸＴ ＭＡＫＥＲ*` + teks.join('') + `\n\nNote: khusus menu *DOUBLE TEXT* membutuhkan 2 text dan tanda "|" sebagai pemisah.\ncontoh: ${userbot.prefix}textmaker marvel briex|env`, userbot.packname, 'Help', 'help textmaker', m)
        } else if (!args[0] || !args[1]) {
            return m.reply(`contoh: ${userbot.prefix}textmaker neondevil briexenv\nketik *${userbot.prefix}textmaker list* untuk melihat daftar text`)
        }
        let style = args[0]
        args.shift()
        let text_param = args.join(" ").split("|")
        
        m.reply('Processing...')
        try {
            if (!text_param[1] || text_param[1] == "") {
                var req = await textpro(style, text_param[0])
            } else {
                var req = await textpro(style, text_param[0], text_param[1])
            }
            req.status == 200 ? conn.sendFile(m.chat, await Ft.getBuffer(req.result), null, null, m) : m.reply(req.result)
        } catch (e) {
            console.log(e)
            m.reply("Gagal mengirim gambar!")
        }
    }
}