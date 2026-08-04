import jwt from "jsonwebtoken"

const cookieKey = "token"
const secret = "zws"
export function publish(res, maxAge = 3600 * 24, info = {}) {
    const token = jwt.sign(info, secret, {
        expiresIn: maxAge,
    })
    res.cookie(cookieKey, token, {
        path: "/",
        maxAge: maxAge * 1000,
    })
    res.header("authorization", token)
}

export function verify(req) {
    let token;
    token = req.cookies[cookieKey]
    if (!token) {
        token = req.headers.authorization
        if (!token) {
            return null
        }
        token = token.split(" ");
        token = token.length === 1 ? token[0] : token[1]
    }

    try {
        const result = jwt.verify(token, secret)
        return result
    } catch (err) {
        return null
    }
}