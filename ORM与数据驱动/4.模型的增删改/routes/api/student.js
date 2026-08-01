import express from "express"

const studentRouter = express.Router();

studentRouter.get("/",(req,res)=>{
    res.send("获取学生列表")
})

studentRouter.get("/:id",(req,res)=>{
    res.send(`获取指定学生${req.params.id}`);
})

studentRouter.post("/",(req,res)=>{
    res.send("添加学生");
})

studentRouter.put("/",(req,res)=>{
    res.send("更新学生");
})

studentRouter.delete("/:id",(req,res)=>{
    res.send(`删除学生${req.params.id}`);
})

export default studentRouter

