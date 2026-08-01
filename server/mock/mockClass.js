import Mock from 'mockjs'
import Class from '../models/Class.js'

const result = Mock.mock({
    // "name|3-5":"q",
    // "number|+1":202,
    // "number1|1-100":0
    "datas|16": [
        {   
            "id|+1": 1,
            "name": "前端第 @id 期",
            "openDate": "@date",
        }]
}).datas;
// console.log(result);
Class.bulkCreate(result)