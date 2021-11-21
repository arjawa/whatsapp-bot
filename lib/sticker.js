const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const { exec } = require("child_process")

const createMetadata = (packname, author) => {
    return new Promise((resolve,reject)=>{
      	let regex = /[^a-zA-Z0-9_@./#&+-\s]/g
      	author = author.replace(regex, '');	
      	packname = packname.replace(regex, '');	
      	let filepath = `./.tmp/data.exif`
      	const json = {	
        	'sticker-pack-name': packname,
        	'sticker-pack-publisher': author
      	}
      	const f = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
      	const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	
      
      	let len = JSON.stringify(json).length	
      	let last
    
      	if (len > 256) {	
      		  len = len - 256	
      		  bytes.unshift(0x01)	
      	} else {	
      		  bytes.unshift(0x00)	
      	}	
      
      	if (len < 16) {	
      		  last = len.toString(16)	
      		  last = "0" + len	
      	} else {	
      		  last = len.toString(16)	
      	}	
      
      	const buf2 = Buffer.from(last, "hex")	
      	const buf3 = Buffer.from(bytes)	
      	const buf4 = Buffer.from(JSON.stringify(json))	
    
    	  const buffer = Buffer.concat([f, buf2, buf3, buf4])	
    
    	  fs.writeFile(filepath, buffer, (err) => {	
    		    resolve(filepath)
    	  })

    })
    on('error',(err)=>{
        return reject(new Error(err))
    })
}

const addMetadata = (webp, metadata) => {
    return new Promise((resolve,reject)=>{
        exec(`webpmux -set exif ${metadata} ${webp} -o ${webp}`, async (error) => {
    		if (error) {
                return "Error : can not create sticker"
    		}
            resolve(webp)
        })
    })
    on('error',(err)=>{
        return reject(new Error(err))
    })
}

const createSticker = (media, webp) => {
    return new Promise((resolve,reject)=>{
        ffmpeg(media)
        .input(media)
        .on('error', function(err) {
            console.log(`Error : ${err}`)
            return 'Error : can not create sticker'
        })
        .on('end', function() {
            resolve(webp)
        })
        .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
        .toFormat('webp')
        .save(webp)
    })
    on('error',(err)=>{
        return reject(new Error(err))
    })
}

module.exports = { createSticker, createMetadata, addMetadata }