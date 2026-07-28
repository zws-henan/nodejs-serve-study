import Mock from 'mockjs'
import Book from '../models/Book.js'

const result = Mock.mock({
    "datas|50-60": [
        {
            "name": "@cword(3,7)",
            "imgUrl": function () {
                return "https://picsum.photos/115/172?random=" + Math.random()
            },
            "publicDate": "@date()",
            author:"@cname(2,3)",
        }
    ]
}).datas

// console.log(result);

Book.bulkCreate(result)
