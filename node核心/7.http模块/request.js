import https from 'https';

const request = https.request('https://study.duyiedu.com/api/movies?page=1&size=5',{
    method: 'GET',
    headers: {
        'User-Agent': 'nodejs',
    }
}, (res) => {
    console.log("响应状态码", res.statusCode);
    console.log("响应头", res.headers);
    let result = ""
    res.on('data', (data) => {
        result += data.toString('utf-8')
    })
    res.on('end', () => {
        console.log("响应体:", JSON.parse(result).data)
    })
})

request.end()
