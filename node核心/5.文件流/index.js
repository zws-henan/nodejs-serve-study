import { Readable,Writable } from "stream";
import fs from "fs";

import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

async function copy1(){
    const from = path.resolve(__dirname,'b.txt');
    const to = path.resolve(__dirname,'b1.txt');
    console.time('1')
    const content = await fs.promises.readFile(from,'utf-8');
    await fs.promises.writeFile(to,content);
    console.timeEnd('1')
}

// copy1()

async function method2 (){
    const from = path.resolve(__dirname,'b.txt');
    const to = path.resolve(__dirname,'b1.txt');
    console.time('1')
    const rs = fs.createReadStream(from)
    const ws = fs.createWriteStream(to)
    // rs.on('data',chunk => {
    //     const flag = ws.write(chunk)
    //     if(!flag){
    //         rs.pause()
    //     }
    // })
    // ws.on("drain",()=>{
    //     rs.resume()
    // })
    // rs.on("close",()=>{
    //     ws.end();
    //     console.timeEnd('1')
    // })
    rs.pipe(ws)

    rs.on("close",()=>{
        console.timeEnd('1')
    })
}

method2()