# Cookie / Session / JWT 认证笔记

## 一、Cookie

### 1.1 是什么

Cookie 是**浏览器本地存储**的一小段数据（一般不超过 4KB），由服务器通过 `Set-Cookie` 响应头下发，浏览器保存后**每次请求自动带上**。

```
服务器 → Set-Cookie: name=value; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax
浏览器 → 保存到本地
后续请求 → Cookie: name=value  （自动带上）
```

### 1.2 核心属性

| 属性 | 作用 | 示例 |
|------|------|------|
| `Name=Value` | 键值对 | `token=abc123` |
| `Domain` | 哪个域能读到 | `Domain=localhost` |
| `Path` | 哪个路径下能读到 | `Path=/` |
| `Max-Age` / `Expires` | 过期时间（Max-Age 是秒） | `Max-Age=3600` |
| `Secure` | 只在 HTTPS 下传输 | `Secure` |
| `HttpOnly` | JS 读不到（`document.cookie` 拿不到） | `HttpOnly` |
| `SameSite` | 跨站是否带 cookie | `SameSite=Strict/Lax/None` |

### 1.3 SameSite 三种模式

| 模式 | 行为 | 适用场景 |
|------|------|---------|
| `Strict` | 完全不带（哪怕从别的网站点链接过来也不带） | 严格安全，但体验差 |
| `Lax`（默认） | 只允许导航类 GET 带，fetch/XHR 不带 | 大多数场景的默认选择 |
| `None` | 跨站也带（**必须配合 Secure + HTTPS**） | 第三方 cookie、跨站嵌入 |

### 1.4 优缺点

| 优点 | 缺点 |
|------|------|
| 浏览器自动管理，请求自动带 | 容量小（4KB） |
| 跨请求保持状态简单 | 明文存储（不加密），不能放敏感数据 |
| 可设过期时间 | 受同源策略 + SameSite 限制多 |
| HttpOnly 能防 XSS 偷取 | 移动端 App / 跨域场景麻烦 |

### 1.5 高阶用法

**1. 防止 XSS 偷 cookie**

```js
res.cookie("token", value, {
    httpOnly: true,   // JS 读不到，document.cookie 拿不到
    secure: true,     // 只在 HTTPS 传输
    sameSite: "strict"
});
```

**2. 多级域名共享 cookie**

```
站点：a.example.com、b.example.com
设置 Domain=.example.com → 两个子域都能读到
```

**3. Cookie 前缀（防子域注入）**

- `__Secure-` 前缀：必须配合 Secure
- `__Host-` 前缀：必须 Secure + 不设 Domain + Path=/

### 1.6 应用场景

- 存 session id（配合 session 用）
- 存登录 token（配合 JWT 用）
- 用户偏好设置（主题、语言）
- 跟踪分析（如 `_ga`）

---

## 二、Session

### 2.1 是什么

Session 是**服务器端存储**的会话数据。服务器给每个客户端分配一个唯一 session id，通过 cookie 下发，后续请求靠 id 找回对应数据。

```
第一次请求
  ↓
服务器：创建 session 对象 { loginUser: {...} }
        生成唯一 id: "sess_abc123"
        下发 Set-Cookie: connect.sid=sess_abc123

后续请求（带 cookie）
  ↓
服务器：根据 connect.sid 找到 session 对象 → req.session.loginUser 有值
```

### 2.2 工作原理图

```
浏览器                        服务器
  |                              |
  |--- 请求（无 cookie）-------->| 创建 session，生成 id
  |<-- Set-Cookie: sid=abc -----| sessionStore["abc"] = { loginUser: ... }
  |                              |
  |--- 请求（Cookie: sid=abc）->| 查 sessionStore["abc"] → 找到数据
  |<-- 响应 -------------------|
```

### 2.3 Session 存哪了

| 存储方式 | 说明 | 适用场景 |
|---------|------|---------|
| **MemoryStore**（默认） | 存内存 | 开发学习，**生产环境禁用**（内存泄漏） |
| **Redis**（connect-redis） | 存 Redis | 生产首选，支持多进程共享 |
| **数据库** | 存 MySQL/MongoDB | 需要持久化时 |
| **文件** | 存文件系统 | 简单场景 |

### 2.4 优缺点

