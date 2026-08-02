import { errHandeler } from "./getSendResult.js";
export function errorMiddleware(err,req,res,next){
    if(err){
        console.error(err); // 把错误堆栈打印到控制台，方便排查
        res.status(500).send(errHandeler(err));
    }else{
        next();
    }
}