import { errHandeler } from "./getSendResult.js";
export function errorMiddleware(err,req,res,next){
    if(err){
        const error = err;
        // console.log(error instanceof Error);
        res.status(500).send(errHandeler(error));
    }else{
        next();
    }
}