| 优点 | 缺点 |
|------|------|
| 数据存服务器，安全 | 占服务器内存/存储 |
| 客户端拿不到敏感数据 | 多服务器需共享 session（粘性 session 或 Redis） |
| 可随时踢人下线（删 session） | 扩展性差（分布式场景麻烦） |
| 实现简单 | 依赖 cookie，移动端/跨域麻烦 |

### 2.5 高阶用法

**1. 生产环境配置（Redis）**

```js
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

const redisClient = createClient({ url: "redis://localhost:6379" });
await redisClient.connect();

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: true,        // HTTPS only
        httpOnly: true,      // 防 XSS
        sameSite: "strict",  // 防 CSRF
        maxAge: 3600 * 1000
    }
}));
```

**2. 主动销毁 session（踢人下线）**

```js
// 退出登录
req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.send("已退出");
});
```

**3. Session 续期（滑动过期）**

```js
// 每次请求都刷新过期时间
app.use((req, res, next) => {
    if (req.session) {
        req.session.touch();  // 续期
    }
    next();
});
```

### 2.6 应用场景

- 传统 Web 应用登录（服务端渲染）
- 需要强制下线的场景
- 单机/小规模应用

---

## 三、JWT（JSON Web Token）

### 3.1 是什么

JWT 是一种**自包含的 token 格式**，把用户信息直接编码进 token 字符串，服务器**不需要存储**，靠签名验证真伪。

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjV9.aBcDeF...
└──── Header ────┘└──── Payload ───┘└─ Signature ─┘
   (算法+类型)     (用户数据+过期)    (防篡改签名)
```

### 3.2 结构

JWT 由三部分用 `.` 连接，都是 Base64URL 编码：

```
Header.Payload.Signature
```

**Header**（头部）：算法和类型
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload**（载荷）：实际数据 + 标准声明
```json
{
    "userId": 5,
    "loginId": "admin",
    "iat": 1690000000,    // 签发时间
    "exp": 1690003600     // 过期时间
}
```

**Signature**（签名）：防篡改
```
HMACSHA256(
    base64(header) + "." + base64(payload),
    secret
)
```

### 3.3 工作流程

```
登录
  ↓
服务器：用 secret 对 {userId, exp} 签名 → 生成 JWT
        返回给客户端（放 cookie 或 authorization 头）

后续请求
  ↓
客户端：带 JWT（Authorization: Bearer xxx）
  ↓
服务器：用同样的 secret 验证签名 → 通过则信任 payload → 不需要查库/查 session
```

### 3.4 优缺点

| 优点 | 缺点 |
|------|------|
| 无状态，服务器不用存 | **签发后无法撤销**（除非维护黑名单） |
| 天然支持分布式/微服务 | payload 是 Base64 不是加密，**不能放敏感数据** |
| 移动端友好（不依赖 cookie） | token 较长，占带宽 |
| 跨域简单（放 header 即可） | 续期麻烦（要么重新签发，要么用 refresh token） |
| 自包含，减少查库 | secret 泄露 = 全部 token 失效 |

### 3.5 高阶用法

**1. 双 Token 机制（Access + Refresh）**

```
Access Token：短期有效（如 15 分钟），放 header
Refresh Token：长期有效（如 7 天），放 httpOnly cookie

流程：
1. 客户端用 Access Token 请求
2. Access Token 过期 → 返回 401
3. 客户端用 Refresh Token 换新的 Access Token
4. Refresh Token 过期 → 重新登录

好处：Access Token 泄露窗口短；Refresh Token 可服务端控制失效
```

**2. JWT 黑名单（主动失效）**

```js
// 虽然 JWT 本身不能撤销，但可以维护一个黑名单
const blacklisted = new Set();  // 生产用 Redis

// 退出登录时
blacklisted.add(token);

// 验证时
if (blacklisted.has(token)) {
    return res.status(401).send("token 已失效");
}
```

**3. Payload 不要放敏感数据**

```js
// ❌ 错误：密码不能放进去
jwt.sign({ userId: 5, password: "123456" }, secret);

