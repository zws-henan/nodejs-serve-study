import express from "express"
import cookieParser from "cookie-parser"
import myUrlEncding from "./myUrlEncding.js"
import studentRouter from "./api/student.js"
import adminRouter from "./api/admin.js"
import bookRouter from "./api/book.js"
import classRouter from "./api/class.js"
import {errorMiddleware} from "./errorMiddleware.js"
import {tokenHandel} from "./tokenMiddleware.js"
import corsMiddleware from "./corsMiddleware.js"
import cors from "cors"
import session from "express-session"

import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const staticPath = path.resolve(__dirname,"../public");

const app = express();

app.use(session({
    secret:"123456",
    
}))

const whiteList = ["http://127.0.0.1:5502","http://localhost:9527","http://127.0.0.1:9527"]
app.use(cors({
    origin(origin,callBack){
        // 同源请求或服务器间请求没有 Origin 头，直接放行
        if(!origin || whiteList.includes(origin)){
            callBack(null,true);
        }else{
            callBack(new Error("Not Allowed by CORS"));
        }
    },
    credentials:true
}));

// app.use(corsMiddleware);

app.use(cookieParser());

// 当请求时会根据请求路径，从指定的目录中查找文件，如果存在直接响应文件内容。不再移交给后续的中间件。如果文件不存在则会移交给后续的中间件。
// 默认情况下如果映射结果是一个目录，会自动去寻找目录下的index.html文件。如果不存在则会返回一个404错误。这个是可配置的。
// app.use(express.static(staticPath,{{
//     index:"index.html",
//     redirect:false
// })
app.use(express.static(staticPath));
// app.use("/static",(req,res)=>{
//     console.log(req.baseUrl,req.path);
// });

app.use(tokenHandel); 

app.use(express.urlencoded(
    {
        extended:true
    }
));
app.use(express.json());
// app.use(myUrlEncding);

app.use("/api/student",studentRouter)
app.use("/api/admin",adminRouter)
app.use("/api/book",bookRouter)
app.use("/api/class",classRouter)

// app.post("/api/student",(req,res)=>{
//     console.log(req.body);
// })

app.use(errorMiddleware);

const PORT = 9527
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})
