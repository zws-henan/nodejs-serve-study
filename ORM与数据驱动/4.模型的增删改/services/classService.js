import Class from "../models/Class.js";
export async function addClass(classObj){
    const ins = await Class.create(classObj)
    return ins.toJSON()
}

export async function delClass(classid){
    return await Class.destroy({
        where:{
            id : classid
        }
    })
}

export async function updateClass(classid,classObj){
    return await Class.update(classObj,{
        where:{
            id : classid
        }
    })
}