import express from "express"
import * as classService from "../../services/classService.js"
import { errHandeler, normalHandeler } from "../../routes/getSendResult.js"

const classRouter = express.Router();

// 查询班级列表
classRouter.get("/", async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await classService.getClasses(page, limit);
    res.send(normalHandeler(result));
})

// 查询单个班级
classRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await classService.getClassById(id);
    res.send(normalHandeler(result));
})

// 添加班级
classRouter.post("/", async (req, res) => {
    const classObj = req.body;
    const result = await classService.addClass(classObj);
    res.send(normalHandeler(result));
})

// 修改班级
classRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const classObj = req.body;
    const result = await classService.updateClass(id, classObj);
    res.send(normalHandeler(result));
})

// 删除班级
classRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await classService.delClass(id);
    res.send(normalHandeler(result));
})

export default classRouter
