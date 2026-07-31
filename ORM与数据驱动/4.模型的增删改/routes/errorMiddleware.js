export function errorMiddleware(err,req,res,next){
    if(err){
        res.send({
            code:500,
            msg:err instanceof Error ? err.message : err.stack
        });
    }else{
        next();
    }
}