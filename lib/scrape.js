const { JSDOM } = require('jsdom')
const { fromBuffer } = require('file-type')
const fetch = require('node-fetch')
const fs = require('fs')
const qs = require('qs')
const cheerio = require('cheerio')
const formData = require('form-data')
const yts = require( 'yt-search')
const request = require('request')
const { spawn } = require('child_process')
const path = require('path')
const axios = require('axios')
const src = path.join(__dirname, './data/src/')
const _font = path.join(src, 'font')
let tmp = path.join(__dirname, './')
const aesthetic = path.join(src, 'canvas/')
//Variable
const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
//Post
function post(url, formdata) {
    console.log(Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&'))
    return fetch(url, {
        method: 'POST',
        headers: {
            accept: "*/*",
            'accept-language': "en-US,en;q=0.9",
            'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&')
    })
}
//Tiktok Video
async function tiktok(Url) {
    return new Promise (async (resolve, reject) => {
        await axios.request({
            url: "https://ttdownloader.com/",
            method: "GET",
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9,id;q=0.8",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
                "cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=i14curq5t8omcljj1hlle52762; popCookie=1; _gid=GA1.2.1936694796.1623913934"
            }
        }).then(respon => {
            var $ =cheerio.load(respon.data)
            token = $('#token').attr('value')
            axios({
                url: "https://ttdownloader.com/req/",
                method: "POST",
                data: new URLSearchParams(Object.entries({url: Url, format: "", token: token})),
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9,id;q=0.8",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
                    "cookie": "_ga=GA1.2.1240046717.1620835673; PHPSESSID=i14curq5t8omcljj1hlle52762; popCookie=1; _gid=GA1.2.1936694796.1623913934"
                }
            }).then(res => {
                ch = cheerio.load(res.data)
                result = {
                    status: res.status,
                    result: {
                        nowm: ch('#results-list > div:nth-child(2)').find('div.download > a').attr('href'),
                        wm: ch('#results-list > div:nth-child(3)').find('div.download > a').attr('href'),
                    }
                }
                resolve(result)
                //console.log(result)
            }).catch(reject)
        }).catch(reject)
    })
}

//Tiktok Music
const UserAgent = () => {
    ossss = [
        'Macintosh; Intel Mac OS X 10_15_7',
        'Macintosh; Intel Mac OS X 10_15_5',
        'Macintosh; Intel Mac OS X 10_11_6',
        'Macintosh; Intel Mac OS X 10_11_5',
        'Windows NT 10.0; Win64; x64',
        'Windows NT 10.0',
    ]
    return `Mozilla/5.0 (${ossss[Math.floor(Math.random() * ossss.length)]}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(Math.random() * 3,) + 87}.0.${Math.floor(Math.random() * 190) + 4100}.${Math.floor(Math.random() * 50) + 140} Safari/537.36`;
}

async function tiktokmusic(URL) {
    return new Promise(async (resolve, reject) => {
        GDF = await axios.get('https://www.tiktok.com/')
        Cookie = "ttwid=1%7C5UyITGuqEDXVZHtmtbU-7V35lTk8--iB6IjJuxRKPTs%7C1625390616%7C62c0b171e938115d5940a9af40c377000bc616cc7b25dfd76557913951585606; Domain=.tiktok.com; Path=/; Expires=Mon, 04 Jul 2022 09:23:36 GMT; HttpOnlytt_webid_v2=6980999485653632513; path=/; expires=Mon, 04 Jul 2022 09:23:37 GMT; domain=.tiktok.com; samesite=none; secure; httponlytt_webid=6980999485653632513; path=/; expires=Mon, 04 Jul 2022 09:23:37 GMT; domain=.tiktok.com; samesite=none; secure; httponlytt_csrf_token=9u_ml89_dULuOD6oMp_zTH06; path=/; domain=.tiktok.com; samesite=lax; secure; httponly"
        axios.get(URL, {
            headers: {
                'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
                'Cookie': Cookie
            }
        })
        .then(({ data }) => {
            var $ =cheerio.load(data)
            ttdata = JSON.parse($('script#__NEXT_DATA__').get()[0].children[0].data)
            meta = ttdata.props.pageProps.itemInfo.itemStruct
            //console.log(meta)
            resolve({meta})
        })
    })
}

//Github Stalk
async function ghstalk(username) {
    return new Promise(async (resolve, reject) => {
        url= `https://api.github.com/users/${username}`
        return axios.get(url, {
            method: 'GET',
            headers: {
            "content-type": "application/x-www-form-urlencoded",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "cookie": "_ga=GA1.2.1310699039.1624884412; _pbjs_userid_consent_data=3524755945110770; cto_bidid=rQH5Tl9NNm5IWFZsem00SVVuZGpEd21sWnp0WmhUeTZpRXdkWlRUOSUyQkYlMkJQQnJRSHVPZ3Fhb1R2UUFiTWJuVGlhVkN1TGM2anhDT1M1Qk0ydHlBb21LJTJGNkdCOWtZalRtZFlxJTJGa3FVTG1TaHlzdDRvJTNE; cto_bundle=g1Ka319NaThuSmh6UklyWm5vV2pkb3NYaUZMeWlHVUtDbVBmeldhNm5qVGVwWnJzSUElMkJXVDdORmU5VElvV2pXUTJhQ3owVWI5enE1WjJ4ZHR5NDZqd1hCZnVHVGZmOEd0eURzcSUyQkNDcHZsR0xJcTZaRFZEMDkzUk1xSmhYMlY0TTdUY0hpZm9NTk5GYXVxWjBJZTR0dE9rQmZ3JTNEJTNE; _gid=GA1.2.908874955.1625126838; __gads=ID=5be9d413ff899546-22e04a9e18ca0046:T=1625126836:RT=1625126836:S=ALNI_Ma0axY94aSdwMIg95hxZVZ-JGNT2w; cookieconsent_status=dismiss"
	    }})
        .then(data => {
            resolve(data.data)
        }).catch(reject)
    })//.catch(reject)
}

