import './models/relation.js'
import {login,getAdminById} from './services/adminService.js'
import {getStudents} from './services/studentService.js'

// login("admin","123456").then((result)=>{
//     console.log(result)
// })
// getAdminById(1).then((result)=>{
//     console.log(result)
// })
getStudents(1,10,0,"夏").then((result)=>{
    console.log(result)
    console.log(result.datas[0].Class);
})
