import { Op } from "sequelize";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import validate from "validate.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { propertyHelper } from "../util/propertyHelper.js";

dayjs.extend(utc);


export async function addStudent(studentObj) {
    // const studentObj = { name: studentObj.name, sex: studentObj.sex, birthDate: studentObj.birthDate, mobile: studentObj.mobile, ClassId: studentObj.ClassId }
    studentObj = propertyHelper(studentObj, "name", "sex", "birthDate", "mobile", "ClassId")
    validate.validators.classExits = async function (classid) {
        const res = await Class.findByPk(classid);
        if (res) {
            return
        }
        return "班级不存在"
    }
    const rule = {
        name: {
            presence: {
                allowEmpty: false
            },
            type: "string",
            length: {
                minimum: 2,
                maximum: 10
            }
        },
        sex: {
            presence: true,
            type: "boolean",
        },
        birthDate: {
            presence: {
                allowEmpty: false
            },
            datetime: {
                dateOnly: true,
                earliest: dayjs.utc().subtract(18, "year").valueOf(),
                latest: dayjs.utc().subtract(5, "year").valueOf()
            }
        },
        mobile: {
            presence: {
                allowEmpty: false
            },
            type: "string",
            format: {
                pattern: /^1[3456789]\d{9}$/,
                message: "手机号格式错误"
            }
        },
        ClassId: {
            presence: true,
            numericality: {
                onlyInteger: true,//必须是整数
                strict: false,//严格模式，flase:允许类型错误，即允许字符串转换为整数
            },
            classExits: true
        }
    }
    // 异步模式的验证：通过后validate什么都不会做即不会返回任何东西，如果失败会报错
    await validate.async(studentObj, rule)

    const ins = await Student.create(studentObj)
    return ins.toJSON()
}


export async function delStudent(studentid) {
    validate.validators.studentExits = async function (stuid) {
        const res = await Student.findByPk(stuid);
        if (res) {
            return
        }
        return "学生不存在"
    }
    const rule = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            studentExits: true
        }
    }
    await validate.async({ id: studentid }, rule)
    const result = await Student.destroy({
        where: {
            id: studentid
        }
    })
    return result
}

export async function updateStudent(studentid, studentObj) {
    studentObj = propertyHelper(studentObj, "name", "sex", "birthDate", "mobile", "ClassId")
    validate.validators.classExits = async function (classid) {
        // 更新时ClassId可选，未传则跳过验证
        if (classid === undefined || classid === null || classid === "") {
            return
        }
        const res = await Class.findByPk(classid);
        if (res) {
            return
        }
        return "班级不存在"
    }
    validate.validators.studentExits = async function (stuid) {
        const res = await Student.findByPk(stuid);
        if (res) {
            return
        }
        return "学生不存在"
    }
    // 更新验证规则：字段都是可选的（不传则不更新）
    // 但如果传了，就不能为空字符串/无效值（由其他验证器拦截）
    const rule1 = {
        name: {
            //不设presence，字段可选；若传了空字符串，length会拦截
            type: "string",
            length: {
                minimum: 2,
                maximum: 10
            }
        },
        sex: {
            type: "boolean",//若传了空字符串，type验证会拦截
        },
        birthDate: {
            datetime: {
                dateOnly: true,
                earliest: dayjs.utc().subtract(18, "year").valueOf(),
                latest: dayjs.utc().subtract(5, "year").valueOf()
            }
        },
        mobile: {
            type: "string",
            format: {
                pattern: /^1[3456789]\d{9}$/,
                message: "手机号格式错误"//若传了空字符串，format验证会拦截
            }
        },
        ClassId: {
            numericality: {
                onlyInteger: true,//必须是整数
                strict: false,//严格模式，flase:允许类型错误，即允许字符串转换为整数
            },
            classExits: true
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
            studentExits: true
        }
    }
    await validate.async({ id: studentid }, rule2)
    await validate.async(studentObj, rule1)
    return await Student.update(studentObj, {
        where: {
            id: studentid
        }
    })
}

export async function getStudents(page = 1, limit = 10, sex = -1, name = "") {
    // const result = await Student.findAll({
    //     offset : (page - 1) * limit,
    //     limit:+limit
    // })
    // const total = await Student.count()
    // const datas = JSON.parse(JSON.stringify(result))
    // return {
    //     total,
    //     datas
    // }
    // 数据验证：验证查询参数的合法性
    const rule = {
        page: {
            presence: true,
            numericality: {
                onlyInteger: true,//必须是整数
                strict: false,//非严格模式，允许字符串转整数
                greaterThanOrEqualTo: 1,//页码最小为1
            }
        },
        limit: {
            presence: true,
            numericality: {
                onlyInteger: true,
                strict: false,
                greaterThanOrEqualTo: 1,//每页至少1条
                lessThanOrEqualTo: 100,//每页最多100条，防止恶意请求大数据量
            }
        },
        sex: {
            presence: true,
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            inclusion: [-1, "0", "1"]//-1:全部 0:女 1:男
        },
        name: {
            type: "string",
            length: {
                maximum: 10
            }
        }
    }
    await validate.async({ page, limit, sex, name }, rule)

    const condition = {}
    if (sex != -1) {
        condition.sex = !!sex
    }
    if (name) {
        condition.name = {
            [Op.like]: `%${name}%`
        }
    }
    const { count, rows } = await Student.findAndCountAll({
        attributes: ["id", "name", "sex", "birthDate", "age"],
        where: condition,
        include: [Class],
        offset: (page - 1) * limit,
        limit: +limit
    })
    return {
        total: count,
        datas: rows.map((item) => {
            const result = item.toJSON()
            result.Class = {
                id: item.Class.id,
                name: item.Class.name,
            }
            return result
        })
    }
}

export async function getStudentById(studentid) {
    // 验证ID合法性及学生是否存在
    validate.validators.studentExits = async function (stuid) {
        const res = await Student.findByPk(stuid);
        if (res) {
            return
        }
        return "学生不存在"
    }
    const rule = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            studentExits: true
        }
    }
    await validate.async({ id: studentid }, rule)

    // 查询学生完整信息（包含班级信息）
    const result = await Student.findByPk(studentid, {
        attributes: ["id", "name", "sex", "birthDate", "mobile", "age"],
        include: [Class]
    })
    const data = result.toJSON()
    data.Class = {
        id: result.Class.id,
        name: result.Class.name,
    }
    return data
}