// // require执行一个模块的逻辑大致如下
// function require(modulePath) {
//     // 1. 将相对路径转换为绝对路径
//     // 2. 判断该模块是否有缓存
//     // if(require.cache["该模块的绝对路径"]){
//     //  return require.cache["该模块的绝对路径"].result() 
//     //}
//     // 3. 读取文件内容。将文件内容放入到一个函数去
//     function _temp(module, exports, require, __dirname, __filename) {
//         console.log("当前模块路径：", __dirname);
//         console.log("当前模块文件：", __filename);
//         // this.m = 5;
//         exports.c = 3;
//         module.exports = {
//             a: 1,
//             b: 2,
//         }
//         // module.exports.a = 1;
//         // module.exports.b = 2;
//         this.m = 5;
//     }
//     // 4. 创建module对象
//     module.exports = {}
//     const exports = module.exports;

//     _temp.call(module.exports, module, exports, require,module.path, module.filename);
//     return module.exports;
//     // 所以由此可知在一个模块node文件中this是与module.exports和exports是同一个对象，他们是相等的。
//     // 但在_temp内部，当执行 `module.exports = {a: 1, b: 2}` 时，是给module.exports重新赋值了一个新对象。
//     // 由于exports在第24行已通过 `const exports = module.exports` 指向了原来的空对象，此时exports仍然指向旧对象（包含c属性），而module.exports指向了新对象。
//     // 最终return的是module.exports（新对象{a:1, b:2}），所以require返回的结果是新对象，而非exports指向的旧对象。
//     // 若改为 `module.exports.a = 1; module.exports.b = 2`（添加属性而非重新赋值），则module.exports仍指向原对象，exports和module.exports始终保持同步，返回结果包含所有属性。
// }







// require('C:/Users/uuy/Desktop/nodejsServe/node核心/2.node模块化细节/index.js')
// const ab = require('./ab');
// console.log(ab);

// require('./src');

// require('./')
// // console.log("module index.js");

// require('abcd')

// require('abcd/index')

// require('./src');

// console.log(require.resolve('./src'));

const result = require('./MyModule');
console.log(result);