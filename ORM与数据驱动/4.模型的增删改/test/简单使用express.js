import "./init.js"
import express from "express"
import http from "http"

const app = express();// 创建一个express应用实例
// app实际上是一个用于请求处理的函数
const server = http.createServer(app);
const PORT = 9527
server.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})
