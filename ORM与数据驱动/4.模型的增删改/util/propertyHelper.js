export function propertyHelper(obj,...arg){
    if(!obj){
        return obj
    }
    const temp = {}
    for (const item in obj) {
        if(arg.includes(item)){
            temp[item] = obj[item]
        }
    }
    return temp
}

// const obj = {
//     a:1,
//     b:2,
//     c:3,
//     d:4,
//     e:5,
// }
// const temp = propertyHelper(obj,"a","c","e")
// console.log(temp);
