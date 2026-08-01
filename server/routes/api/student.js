import express from "express"
import * as studentService from "../../services/studentService.js"
import { errHandeler, normalHandeler } from "../../routes/getSendResult.js"

const studentRouter = express.Router();

studentRouter.get("/", async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sex = req.query.sex || -1;
    const name = req.query.name || "";
    const result = await studentService.getStudents(page, limit, sex, name);
    res.send(normalHandeler(result));
})

studentRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await studentService.getStudentById(id);
    res.send(normalHandeler(result));
})

studentRouter.post("/", async (req, res) => {
    const stuObj = req.body;
    const result = await studentService.addStudent(stuObj);
    
    res.send(normalHandeler(result));
})

studentRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const stuObj = req.body;
    const result = await studentService.updateStudent(id, stuObj);
    res.send(normalHandeler(result));
})

studentRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await studentService.delStudent(id);
    res.send(normalHandeler(result));
})

export default studentRouter

