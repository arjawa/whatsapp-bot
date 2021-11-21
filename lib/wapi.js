let fetch = require('node-fetch')

function request(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      accept: "*/*",
      'accept-language': "en-US,en;q=0.9",
      'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
}

const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:shorts\/)?(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

async function ytmp4(url) {
    if (!ytIdRegex.test(url)) throw 'Invalid URL'
    let ytId = ytIdRegex.exec(url)
    url = 'https://youtu.be/' + ytId[1]
    let response = await request(`https://kebakaran.herokuapp.com/api/ytmp4?url=${url}&res=360p`)
    let json = await response.json()
    let result = json.result
    
    return {
        dl_link: result.download_url,
        thumb: result.thumbnail,
        title: result.title,
        filesize: result.size,
        raw_filesize: Math.floor(result.raw_size / 1024)
    }
}

async function ytmp3(url) {
    if (!ytIdRegex.test(url)) throw 'Invalid URL'
    let ytId = ytIdRegex.exec(url)
    url = 'https://youtu.be/' + ytId[1]
    let response = await request(`https://kebakaran.herokuapp.com/api/ytmp3?url=${url}`)
    let json = await response.json()
    let result = json.result
    
    return {
        dl_link: result.download_url,
        thumb: result.thumbnail,
        title: result.title,
        filesize: result.size,
        raw_filesize: Math.floor(result.raw_size / 1024)
    }
}

async function ytsearch(query) {
    let response = await request(`https://kebakaran.herokuapp.com/api/search?q=${query}`)
    let json = await response.json()
    let result = json.result
    
    return {
        url: result.url,
        thumb: result.thumbnail,
        title: result.title,
        audio_url: result.audio_url,
        audio_size: result.audio_size,
        audio_raw_size: Math.floor(result.audio_raw_size / 1024),
        video_url: result.video_url,
        video_size: result.video_size,
        video_raw_size: Math.floor(result.video_raw_size / 1024)
    }
}

async function textmaker(style, text1, text2) {
    query = text2 == null ? `${style}?text1=${text1}` : `${style}?text1=${text1}&text2=${text2}`
    let response = await request("https://wibu.herokuapp.com/textmaker/" + query)
    let result = await response.json()
    
    return result
}

module.exports = {
    ytmp3,
    ytmp4,
    ytsearch,
    textmaker
}