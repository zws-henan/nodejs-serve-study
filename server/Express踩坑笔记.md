# Express 开发高频踩坑笔记

> 本笔记收集课程项目中真实踩到过的坑，每个坑都包含错误写法、正确写法、原因分析。随时补充，随时翻看。

---

## 一、路由与匹配类

### 坑 1：静态路由被动态参数路由覆盖 ❗

**表现**：请求 `/whoami` 却走到了 `/:id` 的处理函数，拿字符串 "whoami" 当 id 去查库 → 报错。

**错误写法**（静态路由放 **后面**）：
```js
adminRouter.get("/:id", handler1);   // 动态参数路由先匹配
adminRouter.get("/whoami", handler2); // 永远走不到
```

**正确写法**（静态路由放 **前面**）：
```js
adminRouter.get("/whoami", handler2); // 先匹配静态
adminRouter.get("/:id", handler1);    // 其他路径才交给动态
```

**进阶：只想让 `/:id` 匹配数字**：
```js
adminRouter.get("/:id(\\d+)", handler1); // id 必须是纯数字，whoami 匹配不上
```

**原因**：Express 路由按**定义顺序**匹配，找到第一个匹配就停，不会找"最精确"的。`/:id` 的匹配规则是 `[^/]+`（除 `/` 外任意字符），字母、中文都能匹配。

---

### 坑 2：子路由重复写前缀

**表现**：404，接口永远匹配不上。

**错误写法**：
```js
// 父级
app.use("/api/admin", adminRouter);

// 子级 adminRouter 里又写一遍前缀
adminRouter.get("/api/admin/whoami", ...); // 实际路径变成 /api/admin/api/admin/whoami
```

**正确写法**：
```js
// 父级
app.use("/api/admin", adminRouter);

// 子级只写后缀
adminRouter.get("/whoami", ...); // 实际路径 /api/admin/whoami ✅
```

---

### 坑 3：path-to-regexp v8 API 变更

**表现**：`reg.test is not a function`。

**错误写法**（v6 语法）：
```js
import { pathToRegexp } from "path-to-regexp";
const reg = pathToRegexp("/api/student/:id");
if (reg.test(req.path)) { ... } // ❌ v8 不再直接返回 RegExp
```

**正确写法**（v8 语法）：
```js
import { match } from "path-to-regexp";
const matcher = match("/api/student/:id"); // 预编译
if (!!matcher(req.path)) { ... }           // 函数式调用，返回 {params} 或 false
```

---

## 二、Cookie / Session / Token 类

### 坑 4：localhost 和 127.0.0.1 跨源 ❗

**表现**：服务器存了 session，下一个请求 `req.session.loginUser` 是空的。

**原因**：浏览器同源判定只看**字符串完全一致**，不做 DNS 解析。

| 页面地址 | 请求地址 | 是否同源 |
|---|---|---|
| `http://localhost:9527` | `http://localhost:9527` | ✅ 同源 |
| `http://localhost:9527` | `http://127.0.0.1:9527` | ❌ 跨源！虽然指向同一台机 |
| `http://localhost:9527` | `http://localhost:9528` | ❌ 跨源 |

跨源时 `SameSite=Lax`（session cookie 默认），fetch 请求**不带 cookie** → session 丢失。

**正确做法**：前端 fetch 用**相对路径**，自动同源：
```js
fetch("/api/admin/login")           // ✅ 相对路径，自动用页面所在源
fetch("http://127.0.0.1:9527/...") // ❌ 页面如果是 localhost 打开就跨源
```

---

### 坑 5：fetch 不加 `credentials: "include"` ❗

**表现**：登录响应下发了 `Set-Cookie`，但后续请求不自动带 cookie。

**错误写法**：
```js
fetch("/api/admin/login", { method: "post", ... }); // 浏览器可能不带/不收 cookie
```

**正确写法**（即使是同源也建议加，更保险）：
```js
fetch("/api/admin/login", {
    method: "post",
    credentials: "include", // ✅ 带 cookie，存 cookie
    ...
})
```

配合服务端 CORS：
```js
cors({ credentials: true })
```

---

### 坑 6：Cookie domain 设置不匹配

**表现**：APIFOX 登录成功后，cookie 没保存下来。

**错误写法**：
```js
// APIFOX 请求的是 http://127.0.0.1:9527
res.cookie("token", value, { domain: "localhost", ... });
// domain=localhost 跟请求源 127.0.0.1 不匹配 → 浏览器拒收 cookie
```

