import Book from "../models/Book.js";

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