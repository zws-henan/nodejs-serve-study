import Class from "../models/Class.js";
import Student from "../models/Student.js";
import validate from "validate.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { propertyHelper } from "../util/propertyHelper.js";

dayjs.extend(utc);

// 自定义验证器：班级是否存在
validate.validators.classExits = async function (id) {
    const res = await Class.findByPk(id);
    if (res) {
        return
    }
    return "班级不存在"
}

// 自定义验证器：班级是否有关联学生（删除时检查）
validate.validators.classHasNoStudent = async function (id) {
    const count = await Student.count({ where: { ClassId: id } });
    if (count > 0) {
        return `该班级下还有 ${count} 个学生，无法删除`
    }
}

export async function addClass(classObj) {
    classObj = propertyHelper(classObj, "name", "openDate")
    const rule = {
        name: {
            presence: {
                allowEmpty: false
            },
            type: "string",
            length: {
                minimum: 2,
                maximum: 20
            }
        },
        openDate: {
            presence: {
                allowEmpty: false
            },
            datetime: {
                dateOnly: true,
                latest: dayjs.utc().valueOf()  // 开班日期不能晚于今天
            }
        }
    }
    await validate.async(classObj, rule)

    const ins = await Class.create(classObj)
    return ins.toJSON()
}

export async function delClass(classid) {
    const rule = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            classExits: true,
            classHasNoStudent: true  // 班级下有学生则不允许删除
        }
    }
    await validate.async({ id: classid }, rule)

    return await Class.destroy({
        where: {
            id: classid
        }
    })
}

export async function updateClass(classid, classObj) {
    classObj = propertyHelper(classObj, "name", "openDate")
    const rule1 = {
        name: {
            type: "string",
            length: {
                minimum: 2,
                maximum: 20
            }
        },
        openDate: {
            datetime: {
                dateOnly: true,
                latest: dayjs.utc().valueOf()
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
            classExits: true
        }
    }
    await validate.async({ id: classid }, rule2)
    await validate.async(classObj, rule1)

    return await Class.update(classObj, {
        where: {
            id: classid
        }
    })
}

export async function getClassById(id) {
    const rule = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            classExits: true
        }
    }
    await validate.async({ id }, rule)

    const result = await Class.findByPk(id)
    return result.toJSON()
}

export async function getClasses(page = 1, limit = 10) {
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

    const { count, rows } = await Class.findAndCountAll({
        offset: (page - 1) * limit,
        limit: +limit
    })
    return {
        count,
        datas: rows.map((item) => item.toJSON())
    }
}
