import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

function copyFile(orgin, target) {
    let bf = null;
    fs.promises.readFile(path.resolve(__dirname, orgin)).then(data => {
        fs.promises.writeFile(path.resolve(__dirname, target), data).then(() => {
            console.log('写入成功');
        }).catch(err => {
            console.log(err);
        });
    });

}


copyFile('./files/dog.jpg', './dog.jpg')