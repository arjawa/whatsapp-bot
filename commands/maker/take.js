const { createSticker, createMetadata, addMetadata } = require("../../lib/sticker");


module.exports = {
    name: ["take"],
    type: ["maker"],
    description: "mengubah metadata sticker",
    utilisation: userbot.prefix + "take <reply>",
    
    async execute(m) {
        let { conn, text } = data;
        if (!m.quoted) return m.reply("reply sticker yang mau di ambil")
        if (!text) return m.reply(`contoh: ${userbot.prefix}take mypackname|myname`);
        let packname = text.split("|")[0];
        let author = text.split("|")[1];
        m.reply("Processing...")
        try {
            let buffer = await m.quoted.download();
            let sticker_path = "./.tmp/sticker.webp";
            let result_path = "./.tmp/result.webp";
            Ft.fs.writeFileSync(sticker_path, buffer)
            let metadata = await createMetadata(packname, author);
            let sticker = await createSticker(sticker_path, result_path);
            let result = await addMetadata(sticker, metadata);
            
            conn.sendFile(m.chat, await Ft.fs.readFileSync(result), null, null, m);
            Ft.fs.unlinkSync(sticker_path)
            Ft.fs.unlinkSync(metadata)
            Ft.fs.unlinkSync(result)
        } catch (e) {
            console.log(e)
        }
    }
}