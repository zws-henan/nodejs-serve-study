import http from 'http'
import url from 'url'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
/**
 * 检查文件/目录是否存在
 * @param {string} mypath - 文件/目录路径
 * @returns {Promise<string|Error>} 存在状态描述或错误对象
 */
async function exist(mypath) {
    return fs.promises.stat(path.resolve(__dirname, mypath))
        .then(data => {
            return data.isDirectory() ? '文件夹存在' : '文件存在';
        })
        .catch(err => {
            return err.code === 'ENOENT' ? '文件或文件夹不存在' : err;
        });
}

async function getFile(filename){
    let myPath = path.resolve(__dirname,'public',filename.substring(1));
    let result = await exist(myPath);
    if(result === '文件存在'){
        const file = await fs.promises.readFile(myPath);
        return file
    }else if(result === '文件夹存在'){
        myPath = path.resolve(__dirname,'public',filename.substring(1),'index.html');
        result = await exist(myPath);
        if(result === '文件存在'){
            const file = await fs.promises.readFile(myPath);
            return file
        }else{
            return null
        }
    }else{
        return null
    }
    
}
async function handler(req,resp){
    const objurl = url.parse(req.url)
    const info = await getFile(objurl.pathname)
    if(info === null){
        resp.writeHead(404)
        resp.end('404 Not Found')
        return
    }
    // resp.setHeader('Content-Type','text/html;charset=utf-8')
    resp.write(info)
    resp.end()
}
const server = http.createServer(handler)

server.listen(443);

server.on("listening",() => {
    console.log("serve is listening 443");
})
