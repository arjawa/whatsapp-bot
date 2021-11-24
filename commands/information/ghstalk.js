const { ghstalk } = require('../../lib/scrape')

module.exports = {
    name: ['ghstalk'],
    type: ['information'],
    description: 'menampilkan informasi github dari username',
    utilisation: userbot.prefix + 'ghstalk <username>',
    
    async execute(m) {
        let { conn, args } = data
        username = args[0]
        if (!username) return m.reply(`contoh: ${userbot.prefix}ghstalk briexenv`)
        try {
            let gh = await ghstalk(username)
            
            let bio = gh.bio !== null ? `Bio : ${gh.bio}\n` : ''
            let email = gh.email !== null ? `Email : ${gh.email}\n` : ''
            let teks = `*GITHUB*\nName : ${gh.name} (@${gh.login})\n${email + bio}Followers : ${gh.followers}\nFollowing : ${gh.following}\nPublic Repos : ${gh.public_repos}`
            conn.sendButtonImg(m.chat, teks.trim(), gh.avatar_url, userbot.packname, 'FOLLOW', 'ghfollow '+gh.html_url)
        } catch (e) {
            if (e.request) return m.reply('Username tidak ditemukan, silahkan tunggu beberapa saat dan coba lagi')
        }
    }
}