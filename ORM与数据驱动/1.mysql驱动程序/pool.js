// 创建连接池
import mysql from 'mysql2';
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test',
    connectionLimit: 10,
    queueLimit: 0
});

// 使用连接池
try {
    const [results] = await pool.promise().query('SELECT * FROM `user`');
    console.log(results);
    // 关闭连接池
    pool.end();
} catch (err) {
    console.log(err);
}

