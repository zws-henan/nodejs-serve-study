// 初始化管理员
// 判断系统中是否有管理员
import { where } from "sequelize";
import Admin from "../models/admin.js";
import validate from "validate.js";
import md5 from 'md5'
import { propertyHelper } from "../util/propertyHelper.js";

// 自定义验证器：管理员是否存在
validate.validators.adminExits = async function (id) {
    const res = await Admin.findByPk(id);
    if (res) {
        return
    }
    return "管理员不存在"
}

// 自定义验证器：登录账号是否唯一
validate.validators.loginIdUnique = async function (loginId) {
    if (loginId === undefined || loginId === null || loginId === "") {
        return
    }
    const res = await Admin.findOne({ where: { loginId } });
    if (res) {
        return "登录账号已存在"
    }
}

export async function addAdmin(adminObj) {
    adminObj = propertyHelper(adminObj, "loginId", "loginPwd")
    const rule = {
        loginId: {
            presence: {
                allowEmpty: false
            },
            type: "string",
            length: {
                minimum: 3,
                maximum: 20
            },
            loginIdUnique: true
        },
        loginPwd: {
            presence: {
                allowEmpty: false
            },
            type: "string",
            length: {
                minimum: 6,
                maximum: 20
            }
        }
    }
    await validate.async(adminObj, rule)

    // 加密密码
    adminObj.loginPwd = md5(adminObj.loginPwd)
    const ins = await Admin.create(adminObj)
    const json = ins.toJSON();
    delete json.loginPwd;
    return json;
}

export async function delAdmin(adminid) {
    // //方式一
    // // 1. 得到实例
    // const ins = await Admin.findByPk(adminid)
    // // 2.调用实例的destroy方法删除
    // if(ins){
    //     await ins.destroy()
    // }

    // 方式二
    const rule = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            adminExits: true
        }
    }
    await validate.async({ id: adminid }, rule)

    const res = await Admin.destroy({
        where: {
            id: adminid
        }
    })
    return res
}

export async function updateAdmin(adminid, adminObj) {
    // // 方式一
    // // 得到实例
    // const ins = await Admin.findByPk(adminid)
    // ins.loginId = adminObj.loginId
    // ins.loginPwd = adminObj.loginPwd
    // // 保存实例
    // await ins.save()
    
    // 方式二
    adminObj = propertyHelper(adminObj, "loginId", "loginPwd")
    const rule1 = {
        loginId: {
            type: "string",
            length: {
                minimum: 3,
                maximum: 20
            },
            loginIdUnique: true
        },
        loginPwd: {
            type: "string",
            length: {
                minimum: 6,
                maximum: 20
            }
        }
    }
    const rule2 = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            adminExits: true
        }
    }
    await validate.async({ id: adminid }, rule2)
    await validate.async(adminObj, rule1)

    // 加密密码
    if (adminObj.loginPwd) {
        adminObj.loginPwd = md5(adminObj.loginPwd)
    }
    const res = await Admin.update(adminObj, {
        where: {
            id: adminid
        }
    })
    return res
}

export async function login(loginId, loginPwd) {
    const rule = {
        loginId: {
            presence: {
                allowEmpty: false
            },
            type: "string",
        },
        loginPwd: {
            presence: {
                allowEmpty: false
            },
            type: "string",
        }
    }
    await validate.async({ loginId, loginPwd }, rule)

    // 加密密码
    loginPwd = md5(loginPwd)
    const result = await Admin.findOne({
        where: {
            loginId,
            loginPwd
        }
    })
    if (result && result.loginId === loginId && result.loginPwd === loginPwd) {
        const json = result.toJSON();
        delete json.loginPwd;
        return json;
    }
    return null
}

export async function getAdminById(id) {
    const rule = {
        id: {
            presence: true,
            // type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            adminExits: true
        }
    }
    await validate.async({ id }, rule)

    const result = await Admin.findByPk(id)
    const json = result.toJSON();
    delete json.loginPwd;
    return json;
}

export async function getAdmins(page = 1, limit = 10) {
    const rule = {
        page: {
            presence: true,
            numericality: {
                onlyInteger: true,
                strict: false,
                greaterThanOrEqualTo: 1,
            }
        },
        limit: {
            presence: true,
            numericality: {
                onlyInteger: true,
                strict: false,
                greaterThanOrEqualTo: 1,
                lessThanOrEqualTo: 100,
            }
        }
    }
    await validate.async({ page, limit }, rule)

    const { count, rows } = await Admin.findAndCountAll({
        offset: (page - 1) * limit,
        limit: +limit
    })
    return {
        count,
        datas: rows.map((item) => {
            const result = item.toJSON()
            delete result.loginPwd  // 不返回密码
            return result
        })
    }
}
