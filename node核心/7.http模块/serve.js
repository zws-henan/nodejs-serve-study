import http from 'http';
import url from 'url';

const server = http.createServer((req, res) => {
    console.log("请求来了");
    console.log("请求地址", url.parse(req.url))
    console.log("请求头", req.headers);
    console.log("请求方法", req.method);

    let body = ""

    req.on('data', (data) => {
        body += data.toString('utf-8')
    })
    req.on('end', () => {
        console.log("请求体:", JSON.parse(body))
    })
    res.setHeader('Content-Type','text/plain')
    res.statusCode = 201
    res.write("hello world")
    res.end()
})

server.listen(9527)

server.on('listening', () => {
    console.log('监听成功')
})

server.on('connection', socket => {
    console.log('有客户端连接成功')
})