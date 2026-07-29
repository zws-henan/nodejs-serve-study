import "./init.js"
import {addAdmin,delAdmin,updateAdmin,login} from './services/adminService.js'
import * as studentService from "./services/studentService.js"
// import {sqlLogger,defaultLogger} from "./testlog.js"

// sqlLogger.info("hello world")

studentService.getStudents().then((result)=>{
    console.log(result);
})

// studentService.addStudent({
//     name: "小刚",
//     sex: true,
//     birthDate: "2009-03-05",
//     mobile: "13800000000",
//     ClassId: "1",
//     deleteAt:"2009-03-05"
// }).then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })

// addAdmin({
//     loginId:"admin",
//     loginPwd:"123456"
// }).then((result)=>{
//     console.log(result);
// })

// updateAdmin(6,{
//     loginPwd:"654321"
// }).then((result)=>{
//     console.log(result);
// })

// login("admin","654321").then((result)=>{
//     console.log(result);
// })