//Telegraph
async function telegra(buffer) {
    return new Promise(async (resolve, reject) => {
        const { ext } = await fromBuffer(buffer)
        let form = new FormData
        form.append('file', buffer, 'tmp.' + ext)
        let res = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: form
        })
        let img = await res.json()
        if (img.error) throw img.error
        hasil = 'https://telegra.ph' + img[0].src
        resolve({hasil})
        console.log(hasil)
    }).catch(reject)
}

//Youtube Audio
function yta(url) {
    return new Promise((resolve, reject) => {
        if (ytIdRegex.test(url)) {
            let ytId = ytIdRegex.exec(url)
            url = 'https://youtu.be/' + ytId[1]
            post('https://www.y2mate.com/mates/en60/analyze/ajax', { url, q_auto: 0, ajax: 1 })
            .then(res => res.json())
            .then(res => {
                let document = (new JSDOM(res.result)).window.document
                let type = document.querySelectorAll('td')
                let filesize = type[type.length - 10].innerHTML
                let id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
                let thumb = document.querySelector('img').src
                let title = document.querySelector('b').innerHTML
                
                post('https://www.y2mate.com/mates/en60/convert', {
                type: 'youtube',
                _id: id[1],
                v_id: ytId[1],
                ajax: '1',
                token: '',
                ftype: 'mp3',
                fquality: 128
                })
                .then(res => res.json())
                .then(res => {
                    let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
                    hasil = []
                    title = title
                    audio =/<a.+?href="(.+?)"/.exec(res.result)[1],
                    thumb = thumb
                    filesize = filesize
                    hasil.push({audio,thumb,title,filesize})
                    resolve(hasil)
                    console.log(hasil)
                }).catch(reject)
            }).catch(reject)
        } else reject('URL UNVAILD !!')
    })
}

//Youtube Video
function ytv(url) {
    return new Promise((resolve, reject) => {
        if (ytIdRegex.test(url)) {
            let ytId = ytIdRegex.exec(url)
            url = 'https://youtu.be/' + ytId[1]
            post('https://www.y2mate.com/mates/en60/analyze/ajax', {
                url,
                q_auto: 0,
                ajax: 1
            })
            .then(res => res.json())
            .then(res => {
                document = (new JSDOM(res.result)).window.document
                yaha = document.querySelectorAll('td')
                filesize = yaha[yaha.length - 23].innerHTML
                id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
                thumb = document.querySelector('img').src
                title = document.querySelector('b').innerHTML
                
                post('https://www.y2mate.com/mates/en60/convert', {
                    type: 'youtube',
                    _id: id[1],
                    v_id: ytId[1],
                    ajax: '1',
                    token: '',
                    ftype: 'mp4',
                    fquality: 360
                })
                .then(res => res.json())
                .then(res => {
                    let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
                    hasil = []
                    video = /<a.+?href="(.+?)"/.exec(res.result)[1],
                    hasil.push({video, thumb, title, filesize})
                    resolve(hasil)
                    console.log(hasil)
                }).catch(reject)
            }).catch(reject)
        } else reject('URL INVALID')
    })
} 

//Emoji 
async function emoji(emoticon) {
    const emojii = encodeURI(`${emoticon}`)
    var link = await axios.get(`https://emojipedia.org/${emojii}/`)
    var $ =cheerio.load(link.data)
    var apple = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(1) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var google = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(2) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var samsung = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(3) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var microsoft = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(4) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var whatsapp = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(5) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var twitter = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(6) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var facebook = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(7) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var jooxpixel = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(8) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var openmoji = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(9) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var emojidex = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(10) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var messager = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(11) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var LG = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(12) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var HTC = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(13) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var mozilla = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(14) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var softbank = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(15) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var docomo = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(16) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    var KDDI = $('body > div.container > div.content').find('article > section.vendor-list > ul > li:nth-child(17) > div.vendor-container.vendor-rollout-target > div.vendor-image > img').attr('src');
    const result = {
        apple: apple.replace('120', '240'),
        google: google.replace('120', '240'),
        samsung: samsung.replace('120', '240'),
        microsoft: microsoft.replace('120', '240'),
        whatsapp: whatsapp.replace('120', '240'),
        twitter: twitter.replace('120', '240'),
        facebook: facebook.replace('120', '240'),
        jooxPixel: jooxpixel.replace('120', '240'),
        openemoji: openmoji.replace('120', '240'),
        emojidex: emojidex.replace('120', '240'),
        messanger: messager.replace('120', '240'),
        LG: LG.replace('120', '240'),
        HTC: HTC.replace('120', '240'),
        mozilla: mozilla.replace('120', '240'),
        softbank: softbank.replace('120', '240'),
        docomo: docomo.replace('120', '240'),
        KDDI: KDDI.replace('120', '240')
    }
    return result
    console.log(result)
}

