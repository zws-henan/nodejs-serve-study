import Book from "../models/Book.js";
import { Op } from "sequelize";
import validate from "validate.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { propertyHelper } from "../util/propertyHelper.js";

dayjs.extend(utc);

// 自定义验证器：书籍是否存在
validate.validators.bookExits = async function (id) {
    const res = await Book.findByPk(id);
    if (res) {
        return
    }
    return "书籍不存在"
}

export async function addBook(bookObj) {
    bookObj = propertyHelper(bookObj, "name", "imgUrl", "publicDate", "author")
    const rule = {
        name: {
            presence: {
                allowEmpty: false
            },
            type: "string",
            length: {
                minimum: 1,
                maximum: 100
            }
        },
        imgUrl: {
            type: "string",
            length: {
                maximum: 500
            }
        },
        publicDate: {
            presence: {
                allowEmpty: false
            },
            datetime: {
                dateOnly: true,
                latest: dayjs.utc().valueOf()  // 出版日期不能晚于今天
            }
        },
        author: {
            presence: {
                allowEmpty: false
            },
            type: "string",
            length: {
                minimum: 1,
                maximum: 50
            }
        }
    }
    await validate.async(bookObj, rule)

    const ins = await Book.create(bookObj);
    return ins.toJSON();
}

export async function delBook(bookid) {
    const rule = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            bookExits: true
        }
    }
    await validate.async({ id: bookid }, rule)

    return await Book.destroy({
        where: {
            id: bookid
        }
    });
}

export async function updateBook(bookid, bookObj) {
    bookObj = propertyHelper(bookObj, "name", "imgUrl", "publicDate", "author")
    const rule1 = {
        name: {
            type: "string",
            length: {
                minimum: 1,
                maximum: 100
            }
        },
        imgUrl: {
            type: "string",
            length: {
                maximum: 500
            }
        },
        publicDate: {
            datetime: {
                dateOnly: true,
                latest: dayjs.utc().valueOf()
            }
        },
        author: {
            type: "string",
            length: {
                minimum: 1,
                maximum: 50
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
            bookExits: true
        }
    }
    await validate.async({ id: bookid }, rule2)
    await validate.async(bookObj, rule1)

    return await Book.update(bookObj, {
        where: {
            id: bookid
        }
    });
}

export async function getBookById(id) {
    const rule = {
        id: {
            presence: true,
            type: "string",
            numericality: {
                onlyInteger: true,
                strict: false,
            },
            bookExits: true
        }
    }
    await validate.async({ id }, rule)

    const result = await Book.findByPk(id)
    return result.toJSON()
}

export async function getBooks(page = 1, limit = 10, name = "", author = "") {
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
        },
        name: {
            type: "string",
            length: {
                maximum: 100
            }
        },
        author: {
            type: "string",
            length: {
                maximum: 50
            }
        }
    }
    await validate.async({ page, limit, name, author }, rule)

    const where = {
        [Op.or]: []
    }
    if (name) {
        where[Op.or].push({
            name: {
                [Op.like]: `%${name}%`
            }
        })
    }
    if (author) {
        where[Op.or].push({
            author: {
                [Op.like]: `%${author}%`
            }
        })
    }
    const { count, rows } = await Book.findAndCountAll({
        where,
        offset: (page - 1) * limit,
        limit: +limit
    })
    return {
        count,
        datas: rows.map((item) => {
            return item.toJSON()
        })
    }
}
