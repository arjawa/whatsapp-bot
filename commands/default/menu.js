const speed = global.Ft['speed'],
      os = global.Ft['os'],
      fs = global.Ft['fs'],
      moment = require('moment-timezone')

const tags = {
    default: "default",
    owner: "owner"
}

const fetch = require("node-fetch")

module.exports = {
    name: ["menu"],
    type: ["default"],
    description: "menampilkan command",
    useLimit: true,
    utilisation: userbot.prefix + "menu",
    
    async execute(m) {
        let name = conn.getName(m.sender)
        let groups = conn.chats.array.filter(v => v.jid.endsWith('g.us'))
        let privat = conn.chats.array.filter(v => v.jid.endsWith('s.whatsapp.net'))
        let timestamp = speed()
        totalChat = await conn.chats.all()
        let latensi = speed() - timestamp
        let uptime = process.uptime();
        
        const menu = {
            before: `*-*\nHalo ${name}, ${ucapan()}\n\nGroup Chats : ${groups.length}\nPrivate Chats : ${privat.length}\nTotal Chats : ${totalChat.length}\nSpeed : ${latensi.toFixed(4)} ms\nRuntime : ${count(uptime)}`.trimStart(),
            type: "*#type*\n"
        }
        
        let raw = Object.values(global.Events).map(v => {
            return {
                help: Array.isArray(v.type) ? v.name : [v.name],
                type: Array.isArray(v.type) ? v.type : [v.type],
                custom: "custom" in v
            }
        })
        for (let p of raw)
        if (p && 'type' in p)
        for (let i of p.type)
        if (!(i in tags) && i) tags[i] = i
        let before = menu.before
        let type = menu.type
        text = [
            before,
            ...Object.keys(tags).map(v => {
            return type.replace(/#type/g, tags[v]).toUpperCase() + [
                ...raw.filter(menu => menu.type && menu.type.includes(v) && menu.help).map(menu => {
                return menu.custom ? "*❖*" + menu.help[0] : Array.isArray(menu.help) ? "*❖*" + menu.help.map(v => userbot.prefix + v).join(", ") : "*❖*" + userbot.prefix +menu.help[0]
            })].join("\n")
        })].join("\n\n")
        
        text += `\n\njika tidak tahu cara menggunakan command, ketik ${userbot.prefix}help command. contoh: ${userbot.prefix}help play`
        conn.sendButtonLoc(m.chat, await fs.readFileSync('./src/image/menu.jpg'), text, userbot.packname, `Creator`, `creator`, m)
    }
}

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    res = "Congratulation Morning"
    if (time >= 4) {
        res = "Swlsmat Oagi"
    }
    if (time > 10) {
        res = "Selamat Siang"
    }
    if (time >= 15) {
        res = "Selamat Sore"
    }
    if (time >= 18) {
        res = "Selamat Malam"
    }
    return res
}

function count(seconds){
    if (typeof seconds !== "number") throw "connError: Unexpected Param " + typeof seconds
    let hours = Math.floor(seconds / (60*60));
    let minutes = Math.floor(seconds % (60*60) / 60);
    let second = Math.floor(seconds % 60);
    return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(second)} Detik`
}

function pad(s) {
    return (s < 10 ? '0' : '') + s;
}