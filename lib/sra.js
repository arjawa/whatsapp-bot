const axios = require('axios')

async function lyrics(title) {
    return new Promise (async (resolve, reject) => {
        await axios.request({
            url: 'https://some-random-api.ml/lyrics?title=' + title,
            method: "GET"
        }).then(response => {
            resolve(response.data)
        }).catch(reject)
    })
}

module.exports = {
    lyrics
}