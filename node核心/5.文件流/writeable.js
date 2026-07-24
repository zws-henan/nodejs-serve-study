import { Readable,Writable } from "stream";
import fs from "fs";

import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const writeStream = fs.createWriteStream(path.resolve(__dirname,'b.txt'),{
    encoding:'utf-8',
    highWaterMark:20,// 如果时utf-8编码，每个中文字符占用3个字节。所以highWaterMark:20,表示每次写入20个字符即60个字节
    autoClose:true, // 写完后自动关闭流。默认是true
    flags:'w',// 文件标志。默认是'w'表示覆盖写入文件。'a'表示追加写入文件。'wx'表示创建文件并写入数据。
})

// const isSuccess = writeStream.write('hello world');
// console.log(isSuccess);

// for(let i=0;i<1024*1024;i++){
//     writeStream.write("a");
// }

let i = 0;

function write(){
    let flag = true
    while(i < 1024*1024 && flag){
        flag = writeStream.write("a");
        i++;
    }
}
write();
writeStream.on('drain',()=>{
    write();
})
