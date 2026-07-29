import validate from "validate.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";  // 必须引入，否则 format 参数无效

dayjs.extend(utc);
dayjs.extend(customParseFormat);  // 必须注册，严格模式才能生效

function parseUTC(str, formats, strict = true) {
    let d
    for (const fmt of formats) {
        if (fmt === "x" || fmt === "X") {
            d = dayjs.utc(str)
        } else {
            d = dayjs.utc(str, fmt, strict);
        }
        if (d.isValid()) return d;
    }
    return dayjs(null);  // 全都不匹配，返回 Invalid Date
}

validate.extend(validate.validators.datetime, {
    /**
     * 解析日期时间
     * @description: 解析日期时间字符串为时间戳
     * @param {*} value 日期时间字符串
     * @param {*} options 针对某个属性的验证配置
     */
    parse(value, options) {
        // // 如果已经是数字时间戳，直接返回（earliest/latest 就是数字）
        // if (typeof value === "number") {
        //     return value;
        // }
        // // 如果是字符串形式的数字，也直接当时间戳处理
        // if (typeof value === "string" && /^\d+$/.test(value)) {
        //     return parseInt(value);
        // }
        // 否则按 format 解析字符串
        let formats = ["YYYY-MM-DD HH:mm:ss", "YYYY-M-D H:m:s","x"];
        if (options.dateOnly) {
            formats = ["YYYY-MM-DD", "YYYY-M-D","x"]
        }
        return parseUTC(value, formats).valueOf();
    },
    /**
     * 用于显示错误消息时，使用的显示字符串
     * @param {*} value 
     * @param {*} options 
     */
    format(value, options) {
        let format = "YYYY-MM-DD";
        if(!options.dateOnly){
            format += " HH:mm:ss"
        }
        return dayjs.utc(value).format(format);
    }
})