//cuaca
//Covid
function covid() {
    return new Promise(async(resolve, reject) => {
        axios.get('https://covid19.go.id/')
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const hasil = [];
            $('#case > div > div > div > div > div:nth-child(2)').each(function(a,b) {
                const pindo = $(b).find('div:nth-child(3) > strong').text()
                const mindo = $(b).find('div:nth-child(5) > strong').text()
                const sindo = $(b).find('div:nth-child(4) > strong').text()
                const upindo = $(b).find('div.pt-4.text-color-black.text-1').text().trim()
                $('#case > div > div > div > div > div:nth-child(1)').each(function(c,d) {
                    const neg = $(d).find('div:nth-child(3) > strong').text() 
                    const pglo = $(d).find('div:nth-child(4) > strong').text()
                    const nglo = $(d).find('div:nth-child(5) > strong').text()
                    const up = $(d).find('div.pt-4.text-color-grey.text-1').text().trim()
                    const result = {
                        indonesia : {
                            kasus: pindo,
                            kematian: mindo,
                            sembuh: sindo,
                            update: upindo.split(':')[1]
                        },
                        global: {
                            negara: neg,
                            kasus: pglo,
                            kematian: nglo,
                            update: up.split(':')[1].split('\n')[0]
                        }
                    }
                    hasil.push(result)
                })
            })
            resolve(hasil)
            console.log(hasil)
        })
        .catch(reject)
    })
}

//mediafire
async function mediafire(url) {
    let query = await axios.get(url) 
    let cher = cheerio.load(query.data)
    let hasil = []
    let link = cher('a#downloadButton').attr('href')
    let size = cher('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace(' ', '')
    let seplit = link.split('/')
    let aurhor = 'Ivanzz'
    let nama = seplit[5]
    let mime = nama.split('.')
    mime = mime[1]
    hasil.push({ author, nama, mime, size, link })
    return hasil
    console.log(hasil)
}

//Function Tahta
function noise(_var, depth = 4, s = 1024, freq) {
    let forms = []
    for (let i = 0; i < depth; i++) forms.push(
        formula(
            _var,
            freq * rand(40, 80) * (s / 2048)/ s * ((i + 1) / 5),
            rand(-Math.PI, Math.PI),
            (i + 1) / depth * 8,
            0
        )
    )
    return forms.join('+')
}
function formula(_var, freq, offset, amp, add) {
    return `(${add.toFixed(3)}+${amp.toFixed(4)}*sin(${offset.toFixed(6)}+2*PI*${_var}*${freq.toFixed(6)}))`
}
function textArgs(text, background, color, size, fontfile, x = '200' , y = '200', w = 1024, h = 1024) {
    return `color=${background}:s=${w}x${h},drawtext=text='${text.replace(/[\\]/g, '\\$&')}':fontfile='${fontfile.replace(/[\\]/g, '\\$&')}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}`
}
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function rand(min, max, q = 0.001) {
    return Math.floor((Math.random() * (max - min)) / q) * q
}
// Tahta
function tahta(text = '') {
    return new Promise((resolve, reject) => {
        let img = path.join(aesthetic, pickRandom(fs.readdirSync(aesthetic)))
        let font = path.join(_font, 'Obelix.ttf')
        let w = 1024
        let h = w
        let s = w + 'x' + h
        let xF = `(${noise('X', 2, w, 1)}+${noise('Y', 1, h, 1)})/2+128`
        let yF = `((${pickRandom(['', '-'])}${45 * w / 2048}*${pickRandom(['sin', 'cos'])}(X/${w}*4*PI))+${noise('X', 5, w, 0.8)}+${noise('Y', 2, h, 1)})/1.7+128`
        let fsize = 440 / 2048 * w
        let lh = 1.5
        let format = ''
        let layers = [
             `[v:0]scale=${s}${format}[im]`,
            textArgs('HARTA', 'black', 'white', fsize, font, '(w-text_w)/2', `(h-text_h)/2-(text_h*${lh})`, w, h) + format + '[top]',
            textArgs('TAHTA', 'black', 'white', fsize, font, '(w-text_w)/2', `(h-text_h)/2`, w, h) + format + '[mid]',
            textArgs(text, 'black', 'white', fsize, font, '(w-text_w)/2', `(h-text_h)/2+(text_h*${lh})`, w, h) + format + '[bot]',
             '[top][mid]blend=all_mode=addition[con]',
             '[con][bot]blend=all_mode=addition[txt]',
             `nullsrc=s=${s},geq='r=${xF}:g=${xF}:b=${xF}'[dx]`,
             `nullsrc=s=${s},geq='r=${yF}:g=${yF}:b=${yF}'[dy]`,
             '[txt][dx][dy]displace[wa]',
             '[im][wa]blend=all_mode=multiply:all_opacity=1'
        ]
        
        let o = '_harta_tahta.png'
        o = path.join(tmp, o)
        let args = [
            '-y',
            '-i', img,
            '-filter_complex', layers.join(';'),
            '-frames:v', '1', '_harta_tahta.png'
        ]
        console.log(layers)
        console.log('ffmpeg', ...args)
        spawn('ffmpeg', args)
        .on('error', reject)
        .on('close', () => {
            try {
                resolve(fs.readFileSync('./_harta_tahta.png'))
                fs.unlinkSync(o)
            } catch (e) {
                reject(e)
            }
        })
        //.stderr.on('data', a => console.log(a+''))
    })
}

//Style Text
async function styleText(text) {
    let res = await fetch('http://qaz.wtf/u/convert.cgi?text=' + encodeURIComponent(text))
    let html = await res.text()
    let dom = new JSDOM(html)
    let table = dom.window.document.querySelector('table').children[0].children
    let obj = {}
    for (let tr of table) {
        let name = tr.querySelector('.aname').innerHTML
        let content = tr.children[1].textContent.replace(/^\n/, '').replace(/\n$/, '')
        obj[name + (obj[name] ? ' Reversed' : '')] = content
    }
    return obj
    console.log(obj)
}

//Facebook
function fb(link){
	return new Promise((resolve,reject) => {
	let config = {
	    'url': link
	}
	axios('https://www.getfvid.com/downloader',{
	method: 'POST',
	data: new URLSearchParams(Object.entries(config)),
	headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "cookie": "_ga=GA1.2.1310699039.1624884412; _pbjs_userid_consent_data=3524755945110770; cto_bidid=rQH5Tl9NNm5IWFZsem00SVVuZGpEd21sWnp0WmhUeTZpRXdkWlRUOSUyQkYlMkJQQnJRSHVPZ3Fhb1R2UUFiTWJuVGlhVkN1TGM2anhDT1M1Qk0ydHlBb21LJTJGNkdCOWtZalRtZFlxJTJGa3FVTG1TaHlzdDRvJTNE; cto_bundle=g1Ka319NaThuSmh6UklyWm5vV2pkb3NYaUZMeWlHVUtDbVBmeldhNm5qVGVwWnJzSUElMkJXVDdORmU5VElvV2pXUTJhQ3owVWI5enE1WjJ4ZHR5NDZqd1hCZnVHVGZmOEd0eURzcSUyQkNDcHZsR0xJcTZaRFZEMDkzUk1xSmhYMlY0TTdUY0hpZm9NTk5GYXVxWjBJZTR0dE9rQmZ3JTNEJTNE; _gid=GA1.2.908874955.1625126838; __gads=ID=5be9d413ff899546-22e04a9e18ca0046:T=1625126836:RT=1625126836:S=ALNI_Ma0axY94aSdwMIg95hxZVZ-JGNT2w; cookieconsent_status=dismiss"
	}
    })
	.then(async({ data }) => {
        const $ = cheerio.load(data);	
        resolve({
        	video: $('div.col-md-4.btns-download > p:nth-child(1) > a').attr('href'),
        	audio: $('div.col-md-4.btns-download > p:nth-child(3) > a').attr('href')
        })
	})
	.catch(reject)
	})
}