// ✅ 正确：只放不敏感的标识
jwt.sign({ userId: 5, role: "admin" }, secret, { expiresIn: "1h" });
```

Payload 只是 Base64 编码，**不是加密**，任何人都能解码看到内容。

### 3.6 应用场景

- 前后端分离 API 认证
- 移动端 App 认证
- 微服务间鉴权
- 跨域单点登录（SSO）
- OAuth 2.0 / OpenID Connect

---

## 四、三者对比

### 4.1 核心区别

| 维度 | Cookie | Session | JWT |
|------|--------|---------|-----|
| **存储位置** | 浏览器 | 服务器 | 客户端（自包含） |
| **状态** | - | 有状态 | 无状态 |
| **数据安全** | 明文，可 HttpOnly | 服务器端，安全 | Base64 可解码，签名防篡改 |
| **容量** | 4KB | 不限（服务器） | 中等（几 KB） |
| **过期控制** | Max-Age/Expires | 服务端删 | exp 声明（难主动撤销） |
| **跨域** | 受 SameSite 限制 | 同 cookie | 放 header，简单 |
| **分布式** | - | 需共享存储 | 天然支持 |
| **踢人下线** | - | ✅ 删 session 即可 | ❌ 需黑名单 |

### 4.2 选型建议

```
你的场景是什么？
│
├─ 传统 Web 应用（服务端渲染）
│   └─ Cookie + Session
│       理由：需要踢人下线、数据安全、同源
│
├─ 前后端分离 / 移动端 API
│   └─ JWT
│       理由：无状态、跨域友好、不依赖 cookie
│
├─ 微服务架构
│   └─ JWT（网关签发，各服务验签）
│       理由：各服务无需共享 session 存储
│
├─ 需要单点登录（SSO）
│   └─ JWT + OAuth 2.0
│       理由：跨域认证标准方案
│
└─ 学习 / 小项目
    └─ Cookie + Session（简单直接）
        或自加密 token（你现在的方案）
```

### 4.3 组合使用

实际项目中常组合使用：

```
JWT + Cookie：
  JWT 放在 httpOnly cookie 里 → 既有 JWT 的无状态，又有 cookie 的自动携带 + HttpOnly 防护

Session + Redis：
  多服务器共享 session 存储 → 解决分布式问题

JWT + Refresh Token：
  Access Token 短期 + Refresh Token 长期 → 安全 + 体验
```

---

## 五、安全要点汇总

### 5.1 常见攻击与防御

| 攻击 | 针对什么 | 防御 |
|------|---------|------|
| **XSS**（跨站脚本） | 偷 cookie | `HttpOnly` + 输入过滤 |
| **CSRF**（跨站请求伪造） | 借 cookie 发请求 | `SameSite=Strict/Lax` + CSRF Token |
| **Session 劫持** | 偷 session id | HTTPS + `Secure` + `HttpOnly` |
| **中间人攻击** | HTTP 明文嗅探 | **HTTPS** |
| **JWT 篡改** | 伪造 payload | 签名验证（强 secret） |
| **重放攻击** | 截获 token 重发 | HTTPS + 短期 token + nonce |

### 5.2 生产环境 Checklist

**Cookie / Session：**
- [ ] `secure: true`（仅 HTTPS）
- [ ] `httpOnly: true`（防 XSS）
- [ ] `sameSite: "strict"` 或 `"lax"`（防 CSRF）
- [ ] secret 从环境变量读取
- [ ] session 存 Redis（不用 MemoryStore）
- [ ] 设置合理过期时间

**JWT：**
- [ ] secret 足够长且从环境变量读取
- [ ] 设置 `exp` 过期时间
- [ ] payload 不放敏感数据
- [ ] 使用 HTTPS
- [ ] 考虑 Refresh Token 机制
- [ ] 关键操作配合黑名单

---

## 六、你当前项目的方案分析

你现在的项目用的是**自加密 token（AES-128-CBC）**，介于 session 和 JWT 之间：

```
登录 → encrypt(secret, userId) → 加密 token（iv + 密文）→ 放 cookie
请求 → decrypt(secret, token) → 解出 userId → 验证身份
```

| 特点 | 说明 |
|------|------|
| 无状态 | 不存 session，靠解密还原 |
| 可加密 | 比 JWT 的 Base64 更安全（JWT payload 可解码） |
| 不能撤销 | 同 JWT，没有黑名单机制 |
| 依赖 secret | secret 泄露 = 全部 token 失效 |

这个方案学习用没问题，生产环境一般会直接用 JWT（标准化、生态好）或 session（可控性强）。

---

## 七、速记口诀

```
Cookie 是容器，存什么由你定
Session 在服务端，踢人最方便
JWT 自包含，无状态跨域强
HTTPS 是底线，不然全白忙
```
