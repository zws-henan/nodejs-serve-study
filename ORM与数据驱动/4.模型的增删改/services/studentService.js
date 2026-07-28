import { Op } from "sequelize";
import Student from "../models/Student.js";
import Class from "../models/Class.js";

export async function addStudent(studentObj) {
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