//IgStalk
function igstalk(username){
	return new Promise((resolve,reject) => {
	    axios.get('https://www.instagram.com/'+ username +'/?__a=1',{
            method: 'GET',
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
                "cookie": "mid=XBXl1AALAAEbFoAEfNjZlMMG9dwX; ig_did=91E66A48-5AA2-445D-BFE6-84DC4456DE8F; fbm_124024574287414=base_domain=.instagram.com; ig_nrcb=1; shbid=\"12737\0544008624962\0541656157971:01f72a5102dc07af6845adf923ca70eb86e81ab95fa9dbfdaf157c9eef0e82fd1f10fe23\"; shbts=\"1624621971\0544008624962\0541656157971:01f74841fba8e77a0066b47ea891dec8fba6fdf9216c0816f9fb3532292f769828800ae2\"; fbsr_124024574287414=86D8femzH4_KFW4hd3Z6XFdowU6lG-uXsXRQDNl44VM.eyJ1c2VyX2lkIjoiMTAwMDA0Njc2MDc4Nzg5IiwiY29kZSI6IkFRQngzXzVOejdwVnBwby1LRGRUdEYxUFlzcUdDQXJjcmJfb05HaWFvYkNvOGtLN2paam50bHpvMTNOakFnTzVKOHQ5M0V3U3dvNkRtZ0RiY1l1Z3dQSTIybnExOUxLd3lpZTVfZll0bkNXZXBuM1hoYWFLX0w2R0pZaUpzaDBOTDBhb3pmTVBkRTVQRC12X3FnbUgxLXZYdGVmcHhfaFU0aUZNZVMxNHhFUk5OblJyMmxYTUpDa2RFYTdISXNCR2swdHhaaGF0NUt4UDR3cWZTamRwcVFfQ19sa1RUek5fU0taUTYtMjlzTkdnLUVWb3oxMUZWc3Q2OEx2ZnlIY0V0eFp0ZUxacXpiWmh6MzZrVl83VmFGd0FqVnVkTGFQN2VzT3ZRcmlTQ2pLUE5XbVcyNWhudzIzejJBSnVURW00YWR1cmN6a3ZLWU1icTd2SnN0SVdJV09RIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUJBZmJuQ3haQzZMd3h4MDFJV2MyZ3dsQ3k3Qmp0b05UNUY0WDY2NHBrUzRQeERNVXRsdmhWWkI3SXE0MGsyZ2hJQm55RHRPcW5iVjlPbUNiWGhyTFBaQUhBQjFzVFpBdHF6RFEzVTROUkhOU1V6MFVXWkNtTEdLcDNNWDRoazVIOURLbERHN0QwUlhZNHY4dHBCdVNNYjN4dnBTRGtQcHdYRlBXVU82VCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjI0NjIxOTgxfQ; fbsr_124024574287414=86D8femzH4_KFW4hd3Z6XFdowU6lG-uXsXRQDNl44VM.eyJ1c2VyX2lkIjoiMTAwMDA0Njc2MDc4Nzg5IiwiY29kZSI6IkFRQngzXzVOejdwVnBwby1LRGRUdEYxUFlzcUdDQXJjcmJfb05HaWFvYkNvOGtLN2paam50bHpvMTNOakFnTzVKOHQ5M0V3U3dvNkRtZ0RiY1l1Z3dQSTIybnExOUxLd3lpZTVfZll0bkNXZXBuM1hoYWFLX0w2R0pZaUpzaDBOTDBhb3pmTVBkRTVQRC12X3FnbUgxLXZYdGVmcHhfaFU0aUZNZVMxNHhFUk5OblJyMmxYTUpDa2RFYTdISXNCR2swdHhaaGF0NUt4UDR3cWZTamRwcVFfQ19sa1RUek5fU0taUTYtMjlzTkdnLUVWb3oxMUZWc3Q2OEx2ZnlIY0V0eFp0ZUxacXpiWmh6MzZrVl83VmFGd0FqVnVkTGFQN2VzT3ZRcmlTQ2pLUE5XbVcyNWhudzIzejJBSnVURW00YWR1cmN6a3ZLWU1icTd2SnN0SVdJV09RIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUJBZmJuQ3haQzZMd3h4MDFJV2MyZ3dsQ3k3Qmp0b05UNUY0WDY2NHBrUzRQeERNVXRsdmhWWkI3SXE0MGsyZ2hJQm55RHRPcW5iVjlPbUNiWGhyTFBaQUhBQjFzVFpBdHF6RFEzVTROUkhOU1V6MFVXWkNtTEdLcDNNWDRoazVIOURLbERHN0QwUlhZNHY4dHBCdVNNYjN4dnBTRGtQcHdYRlBXVU82VCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjI0NjIxOTgxfQ; csrftoken=PpiPMEl0R2pAwThsw4NXynO6cVIXHZDo; ds_user_id=38316792800; sessionid=38316792800:rQj5Tr3g5zkg7b:4; rur=\"RVA\05438316792800\0541656158332:01f759cf624bef147397144805bb4c26f6c8b36a232e0f5738c570ee492f6b629f84f6e5\""
        	}
        })
        .then(({ data }) => {
            const user = data.graphql.user
            let result = {
                id: user.id,
                bio: user.biography,
                followers: user.edge_followed_by.count,
                following: user.edge_follow.count,
                fullName: user.full_name,
                highlightCount: user.highlight_reel_count,
                isBusinessAccount: user.is_business_account,
                isRecentUser: user.is_joined_recently,
                accountCategory: user.business_category_name,
                linkedFacebookPage: user.connected_fb_page,
                isPrivate: user.is_private,
                isVerified: user.is_verified,
                profilePicHD: user.profile_pic_url_hd,
                username: user.username,
                postsCount: user.edge_owner_to_timeline_media.count
            }
            resolve(result)
            console.log(result)
        })
	.catch(reject)
	})
}

