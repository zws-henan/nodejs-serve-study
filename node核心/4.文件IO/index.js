import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
// console.log(fs);
console.log(__filename, '\n', __dirname, '\n', path.resolve(__dirname, './files/a.txt'));
// console.log(fs.readFile(path.resolve(__dirname,'./files/a.txt'),'utf-8',(err,data)=>{
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log(data);
// }));

// 读取文件内容
// fs.promises.readFile(path.resolve(__dirname,'./files/a.txt'),'utf-8').then(data=>{
//     console.log(data);
// });

// 写入文件
fs.promises.writeFile(path.resolve(__dirname, './files/b.txt'), 'let"s go!', {
    encoding: 'utf-8',
    flag: 'a',
}).then(() => {
    console.log('写入成功');
}).catch(err => {
    console.log(err);
});
// 获取文件或文件夹的信息
fs.promises.stat(path.resolve(__dirname, './files')).then(data => {
    console.log(data);
    console.log(new Date(data.birthtimeMs).toString());
    console.log('是否是文件夹', data.isDirectory());
});
// 读取文件夹下的所有文件或文件夹
fs.promises.readdir(path.resolve(__dirname, './files')).then(data => {
    console.log(data);
});

// 创建文件夹
// fs.promises.mkdir(path.resolve(__dirname, './files/animal/fish')).then(data => {
//     console.log('success');
// });

for (let i = 1; i <= 4; i++) {
    const res = await exist('./files/animal/' + i);
    if(res === '文件夹存在'){
        console.log(`${i}文件夹已存在`);
        // continue;
    }else{
        await fs.promises.mkdir(path.resolve(__dirname, './files/animal/' + i))
        console.log(`创建${i}文件夹成功`);
    }
}
// 查看文件或文件夹是否存在
async function exist(mypath) {
    return fs.promises.stat(path.resolve(__dirname, mypath)).then(data => {
        if(data.isDirectory()){
            return '文件夹存在';
        }else{
            return '文件存在';
        }
    }).catch(err => {
        if (err.code === 'ENOENT') {
            return '文件或文件夹不存在';
        } else {
            return err;
        }
    });

}
