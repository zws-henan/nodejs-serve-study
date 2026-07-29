import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
// console.log(path);
console.log(path.basename('/a/b/c', '.html'));

console.log(path.basename('/a/b/c.htm', '.html'));

console.log(path.delimiter);

console.log(path.sep);

console.log(path.dirname('/a/b/c.html'));

console.log(path.extname('/a/b/c.htm'));

console.log(path.join('/a', 'b', 'c', 'd.js'));
console.log(path.join('/a', '../', '/c'));
console.log(path.normalize('/a/b/c/d.js'));
console.log(path.normalize('/a/b/..'));

console.log(path.relative("/a/b/c/1.js","/a/b/c/d"));

console.log(path.resolve('./node_modules'));

console.log(path.resolve(__dirname,'./node_modules'));