//TebakGambar
function tebakgambar() {
    return new Promise(async(resolve, reject) => {
        axios.get('https://jawabantebakgambar.net/all-answers/')
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const result = [];
            let random = Math.floor(Math.random() * 2836) + 2;
            let link2 = 'https://jawabantebakgambar.net'
            $(`#images > li:nth-child(${random}) > a`).each(function(a, b) {
            const img = link2 + $(b).find('img').attr('data-src')
            const jwb = $(b).find('img').attr('alt')
            result.push({
            	image: img,
            	jawaban: jwb
            })
            	resolve(result)
            	console.log(result)
            })
    	})
	    .catch(reject)
	})
}

//PlayStore
function playstore(name){
	return new Promise((resolve, reject) => {
        axios.get('https://play.google.com/store/search?q='+ name +'&c=apps')
        .then(({ data }) => {
        	const $ = cheerio.load(data)
        	let ln = [];
        	let nm = [];
        	let dv = [];
        	let lm = [];
        	const result = [];
        	$('div.wXUyZd > a').each(function(a,b){
                const link = 'https://play.google.com' + $(b).attr('href')
                ln.push(link);
        	})
        	$('div.b8cIId.ReQCgd.Q9MA7b > a > div').each(function(d,e){
                const name = $(e).text().trim()
                nm.push(name);
        	})
        	$('div.b8cIId.ReQCgd.KoLSrc > a > div').each(function(f,g){
                const dev = $(g).text().trim();
                dv.push(dev)
        	})
        	$('div.b8cIId.ReQCgd.KoLSrc > a').each(function(h,i){
                const limk = 'https://play.google.com' + $(i).attr('href');
                lm.push(limk);
        	})	
        	for (let i = 0; i < ln.length; i++){
            	result.push({
                    name: nm[i],
                    link: ln[i],
                    developer: dv[i]
            	})
        	}
            resolve(result)
        })
        console.log(result)
	    .catch(reject)
	})
}

