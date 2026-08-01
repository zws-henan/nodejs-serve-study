import express from "express"
import * as adminService from "../../services/adminService.js"
import { errHandeler, normalHandeler } from "../../routes/getSendResult.js"

const adminRouter = express.Router();

// 登录
adminRouter.post("/login", async (req, res) => {
    const { loginId, loginPwd } = req.body;
    const result = await adminService.login(loginId, loginPwd);
    if (result) {
        res.send(normalHandeler(result));
    } else {
        res.send(errHandeler("账号或密码错误", 400));
    }
})

// 查询管理员列表
adminRouter.get("/", async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const result = await adminService.getAdmins(page, limit);
    res.send(normalHandeler(result));
})

// 查询单个管理员
adminRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await adminService.getAdminById(id);
    res.send(normalHandeler(result));
})

// 添加管理员
adminRouter.post("/", async (req, res) => {
    const adminObj = req.body;
    const result = await adminService.addAdmin(adminObj);
    res.send(normalHandeler(result));
})

// 修改管理员
adminRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const adminObj = req.body;
    const result = await adminService.updateAdmin(id, adminObj);
    res.send(normalHandeler(result));
})

// 删除管理员
adminRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await adminService.delAdmin(id);
    res.send(normalHandeler(result));
})

export default adminRouter