**正确做法**：开发阶段**省略 domain**，默认匹配当前请求的源，最省心：
```js
res.cookie("token", value, { path: "/", maxAge: 3600 * 1000 });
```

---

### 坑 7：加密 token 的 iv 处理

**表现 1**：`ERR_INVALID_CHAR: Invalid character in header content ["authorization"]`
**原因**：Buffer 做字符串拼接时默认 `toString("utf-8")` 产生乱码：
```js
const iv = crypto.randomBytes(16);
return iv + encrypted;           // ❌ iv 是 Buffer，+ 运算符隐式 utf-8 解码
return iv.toString("hex") + encrypted; // ✅ 明确转 hex，纯 0-9a-f
```

**表现 2**：解密必炸 `bad decrypt`
**原因 1**：iv 长度切错（`slice(0, 16)` 是字符数，16 hex 字符只对应 8 字节 iv）：
```js
// iv 是 16 字节 randomBytes → 转 hex 变 32 个字符
const iv = signed.slice(0, 32);  // ✅ 32 个 hex 字符 = 16 字节
const iv = signed.slice(0, 16);  // ❌ 8 字节，长度不够
```
**原因 2**：解密 update 用了整个 signed（包含 iv）：
```js
decry.update(signed, "hex");        // ❌ 把 iv 也当密文解
decry.update(encrypted, "hex");     // ✅ 先切掉 iv
```

**原因 3**：encrypt 把 number 直接喂给 cipher：
```js
cipher.update(userId, "utf-8");        // ❌ userId 是 number，非 string/buffer
cipher.update(String(userId), "utf-8"); // ✅ 类型正确
```

---

### 坑 8：verify(req) / verify(res) 参数写反

**表现**：`Cannot read properties of undefined (reading 'token')`

**错误写法**：
```js
// 定义
function verify(res) {
    token = res.cookies["token"]; // ❌ res 是响应对象，没有 cookies
}
// 调用
verify(res); // ❌ 传的是响应对象
```

**正确写法**（口诀：**请求来的找 req，响应回去的找 res**）：
```js
function verify(req) {
    token = req.cookies["token"];         // ✅ cookies 在请求对象上
    token = req.headers.authorization;    // ✅ 请求头也在 req 上
}
verify(req); // ✅ 传请求对象
```

| 属性 | 属于 req 还是 res？ |
|---|---|
| cookies, headers, body, query, params | **req**（请求来的） |
| cookie(), header(), send(), status() | **res**（响应回去的） |

---

## 三、中间件类

### 坑 9：中间件顺序不对 ❗

**表现 1**：静态资源 404 → `express.static` 放得太靠后，先被权限中间件拦了。
**正确顺序**：static 尽量靠前：
```js
app.use(express.static(staticPath));   // 先让静态资源直接走
app.use(tokenHandel);                  // 再鉴权
app.use("/api/student", studentRouter); // 再路由
```

**表现 2**：req.body 是 undefined → 忘了挂 `express.json()` 或者挂在路由后面。
**正确顺序**：body 解析中间件要**在路由之前**：
```js
app.use(express.json());                // ← 先解析 body
app.use("/api/admin", adminRouter);     // ← 路由才能拿到 req.body
```

**表现 3**：错误中间件没收到错误 → 路由处理函数没 `next(err)` 或 `try/catch` 里没传，或者错误中间件写在路由之前。
**正确顺序**：错误中间件永远**在所有路由之后**：
```js
app.use(studentRouter);
app.use(adminRouter);
app.use(errorMiddleware);               // ← 最后一位，四个参数 (err,req,res,next)
```

---

### 坑 10：错误中间件吞错误

**表现**：语法或运行时异常只返回 `{code:500, msg:{}}`，控制台啥也不打印。

**错误写法**：
```js
app.use((err, req, res, next) => {
    res.send({ code: 500, msg: JSON.stringify(err) }); // ❌ Error 对象序列化出来是 {}
});
```

**原因**：JS 里 `Error` 的 `message`、`stack` 都是 `enumerable: false`，`JSON.stringify` 会跳过它们。

**正确写法**：
```js
app.use((err, req, res, next) => {
    console.error(err); // ✅ 先把错误堆栈打印到控制台
    res.status(err.status || 500).send({
        code: err.status || 500,
        msg: err instanceof Error ? err.message : err // ✅ 取 message
    });
});
```

