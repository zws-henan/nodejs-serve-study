import util from "util";

async function awaitTime(delay){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('time end');
        }, delay);
    })
}

const callbackify = util.callbackify(awaitTime);

function myCallbackify(fn){
    return async (...arg) => {
        const tempFn = arg[arg.length - 1];
        try {
            const res = await fn(...arg);
            tempFn(null, res);
        } catch (error) {
            tempFn(error, null);
        }
        
    }
}

const myCallbackifyFn = myCallbackify(awaitTime);

myCallbackifyFn(3000, (err, res) => {
    console.log(err, res, 'myCallbackifyFn');
})



callbackify(3000, (err, res) => {
    console.log(err, res);
})



awaitTime(1000).then(res => {
    console.log(res);
})