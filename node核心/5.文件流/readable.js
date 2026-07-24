import { Readable,Writable } from "stream";
import fs from "fs";

import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const readStream = fs.createReadStream(path.resolve(__dirname,'a.txt'),{
    encoding:'utf-8',
    highWaterMark:20,
    autoClose:true, // 读完后自动关闭流。默认是true
})
readStream.on('data',(chunk)=>{
    console.log("----------");
    console.log(chunk);
    readStream.pause();
})
readStream.on('pause',()=>{
    console.log('暂停读取');
    setTimeout(()=>{
        readStream.resume();
    },1000);
})
readStream.on('resume',()=>{
    console.log('恢复读取');
})
readStream.on('end',()=>{
    console.log('读取完成');
})
readStream.on('error',(err)=>{
    console.log(err);
})
readStream.on('close',()=>{
    console.log('流关闭');
})