---

### 坑 11：同源请求被 CORS 中间件拦截

**表现**：同源的请求也返回 `Not Allowed by CORS`。

**原因**：同源请求浏览器**不会发送 Origin 头**，`origin` 是 `undefined`。白名单里没有 `"undefined"` 字符串，于是拦截。

**正确写法**：
```js
origin(origin, callBack) {
    if (!origin || whiteList.includes(origin)) { // ✅ !origin 放行同源/服务器间请求
        callBack(null, true);
    } else {
        callBack(new Error("Not Allowed"));
    }
}
```

---

### 坑 12：nodemon watch 只看根目录

**表现**：改了 `routes/api/admin.js` 代码不生效，console.log 没反应，以为中间件"完全不执行"。实际是 nodemon 没检测到文件变更，一直跑旧代码。

**错误 nodemon.json**：
```json
{ "watch": ["*.js"] } // ❌ 只看根目录的 js，子目录不看
```

**正确 nodemon.json**：
```json
{ "watch": ["**/*.js"] } // ✅ 递归所有子目录
```

---

## 四、Nodemon / 启动类

### 坑 13：修改了代码但服务没重启

就是坑 12，把 nodemon watch 改成 `**/*.js` 即可。判断技巧：改完代码看终端有没有打印 `restarting due to changes...`。没有就是没重启，还在跑旧代码。

---

## 五、安全常识类

### 坑 14：HTTP 下 session id 会被中间人窃取

没有 HTTPS 时，所有请求头包括 `Cookie: connect.sid=xxx` 都是**明文传输**。公共 WiFi 下用 Wireshark 就能抓到，别人拿这个 cookie 就能冒充你登录（Session Hijacking）。

**防护**（生产环境必配）：
```js
session({
    secret: "...",
    cookie: {
        secure: true,        // 只在 HTTPS 下传
        httpOnly: true,      // JS 读不到（防 XSS 偷）
        sameSite: "strict",  // 跨站不带（防 CSRF）
        maxAge: 3600 * 1000
    }
})
```

学习阶段本机 `http://localhost` 可以不配 `secure: true`（没证书），但**这个概念一定要知道**。

---

## 六、调试技巧（最快定位坑的办法）

1. **路由匹配不清** → 每个可疑路由处理函数开头加 `console.log("我是XX路由")`，看哪条被打出来。
2. **中间件顺序存疑** → 在关键位置（static 前/后，token 前/后，error 前）打印 `req.path` 和 `req.method`，看请求实际走到哪。
3. **请求参数不对** → 打印完整 `req.query`、`req.body`、`req.params`，不要猜。
4. **cookie/session 异常** → 打印 `req.cookies` 和 `req.session`，看浏览器 Network 面板里 `Cookie` 请求头和 `Set-Cookie` 响应头。
5. **接口 500 空内容** → 检查错误中间件是否打印了 `err.stack`，没打印就加。
6. **怀疑"新代码不生效"** → 看终端 nodemon 有没有 restart，没有就是 watch 配置不对。

---

## 速查对照表

| 错误信息 | 大概率原因 | 解决章节 |
|---|---|---|
| `Cannot read properties of undefined (reading 'token')` | verify(req/res) 参数写反 | 二、坑 8 |
| `ERR_INVALID_CHAR in header content` | iv 没转 hex 就拼字符串 | 二、坑 7 |
| `bad decrypt` / `ERR_OSSL_BAD_DECRYPT` | iv 长度切错或 decrypt 输错数据 | 二、坑 7 |
| `reg.test is not a function` | path-to-regexp v8 用法按 v6 写了 | 一、坑 3 |
| session 为空、登录状态丢 | 跨源（localhost/127.0.0.1） | 二、坑 4 |
| fetch 不带 cookie | 没加 credentials:"include" | 二、坑 5 |
| whoami 请求跑到 getAdminById | 静态路由放动态路由后面 | 一、坑 1 |
| 改代码后控制台没反应 | nodemon 只看了根目录，子目录没 watch | 三、坑 12 |
| 语法异常只返回空 500 | 错误中间件没 console.error + JSON.stringify(Error) | 三、坑 10 |
| 同源请求被 CORS 拦 | 没处理 origin=undefined 的情况 | 三、坑 11 |
