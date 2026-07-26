// 导入 mysql2 的 Promise API（异步方式），支持 async/await 语法
import mysql from 'mysql2/promise';

// 创建与 MySQL 数据库的连接
// 使用 await 等待连接建立完成
const connection = await mysql.createConnection({
    host: 'localhost',      // 数据库服务器地址（本地）
    user: 'root',           // 数据库用户名
    database: 'test',       // 要连接的数据库名称
    password: '123456',    // 数据库密码
});

// ==================== 查询操作（SELECT） ====================
// 执行一个简单的查询，从 user 表中获取所有记录
try {
    // query 方法返回一个数组，第一个元素是查询结果（rows），第二个是字段元数据
    const [results, fields] = await connection.query(
        'SELECT * FROM `user`'   // SQL 查询语句，查询 user 表所有数据
    );

    console.log(results); // 打印查询到的数据行（数组形式）
    console.log(fields);  // 打印字段信息（列名、数据类型等元数据）
} catch (err) {
    // 如果查询出错，捕获并打印错误信息
    console.log(err);
}

// ==================== 插入操作（INSERT）- 已注释 ====================
// 定义要插入的数据（通过变量存储，便于维护）
// const name = 'abc';
// const location = 'beijing';

// try {
//     // 使用参数化查询（占位符 ?），防止 SQL 注入攻击
//     // 第二个参数是数组，按顺序对应占位符的值
//     // curdate() 是 MySQL 内置函数，返回当前日期，不需要加引号
//     const [results] = await connection.query(
//         'insert into `company`(`name`, `location`, `buildDate`) values (?, ?, curdate())',
//         [name, location]   // 参数数组：name 对应第一个 ?, location 对应第二个 ?
//     );
//     console.log(results); // 打印插入结果（包含影响行数、插入的 ID 等）
// } catch (error) {
//     // 如果插入失败，捕获并打印错误信息
//     console.log(error);
// }

// ==================== 更新操作（UPDATE） ====================
// 定义要更新的数据
// const name = 'syj';   // 新的公司名称
// const id = 4;         // 要更新的记录 ID

// try {
//     // 使用参数化查询执行更新操作
//     // set `name` = ? 将 name 字段设为参数值
//     // where `id` = ? 指定更新条件（只更新 id 为指定值的记录）
//     const [results] = await connection.query(
//         'update `company` set `name` = ? where `id` = ?',
//         [name, id]   // 参数数组：name 对应第一个 ?, id 对应第二个 ?
//     );
//     console.log(results); // 打印更新结果（包含影响行数等）
// } catch (error) {
//     // 如果更新失败，捕获并打印错误信息
//     console.log(error);
// }

// ==================== 删除操作（DELETE） ====================
// 定义要删除的记录 ID
const id = 4;

// 执行删除操作
try {
    // 使用参数化查询删除记录
    const [results] = await connection.query(
        'delete from `company` where `id` = ?',
        [id]   // 参数数组：id 对应占位符 ?
    );
    console.log(results); // 打印删除结果（包含影响行数等）
} catch (error) {
    // 如果删除失败，捕获并打印错误信息
    console.log(error); // 打印错误信息
}

// ==================== 关闭连接 ====================
// 关闭与数据库的连接，释放资源
connection.end();

// ==================== 参数化查询示例（已注释） ====================
// 使用占位符（?）进行参数化查询，这是最安全的数据库操作方式
// try {
//   // 查询 table 表中 name 等于 Page 且 age 大于 45 的记录
//   // 使用 ? 作为占位符，避免直接拼接 SQL 字符串
//   const [results] = await connection.query(
//     'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
//     ['Page', 45]  // 参数数组，按顺序替换占位符
//   );

//   console.log(results); // 打印查询结果
// } catch (err) {
//   console.log(err); // 捕获并打印错误
// }
