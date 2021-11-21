const speed = global.Ft['speed']
const os = global.Ft['os']
const fs = global.Ft['fs']

module.exports = {
    name: ['stats'],
    type: ['default'],
    description: 'melihat kecepatan respon bot',
    utilisation: global.userbot.prefix+ 'stats',
    execute: async(m) => {
        let { conn } = data
        let ram2 = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB`
        stats = `*ＤＥＶＩＣＥ ＳＴＡＴＵＳ*\nRam Usage : ${ram2}\nOs Type : ${os.type()}\nPlatform : ${os.platform()}\nHostname : ${os.hostname()}\nUptime : ${count(os.uptime())}\nWa Version : ${conn.user.phone.wa_version}\nOs Version : ${conn.user.phone.os_version}\nDevice Model : ${conn.user.phone.device_model}`
        conn.sendButtonLoc(m.chat, await fs.readFileSync('./src/image/stats.jpg'), stats, userbot.packname, 'Menu', 'menu', m)
    }
}

function count(seconds){
    if (typeof seconds !== 'number') throw 'connError: Unexpected Param ' + typeof seconds
    let hours = Math.floor(seconds / (60*60));
    let minutes = Math.floor(seconds % (60*60) / 60);
    let second = Math.floor(seconds % 60);
    return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(second)} Detik`
}

function pad(s) {
    return (s < 10 ? '0' : '') + s;
}