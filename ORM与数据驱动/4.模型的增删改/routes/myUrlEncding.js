import qs from "querystring"
export default function (req,res,next){
    if(req.headers["content-type"]==="application/x-www-form-urlencoded"){
        let str = ""
        req.on("data",(chunk) => {
            str += chunk.toString("utf-8");
        })
        req.on("end",() => {
            const result = qs.parse(str);
            req.body = result;
            next()
        })
    }else{
        next();
    }
}