const fs = require('fs')
const fetch = require("node-fetch")
const { spawn } = require('child_process')

module.exports = {
    name: ["tahta"],
    type: ["maker"],
    useLimit: true,
    description: "make tahta picture",
    utilisation: userbot.prefix + "tahta",
    
    async execute(m) {
        let { conn, text } = data
        if (!text) return m.reply(`contoh:\n${userbot.prefix}tahta\n\n@_htrash`)
    
        try {
          const splitText = text.replace(/(\S+\s*){1,10}/g, '$&\n')
          const fixHeight = 'HARTA\nTAHTA\n' + splitText.toUpperCase()
          spawn('convert', [
            '-gravity',
            'Center',
            '-size',
            '1300x1300',
            'xc:black',
            '-font',
            './src/font/hartatahta.ttf',
            '-pointsize',
            '200',
            '-tile',
            './src/image/harta.jpg',
            '-annotate',
            '+20+80',
            fixHeight,
            '-wave',
            '10x175',
            '-crop',
            '1280x1280+0+0',
            './src/image/tahta.jpg'
          ])
            .on('error', (e) => m.reply(e))
            .on('exit', () => {
              conn.sendFile(m.chat, './src/image/tahta.jpg', 'harta5.jpg', 'Done\n*@_htrash*', m)
              fs.unlinkSync('./src/image/tahta.jpg')
            })
        } catch (e) {
          console.log(e)
          return m.reply('_*Error!*_')
        }
     }
}
