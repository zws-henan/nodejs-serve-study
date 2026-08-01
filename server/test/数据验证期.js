import "../init.js"
import {addAdmin,delAdmin,updateAdmin,login} from '../services/adminService.js'
import * as studentService from "../services/studentService.js"
// import {sqlLogger,defaultLogger} from "./testlog.js"

// sqlLogger.info("hello world")

// studentService.getStudents().then((result)=>{
//     console.log(result);
// })

// studentService.delStudent("670").then((result)=>{
//     console.log(result);
// }).catch((err) => {
//     console.log("删除失败:", err);
// })

// studentService.getStudents(1,10,0,"").then((result)=>{
//     console.log(result);
// })

// studentService.getStudentById("671").then((result)=>{
//     console.log(result);
// }).catch((err) => {
//     console.log("查询失败:", err);
// })

// studentService.updateStudent("671",{
//     name:"小刚",
//     // sex:true,
//     birthDate:"2009-03-05",
//     // mobile:"13800000000",
//     // ClassId:"1",
// }).then((result)=>{
//     console.log(result);
// }).catch((err) => {
//     console.log("更新失败:", err);
// })

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