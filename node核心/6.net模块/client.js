import net from 'net';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const socket = net.createConnection({
    host: 'www.baidu.com',
    port: 80,
}, (err, socket) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('连接成功')
})

let receive = null;
function getHeader(response) {
    // console.log(response);
    const index = response.indexOf('\r\n\r\n')
    let header = response.substring(0, index)
    const body = response.substring(index + 2).trimStart()
    header = header.split('\r\n').map(item => {
        return item.split(':').map(item => item.trim())
    })
    header = header.reduce((pre, item) => {
        pre[item[0]] = item[1]
        return pre
    }, {})
    return {
        header,
        body
    }
}

socket.write(`GET / HTTP/1.1

Host: www.baidu.com
Connection: keep-alive
 
`)

socket.on('data', (data) => {
    if (!receive) {
        receive = getHeader(data.toString('utf-8'))
        if (receive.header['content-Length'] < data.length) {
            console.log(receive);
            socket.end()
        }
        return
    }
    receive.body += data
    // if (receive.header['content-Length'] < data.length) {
    //     socket.end()
    // }
    // console.log(receive.body);
})

socket.on('close', () => {
    console.log(receive.body);
    // console.log(JSON.parse(receive.body));
    console.log('连接已关闭')
})