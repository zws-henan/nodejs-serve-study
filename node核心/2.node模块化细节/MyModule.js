console.log("当前模块路径：",__dirname);
console.log("当前模块文件：",__filename);
// this.m = 5;
// 这里由于给exports赋值了一个新的对象。与module.exports解绑。所以以后的操作都不会影响module.exports。
// 所以require返回的结果是新对象，而非exports指向的旧对象。
// exports = {}
exports.c = 3;
// module.exports = {
//     a: 1,
//     b: 2,
// }


module.exports.a = 1;
module.exports.b = 2;
this.m = 5;