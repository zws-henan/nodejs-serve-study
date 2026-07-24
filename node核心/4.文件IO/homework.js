import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 文件/目录详情类
 */
class fileDetial {
    /**
     * 构造函数
     * @param {string} MyPath - 文件/目录路径
     * @param {fs.Stats} statData - 文件状态信息
     */
    constructor(MyPath, statData) {
        this._path = path.resolve(__dirname, MyPath);
        this.name = path.basename(this._path);
        this.ext = path.extname(this._path);
        this.isFile = statData.isFile();
        this.size = statData.size;
        this.createTime = new Date(statData.birthtimeMs);
        this.updateTime = new Date(statData.mtimeMs);
    }

    /**
     * 静态工厂方法，异步创建文件详情实例
     * @param {string} MyPath - 文件/目录路径
     * @returns {Promise<fileDetial>} 文件详情实例
     */
    static async create(MyPath) {
        const statData = await fs.promises.stat(path.resolve(__dirname, MyPath));
        return new fileDetial(MyPath, statData);
    }

    /**
     * 获取子文件/子目录列表
     * @returns {Promise<fileDetial[]>} 子项列表
     */
    async getChildren() {
        if (this.isFile) {
            return [];
        }
        const result = await fs.promises.readdir(this._path);
        const children = await Promise.all(
            result.map(file => fileDetial.create(path.resolve(this._path, file)))
        );
        return children;
    }

    /**
     * 读取文件内容（仅文件有效）
     * @returns {Promise<string|undefined>} 文件内容，目录返回 undefined
     */
    async getContent() {
        if (!this.isFile) return;
        return fs.promises.readFile(this._path, 'utf-8');
    }
}

/**
 * 检查文件/目录是否存在
 * @param {string} mypath - 文件/目录路径
 * @returns {Promise<string|Error>} 存在状态描述或错误对象
 */
async function exist(mypath) {
    return fs.promises.stat(path.resolve(__dirname, mypath))
        .then(data => {
            return data.isDirectory() ? '文件夹存在' : '文件存在';
        })
        .catch(err => {
            return err.code === 'ENOENT' ? '文件或文件夹不存在' : err;
        });
}

/**
 * 递归获取目录树结构
 * @param {fileDetial} File - 文件/目录详情实例
 * @param {fileDetial[]} arr - 用于收集结果的数组
 * @returns {Promise<fileDetial[]>} 包含完整目录树的数组
 */
async function getArr(File, arr) {
    if (File.isFile) {
        arr.push(File);
        return arr;
    }
    const files = await File.getChildren();
    for (const file of files) {
        if (file.isFile) {
            arr.push(file);
        } else {
            arr.push(file);
            file.children = await getArr(file, []);
        }
    }
    return arr;
}


const resp = await fileDetial.create(path.resolve(__dirname, './files'));
getArr(resp, []).then(result => {
    console.log(result);
});