//Twitter
function twitter(link){
	return new Promise((resolve, reject) => {
        let config = {
        	'URL': link
        }
        axios.post('https://twdown.net/download.php',qs.stringify(config),{
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
            }
        })
        .then(({ data }) => {
            const $ = cheerio.load(data)
            resolve({
                desc: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
                thumb: $('div:nth-child(1) > img').attr('src'),
                HD: $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href'),
                SD: $('tr:nth-child(2) > td:nth-child(4) > a').attr('href'),
                audio: 'https://twdown.net/' + $('tr:nth-child(4) > td:nth-child(4) > a').attr('href')
        	})
        })
        .catch(reject)
	})
}

//KodePos
async function kodepos(kota) {
    return new Promise(async (resolve, reject) => {
        let postalcode = 'https://carikodepos.com/';
        let url = postalcode+'?s='+kota;
        await request.get({
            headers: {
                'Accept': 'application/json, text/javascript, */*;',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': postalcode,
                'Referer': postalcode
            },
            url: url,
        }, function(error, response, body) {
            if (error) return reject(error);
            let $ = cheerio.load(body);
            var search = $('tr');
            if (!search.length) return reject('No result could be found');
            var results = [];
            search.each(function(i) {
                if (i != 0) {
                    var td = $(this).find('td');
                    var result = {};
                    td.each(function(i) {
                        var value = $(this).find('a').html();
                        var key = (i == 0) ? 'province' : (i == 1) ? 'city' : (i == 2) ? 'subdistrict' : (i == 3) ? 'urban' : 'postalcode';
                        result[key] = value;
                    })
                    results.push(result);
                }
            });
            return resolve(results);
            console.log(results)
        })
    });
};

//Gempa
function gempa() {
    return new Promise((resolve, reject) => {
        axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg').then((response) => {
            const $ = cheerio.load(response.data)
            const urlElems = $('table.table-hover.table-striped')
            for (let i = 0; i < urlElems.length; i++) {
                const urlSpan = $(urlElems[i]).find('tbody')[0]
                if (urlSpan) {
                    const urlData = $(urlSpan).find('tr')[0]
                    var Kapan = $(urlData).find('td')[1]
                    var Letak = $(urlData).find('td')[2]
                    var Magnitudo = $(urlData).find('td')[3]
                    var Kedalaman = $(urlData).find('td')[4]
                    var Wilayah = $(urlData).find('td')[5]
                    var lintang = $(Letak).text().split(' ')[0]
                    var bujur = $(Letak).text().split(' ')[2]
                    var hasil = {
                        Waktu: $(Kapan).text(),
                        Lintang: lintang,
                        Bujur: bujur,
                        Magnitudo: $(Magnitudo).text(),
                        Kedalaman: $(Kedalaman).text().replace(/\t/g, '').replace(/I/g, ''),
                        Wilayah: $(Wilayah).text().replace(/\t/g, '').replace(/I/g, '').replace('-','').replace(/\r/g, '').split('\n')[0],
                        Map: ''
                    }
                    resolve(hasil);
                    console.log(hasil)
                }
            }
        })
    })
}

//HappyMod
function happymod(query) {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.happymod.com/search.html?q=${query}`).then(async tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.pdt-app-box").each(function(c, d) {
                name = $(d).find("a").text().trim();
                icon = $(d).find("img.lazy").attr('data-original');
                link = $(d).find("a").attr('href');
                link2 = `https://www.happymod.com${link}`
                const Data = {
                    icon: icon,
                    name: name,
                    link: link2
                }
                hasil.push(Data)
            })
            resolve(hasil);
        }).catch(reject)
    });
}

//Hoax
function hoax() {
    return new Promise((resolve, reject) => {
        axios.get(`https://turnbackhoax.id/`).then( tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("figure.mh-loop-thumb").each(function(a, b) {
                $("div.mh-loop-content.mh-clearfix").each(function(c, d) {
                    link = $(d).find("h3.entry-title.mh-loop-title > a").attr('href');
                    img = $(b).find("img.attachment-mh-magazine-lite-medium.size-mh-magazine-lite-medium.wp-post-image").attr('src');
                    title = $(d).find("h3.entry-title.mh-loop-title > a").text().trim();
                    desc = $(d).find("div.mh-excerpt > p").text().trim();
                    date = $(d).find("span.mh-meta-date.updated").text().trim();
                    const Data = {
                        title: title,
                        thumbnail: img,
                        desc: desc,
                        date: date,
                        link: link
                    }
                    hasil.push(Data)
                })
            })
            resolve(hasil)
        }).catch(reject)
    });
}

