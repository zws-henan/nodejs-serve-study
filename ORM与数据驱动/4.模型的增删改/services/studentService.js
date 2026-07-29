import { Op } from "sequelize";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import validate from "validate.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { type } from "node:os";

dayjs.extend(utc);


export async function addStudent(studentObj) {
    validate.validators.classExits = async function (classid){
        const res = await Class.findByPk(classid);
        if(res){
            return
        }
        return "班级不存在"
    }
    const rule = {
        name:{
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
        birthDate:{
            presence:{
                allowEmpty:false
            },
            datetime:{
                dateOnly:true,
                earliest:dayjs.utc().subtract(18, "year").valueOf(),
                latest:dayjs.utc().subtract(5, "year").valueOf()
            }
        },
        mobile:{
            presence: {
                allowEmpty: false
            },
            type: "string",
            format: {
                pattern: /^1[3456789]\d{9}$/,
                message: "手机号格式错误"
            }
        },
        ClassId:{
            presence: true,
            numericality: {
                onlyInteger: true,//必须是整数
                strict: false,//严格模式，flase:允许类型错误，即允许字符串转换为整数
            },
            classExits:true
        }
    }
    // 异步模式的验证：通过后validate什么都不会做即不会返回任何东西，如果失败会报错
    await validate.async(studentObj, rule)
    
    const ins = await Student.create(studentObj)
    return ins.toJSON()
}


export async function delStudent(studentid) {
    return await Student.destroy({
        where: {
            id: studentid
        }
    })
}

export async function updateStudent(studentid, studentObj) {
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
        attributes: ["id", "name", "sex"],
        where: condition,
        include: [Class],
        offset: (page - 1) * limit,
        limit: +limit
    })
    return {
        count,
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