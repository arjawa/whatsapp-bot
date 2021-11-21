const textmaker = require('free-textmaker-alpha')
const styles = require('../db/textpro.json')

global.text_required

function textpro(style, text1, text2) {
	if (styles.hasOwnProperty(style)) {
	    let web_url = styles[style].url
	    let text = text2 === undefined ? text1 : [text1, text2]
	    text_required = styles[style].hasOwnProperty("text_required") ? styles[style].text_required : 1
        if (text1 === undefined || text1 === "") return {"status": "error", "result": "pastikan parameter sudah benar!"}
        if ((text2 === undefined || text2 === "") && text_required === 2) return {"status": "error", "result": "style ini membutuhkan 2 text!"}
        return new Promise(async(resolve, reject) => {
	        textmaker.textpro(web_url, text).then(async(data) => {
	            try {
		            return resolve({
			            "status": 200,
			            "result": data
		            })
	            } catch (e) {
	                return reject({
			            "status": "error",
			            "result": e
		            })
	            }
	        })
        })
	} else {
	    return {"status": "error", "result": "style tidak ditemukan!"}
	}
}

module.exports.textpro = textpro 