//IgVid
function igvideo(link) {
    return new Promise(async(resolve, reject) => {
        let config = {
        'url': link,
        'submit': ''
        }
        axios('https://downloadgram.org/video-downloader.php',{
            method: 'POST',
            data : new URLSearchParams(Object.entries(config)),
            headers: {
                "cookie": "_ga=GA1.2.623704211.1625264926; __gads=ID=a078e4fc2781b47b-22330cd520ca006e:T=1625264920:RT=1625264920:S=ALNI_MYS-jyPCjNa94DU8n-sX4aNF-ODOg; __atssc=google%3B3; _gid=GA1.2.1953813019.1625397379; __atuvc=4%7C26%2C6%7C27; __atuvs=60e2ab6d67a322ec003",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })
        .then(tod => {
            const $ = cheerio.load(tod.data)
            resolve({
                link: $('#downloadBox > a').attr('href')
            })
        })
    })
}

//IgFoto 
function igfoto(link) {
    return new Promise(async(resolve, reject) => {
        let config = {
        'url': link,
        'submit': ''
        }
        axios('https://downloadgram.org/photo-downloader.php',{
            method: 'POST',
            data : new URLSearchParams(Object.entries(config)),
            headers: {
                "cookie": "_ga=GA1.2.623704211.1625264926; __gads=ID=a078e4fc2781b47b-22330cd520ca006e:T=1625264920:RT=1625264920:S=ALNI_MYS-jyPCjNa94DU8n-sX4aNF-ODOg; __atssc=google%3B3; _gid=GA1.2.1953813019.1625397379; __atuvc=4%7C26%2C6%7C27; __atuvs=60e2ab6d67a322ec003",
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })
        .then(tod => {
            const $ = cheerio.load(tod.data)
            resolve({
                link: $('#downloadBox > a').attr('href')
            })
        })
    })
}

//IgTv
function igtv(link) {
    return new Promise(async(resolve, reject) => {
        let config = {
        'url': link,
        'submit': ''
        }
        axios('https://downloadgram.org/igtv-downloader.php',{
            method: 'POST',
            data : new URLSearchParams(Object.entries(config)),
            headers: {
            "cookie": "_ga=GA1.2.623704211.1625264926; __gads=ID=a078e4fc2781b47b-22330cd520ca006e:T=1625264920:RT=1625264920:S=ALNI_MYS-jyPCjNa94DU8n-sX4aNF-ODOg; __atssc=google%3B3; _gid=GA1.2.1953813019.1625397379; __atuvc=4%7C26%2C6%7C27; __atuvs=60e2ab6d67a322ec003",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        })
        .then(tod => {
            const $ = cheerio.load(tod.data)
            resolve({
                link: $('#downloadBox > a').attr('href')
            })
        })
    })
}
//Jalan Tikus
function jalantikus(query) {
    return new Promise((resolve, reject) => {
        axios.get(`https://jalantikus.com/search/articles/${query}/`).then( tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.post-block-with-category").each(function(c, d) {
                title = $(d).find("a.post-block-with-category__link").text()
                category = $(d).find("a.post-info__category-link").text()
                date = $(d).find("time").text()
                link = `https://jalantikus.com${$(d).find("a").attr('href')}`
                const Data = {
                    title: title,
                    category: category,
                    date: date,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    })
}

//Tribun News
function tribunnews() {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.tribunnews.com/news`).then( tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("li.p1520.art-list.pos_rel").each(function(c, d) {
                title = $(d).find("div.mr140 > h3 > a.f20.ln24.fbo.txt-oev-2").text().trim()
                thumb = $(d).find("div.fr.mt5.pos_rel > a > img.shou2.bgwhite").attr('src')
                desc = $(d).find("div.grey2.pt5.f13.ln18.txt-oev-3").text().trim()
                date = $(d).find("div.grey.pt5 > time.foot.timeago").text().trim()
                link = $(d).find("div.fr.mt5.pos_rel > a").attr('href')
                const Data = {
                    title: title,
                    thumb: thumb,
                    desc: desc,
                    date: date,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    })
}

//Kompas News
function kompasnews() {
    return new Promise((resolve, reject) => {
        axios.get(`https://news.kompas.com/`).then( tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.col-bs9-3").each(function(c, d) {
                title = $(d).find("h3.article__title > a.article__link").text()
                desc = $(d).find("div.article__lead").text().trim()
                date = $(d).find("div.article__date").text().trim()
                link = $(d).find("h3.article__title > a.article__link").attr('href')
                const Data = {
                    title: title,
                    desc: desc,
                    date: date,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    })
}

//WallPapper
function wallpaper(query) {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.wallpaperflare.com/search?wallpaper=${query}`).then(async tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("#gallery > li > figure> a").each(function(i, cuk) {
                const img = $(cuk).find("img").attr('data-src');
                if(img != undefined) hasil.push(img)
            })
            resolve(hasil)
        }).catch(reject);
    });
}

//ApkMody
function apkmody(query) {
    return new Promise((resolve, reject) => {
        axios.get(`https://apkmody.io/?s=${query}`).then( tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.flex-item").each(function(c, d) {
                name = $(d).find("div.card-title > h2.truncate").text();
                desc = $(d).find("div.card-body > p.card-excerpt.has-small-font-size.truncate").text().trim();
                img = $(d).find("div.card-image > img").attr('src');
                link = $(d).find("article.card.has-shadow.clickable > a").attr('href');
                const Data = {
                    img: img,
                    name: name,
                    desc: desc,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    });
}

//PalingMurah
function palingmurah(query) {
    return new Promise((resolve, reject) => {
        axios.get(`https://palingmurah.net/pencarian-produk/?term=${query}`).then(async tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.ui.card.wpj-card-style-2").each(function(c, d) {
                //INFO BARANG
                name = $(d).find("div.content.wpj-small.list-70-right > a.list-header").text().trim();
                link = $(d).find("div.content.wpj-small.list-70-right > a.list-header").attr('href');
                img = $(d).find("div.card-image-helper > img").attr('data-src');
                harga = $(d).find("div.flex-master.card-job-price.text-right.text-vertical-center").text().trim();
                //user
                usernamepenjual = $(d).find("strong").text().trim();
                linkpenjual = $(d).find("a.ui.wpj-big.avatar.image").attr('href');
                iconpenjual = $(d).find("a.ui.wpj-big.avatar.image > img").attr('data-src');
                const Data = {
                    name: name,
                    harga: harga,
                    img: img,
                    link: link,
                    usernamepenjual: usernamepenjual,
                    linkpenjual: linkpenjual,
                    iconpenjual: iconpenjual
                }
                hasil.push(Data)
            })
            resolve(hasil)
        })
        .catch(reject)
    })
}

