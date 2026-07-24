import net from 'net'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const server = net.createServer()

server.listen(9527, '127.0.0.1', () => {
    console.log('监听成功')
})

server.on('connection', socket => {
    console.log('有客户端连接成功')

    socket.on("data", async (data) => {
        console.log(data.toString('utf-8'))
        const content =  await fs.promises.readFile(path.resolve(__dirname, './dog.jpg'));
        const headBuffer = Buffer.from(`HTTP/1.1 200 ok
Content-Type: image/jpeg

`,'utf-8')
        socket.write(Buffer.concat([headBuffer,content]))
        socket.end()
    })
    socket.on("end", () => {
        console.log("客户端连接已关闭")
    })
})
