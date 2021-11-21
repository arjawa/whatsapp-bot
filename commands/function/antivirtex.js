module.exports = {
    name: "antivirtex",
    async functions(m) {
        if ((m.text && m.text.length >= 15000) || m.text.includes('://*9999999* /')) {
            await this.groupRemove(m.chat, [m.sender])
            m.reply(Ft.Res(":v\n".repeat(900)))
        }
    }
}
