import os from "os";

console.log(os.EOL);
console.log(os.arch());
// console.log(os.cpus());
console.log(os.freemem()/1024**3 + 'GB');
console.log(os.homedir());
console.log(os.hostname());
console.log(os.tmpdir());
