import {errHandeler} from "./getSendResult.js"
import {match} from "path-to-regexp"
import {decrypt, secret} from "../util/crypt.js"

// 预编译匹配器：启动时只编译一次，避免每次请求都重新生成正则
const config = [
    {method:"POST", path:"/api/student", matcher: match("/api/student")},
    {method:"PUT", path:"/api/student/:id", matcher: match("/api/student/:id")}
]

export function tokenHandel(req,res,next){
    const result  = config.filter((api) => {
        return !!api.matcher(req.path) && api.method === req.method;
    })
    if(result.length === 0){
        next();
        return
    }
    let token = req.cookies.token;
    if(!token){
        token = req.headers.authorization;
    }
    if(!token){
        res.status(403).send(errHandeler("token不存在",403));
        return
    }
    try {
        const userId = decrypt(secret, token); // 解密失败会抛 bad decrypt
        req.userId = userId; // 挂到 req 上，后续接口可直接用
        // console.log(userId);
        
        next();
    } catch {
        res.status(403).send(errHandeler("token无效或已篡改",403));
    }
}
