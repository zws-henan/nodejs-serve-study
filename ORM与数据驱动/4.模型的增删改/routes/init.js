import express from "express"
import myUrlEncding from "./myUrlEncding.js"
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const staticPath = path.resolve(__dirname,"../public");

const app = express();

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

app.use(express.urlencoded(
    {
        extended:true
    }
));
app.use(express.json());
// app.use(myUrlEncding);

app.post("/api/student",(req,res)=>{
    console.log(req.body);
})

const PORT = 9527
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})
