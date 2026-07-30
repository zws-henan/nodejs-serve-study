import "./init.js"
import express from "express"


const app = express();// 创建一个express应用实例
// app实际上是一个用于请求处理的函数

// 配置一个请求映射，如果请求方法和路径都匹配，就调用回调函数
app.get("/abc",(req,res)=>{
    // req和res是被express封装后的对象
    // ===获取请求信息===
    console.log("请求头:", req.headers); // 得到请求头信息
    console.log("请求方法:", req.method); // 得到请求方法 
    console.log("请求路径:", req.path); // 得到请求路径
    console.log("请求参数:", req.query); // 得到请求参数

    // ===响应客户端===
    res.send("<h1>hello express</h1>");      
    // res.json({name:"kuocheng"});

    // res.status(302).header("Location","https://www.baidu.com").end();
    // 上下的效果是一样的
    // res.status(302).location("https://www.baidu.com").end();
    // res.redirect(302,"https://www.baidu.com");
})
// 动态路由
app.get("/news/:id",(req,res)=>{
    console.log("请求路径:", req.path); // 得到请求路径
    console.log("请求参数:", req.query);
    console.log("动态路由参数:", req.params.id);
})
app.get("*path",(req,res)=>{ // * 表示匹配所有路径
    res.send("404 Not Found");
})

const PORT = 9527
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})
