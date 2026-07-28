import './models/relation.js'
import {addAdmin,delAdmin,updateAdmin,login} from './services/adminService.js'

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

login("admin","654321").then((result)=>{
    console.log(result);
})