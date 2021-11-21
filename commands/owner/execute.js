const { exec } = require('child_process')

module.exports = {
    name: ["$"],
    description: "menjalankan shell code",
    custom: true,
    owner: true,
    utilisation: "$ <code>",
    type: ["owner"],
    
    execute(m) {
        let message = m.text
        text = message.slice(2)
        exec(text, (err, stdout) => {
            if (err) return m.reply(`${err}`)
            if (stdout) {
                m.reply(stdout)
            }
        })
    }
}