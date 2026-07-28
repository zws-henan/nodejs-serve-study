// 初始化管理员
// 判断系统中是否有管理员
import { where } from "sequelize";
import Admin from "../models/admin.js";

export async function addAdmin(adminObj) {
    const ins = await Admin.create(adminObj)
    return ins.toJSON();
}

export async function delAdmin(adminid){
    // //方式一
    // // 1. 得到实例
    // const ins = await Admin.findByPk(adminid)
    // // 2.调用实例的destroy方法删除
    // if(ins){
    //     await ins.destroy()
    // }

    // 方式二
    const res = await Admin.destroy({
        where:{
            id : adminid
        }
    })
    return res
    // return res.toJSON()
}

export async function updateAdmin(adminid,adminObj){
    // // 方式一
    // // 得到实例
    // const ins = await Admin.findByPk(adminid)
    // ins.loginId = adminObj.loginId
    // ins.loginPwd = adminObj.loginPwd
    // // 保存实例
    // await ins.save()
    
    // 方式二
    const res = await Admin.update(adminObj,{
        where:{
            id : adminid
        }
    })
    return res
}

export async function login(loginId,loginPwd){
    const result = await Admin.findOne({
        where:{
            loginId,
            loginPwd
        }
    })
    if(result && result.loginId === loginId && result.loginPwd === loginPwd){
        return result.toJSON()
    }
    return null
    // return result.toJSON()
}

export async function getAdminById(id){
    const result = await Admin.findByPk(id)
    return result.toJSON()
}

export async function getAdmins(){
    const { count, rows } = await Admin.findAndCountAll()
    return {
        count,
        datas: rows.map((item) => item.toJSON())
    }
}

// console.log(await getAdmins())
