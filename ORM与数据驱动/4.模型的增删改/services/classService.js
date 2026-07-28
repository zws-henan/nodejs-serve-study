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

export async function getClassById(id){
    const result = await Class.findByPk(id)
    return result.toJSON()
}

export async function getClasses(){
    const { count, rows } = await Class.findAndCountAll()
    return {
        count,
        datas: rows.map((item) => item.toJSON())
    }
}

// getClassById(1).then((result)=>{
//     console.log(result)
// })

// getClasses().then((result)=>{
//     console.log(result)
// })
