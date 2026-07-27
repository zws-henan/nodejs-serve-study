// import './models/sync.js'

// import Admin from './models/admin.js'

// const ins = Admin.build({
//     loginId:"abc",
//     loginPwd:"123123",
    
// })

// ins.loginId = "bcd"

// ins.save().then(() => {
//     console.log("新建管理员成功");
// })

// Admin.create({
//     loginId:"admin",
//     loginPwd:"123456"
// }).then(ins => {
//     console.log(ins.id,ins.loginId,ins.loginPwd);
// })

import * as adminService from "./services/adminService.js";

// adminService.addAdmin({
//     loginId:"admin1",
//     loginPwd:"123456"
// })

// adminService.delAdmin(4).then(res => {
//     console.log(res);
// })

// adminService.updateAdmin(1,{
//     loginId:"haha1",
//     loginPwd:"123456"
// }).then(res => {
//     console.log(res);
// })

import * as classService from "./services/classService.js";

// classService.addClass({
//     name:"计科251",
//     openDate:`${new Date().toLocaleString()}`
// }).then(res => {
//     console.log(res);
// })

// classService.delClass(2).then(res => {
//     console.log(res);
// })

// classService.updateClass(1,{
//     name:"计算计科学与技术251班"
// })

import * as studentService from "./services/studentService.js";

// studentService.addStudent({
//     name:"张三",
//     birthDate:"2000-04-01",
//     classId:1,
//     sex:true,
//     mobile:"13800000000",
//     ClassId:"1"
// }).then(res => {
//     console.log(res);
// })

// studentService.updateStudent(2,{
//     name:"李四",
//     birth:"2000-04-01",
//     classId:2
// }).then(res => {
//     console.log(res);
// })

// studentService.delStudent(4).then(res => {
//     console.log(res);
// })

// studentService.updateStudent(4,{
//     name:"王五",
//     birth:"2000-04-01",
//     classId:1
// }).then(res => {
//     console.log(res);
// })

import { addBook, delBook, updateBook } from './services/bookService.js';

// 添加书籍
// await addBook({
//     name: 'JavaScript高级程序设计',
//     imgUrl: 'https://example.com/cover.jpg',
//     publicDate: new Date(),
//     author: 'Nicholas C. Zakas'
// });

// delBook(2).then(res => {
//     console.log(res);
// })

// updateBook(2,{
//     name:"python程序设计"
// }).then(res => {
//     console.log(res);
// })