var uguu = async(path) => {
    return new Promise(async(resolve,reject)=>{
        var BodyForm = new formData()
        BodyForm.append('files[]', fs.createReadStream(path));
        axios({
            url: "https://uguu.se/upload.php",
            method: "POST",
            data: BodyForm,
            headers: {
                accept: '*/*',
                "accept-language": 'en-US,en;q=0.9,id;q=0.8',
                ...BodyForm.getHeaders()
            }
        }).then(({data}) => {
            var number = data.files[0].size
            var tags = ["", "K", "M", "G", "T", "P", "E"];
            var tier = Math.log10(Math.abs(number)) / 3 | 0;
            if (tier == 0) return number;
            var tag = tags[tier];
            var scale = Math.pow(10, tier * 3);
            var scaled = number / scale;
            var formatted = scaled.toFixed(1);
            if (/\.0$/.test(formatted))
            formattedd = formatted.substr(0, formatted.length - 2);
            var size = formatted + tag + 'b'
            var result = {
                status: data.success ? 200 : 404,
                name: data.files[0].name,
                hash: data.files[0].hash,
                size: size,
                url: data.files[0].url
            }
            resolve(result)
        })
        .catch(reject)
    })
}


//Moddroid
function moddroid(query) {
    return new Promise((resolve, reject) => {
        axios.get(`https://moddroid.com/?s=${query}`).then( tod => {
            const $ = cheerio.load(tod.data)
            hasil = []
            $("div.col-12.col-md-6.mb-4").each(function(c, d) {
                link = $(d).find("a.d-flex.position-relative.archive-post").attr('href');
                name = $(d).find("div > h3.h5.font-weight-semibold.text-truncate.text-primary.w-100").text().trim();
                img = $(d).find("div.flex-shrink-0.mr-2 > img").attr('src');
                desc = $(d).find("div.text-truncate.text-muted > span.align-middle").text();
                const Data = {
                    img: img,
                    name: name,
                    desc: desc,
                    link: link
                }
                hasil.push(Data)
            })
            resolve(hasil)
        }).catch(reject)
    });
}

function pinterest(querry){
	return new Promise(async(resolve,reject) => {
		 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
			headers: {
			"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
		}
			}).then(({ data }) => {
		const $ = cheerio.load(data)
		const result = [];
		const hasil = [];
   		 $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src')
            result.push(link)
		});
   		result.forEach(v => {
		 if(v == undefined) return
		 hasil.push(v.replace(/236/g,'736'))
			})
			hasil.shift();
		resolve(hasil)
		})
	})
}


module.exports.tiktok = tiktok
module.exports.tiktokmusic = tiktokmusic
module.exports.ghstalk = ghstalk
module.exports.telegra = telegra
module.exports.yta = yta
module.exports.ytv = ytv
module.exports.emoji = emoji
module.exports.mediafire = mediafire
module.exports.covid = covid
module.exports.tahta = tahta
module.exports.styleText = styleText
module.exports.fb = fb
module.exports.igstalk = igstalk
module.exports.tebakgambar = tebakgambar
module.exports.playstore = playstore
module.exports.twitter = twitter
module.exports.kodepos = kodepos
module.exports.gempa = gempa
module.exports.happymod = happymod
module.exports.kompasnews = kompasnews
module.exports.tribunnews = tribunnews
module.exports.jalantikus = jalantikus
module.exports.igtv = igtv
module.exports.igfoto = igfoto
module.exports.igvideo = igvideo
module.exports.hoax = hoax
module.exports.wallpaper = wallpaper
module.exports.apkmody = apkmody
module.exports.moddroid = moddroid
module.exports.pinterest = pinterest
module.exports.palingmurah = palingmurah
module.exports.uguu = uguu

