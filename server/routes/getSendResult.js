export function errHandeler(err = "server Internal error",code = 500){
    return {
        code: code,
        msg: err instanceof Error ? err.message : err,
    }
}

export function normalHandeler(data = {}){
    return {
        code: 200,
        msg: "",
        data: data,
    }
}
