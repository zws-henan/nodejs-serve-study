const allowOrigins = [
    "http://127.0.0.1:5502",
    "null"
]

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
        res.header("Access-Control-Allow-Headers", "a,Content-Type");
        // res.send();
    }
    res.header("Access-Control-Allow-Credentials", "true");
    if ("origin" in req.headers && allowOrigins.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    next();
}