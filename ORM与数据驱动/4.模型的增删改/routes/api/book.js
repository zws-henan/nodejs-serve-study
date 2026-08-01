import express from "express"
import * as bookService from "../../services/bookService.js"
import { errHandeler, normalHandeler } from "../../routes/getSendResult.js"

const bookRouter = express.Router();

// 查询书籍列表
bookRouter.get("/", async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const name = req.query.name || "";
    const author = req.query.author || "";
    const result = await bookService.getBooks(page, limit, name, author);
    res.send(normalHandeler(result));
})

// 查询单本书籍
bookRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await bookService.getBookById(id);
    res.send(normalHandeler(result));
})

// 添加书籍
bookRouter.post("/", async (req, res) => {
    const bookObj = req.body;
    const result = await bookService.addBook(bookObj);
    res.send(normalHandeler(result));
})

// 修改书籍
bookRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const bookObj = req.body;
    const result = await bookService.updateBook(id, bookObj);
    res.send(normalHandeler(result));
})

// 删除书籍
bookRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await bookService.delBook(id);
    res.send(normalHandeler(result));
})

export default bookRouter
