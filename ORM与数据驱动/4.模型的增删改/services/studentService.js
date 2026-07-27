import Student from "../models/Student.js";

export async function addStudent(studentObj){
    const ins = await Student.create(studentObj)
    return ins.toJSON()
}

export async function delStudent(studentid){
    return await Student.destroy({
        where:{
            id : studentid
        }
    })
}

export async function updateStudent(studentid,studentObj){
    return await Student.update(studentObj,{
        where:{
            id : studentid
        }
    })
}