import Book from "../models/Book.js";
import {Op} from "sequelize";

export async function addBook(bookObj) {
    const ins = await Book.create(bookObj);
    return ins.toJSON();
}

export async function delBook(bookid) {
    return await Book.destroy({
        where: {
            id: bookid
        }
    });
}

export async function updateBook(bookid, bookObj) {
    return await Book.update(bookObj, {
        where: {
            id: bookid
        }
    });
}

export async function getBookById(id){
    const result = await Book.findByPk(id)
    if(!result){
        return null
    }
    return result.toJSON()
}

export async function getBooks(page = 1,limit = 10,name = "",author = ""){
    const where = {
        [Op.or]:[]
    }
    if(name){
        where[Op.or].push({
            name:{
                [Op.like]:`%${name}%`
            }
        })
    }
    if(author){
        where[Op.or].push({
            author:{
                [Op.like]:`%${author}%`
            }
        })
    }
    const {count,rows} = await Book.findAndCountAll({
        where,
        offset:(page - 1) * limit,
        limit:+limit
    })
    return {
        count,
        datas:rows.map((item)=>{
            return item.toJSON()
        })
    }
}


// getBookById(1).then((result)=>{
//     console.log(result)
// })

// getBooks(1,10,"转").then((result)=>{
//     console.log(result)
// })