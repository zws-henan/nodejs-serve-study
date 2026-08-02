import crypto from "crypto";

// const result = crypto.createCipheriv();

export const secret = Buffer.from("asdfghjklzxcvbnm");


export function encrypt(secret,str) {
    const iv = crypto.randomBytes(16); // 密码学安全的随机 iv
    const cipher = crypto.createCipheriv("aes-128-cbc", secret, iv);
    let encrypted = cipher.update(str, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + encrypted; // iv 转 hex 再拼接，前 32 位是 iv
}

export function decrypt(secret,signed) {
    const iv = Buffer.from(signed.slice(0, 32), "hex"); // 前 32 位是 iv
    const encrypted = signed.slice(32);                  // 剩下是密文
    const decry = crypto.createDecipheriv("aes-128-cbc", secret, iv);
    let decried = decry.update(encrypted, "hex", "utf-8"); // 用 encrypted，不是 signed
    decried += decry.final("utf-8");
    return decried
}
