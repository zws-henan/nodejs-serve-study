import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import "dayjs/locale/zh-cn.js";  // 必须先 import 语言包，否则 locale 不生效

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");  // 设置全局中文

console.log(dayjs.utc(0).isValid());

// console.log(dayjs().format());

// console.log(dayjs.utc().valueOf());

// console.log(dayjs().valueOf());

// console.log(dayjs(0).format(),+dayjs(0));
// console.log(dayjs.utc(0).format(),+dayjs.utc(0));
const val = "1970-01-01 00:00:00"

// console.log(dayjs(val).format(),+dayjs(val));
// console.log(dayjs.utc(val).format(),+dayjs.utc(val));

// 使用日期令牌，转换
// 令牌是一个格式化的字符串，例如"YYYY-MM-DD HH:mm:ss"
const format = ["YYYY-MM-DD HH:mm:ss", "YYYY-M-D H:m:s"]
// console.log(dayjs("1970-01-01 00:00:00", format,true).format());
// console.log(dayjs("1970-1-1 0:0:0",format,true).format());
// console.log(dayjs(1410715640579).format());
// console.log(dayjs("Wed Jul 29 2026 00:46:41 GMT+0800",format,true).format());
// console.log(dayjs.utc(0, format, true).format());
// 显示（发生在客户端）

// ✅ 解决方案：手写一个支持多 format 的 UTC 解析函数（避开 dayjs 数组 bug）
// 原理：逐个用单个 format 尝试，第一个匹配成功的就返回
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

// 用法：支持多种格式，且都当 UTC 处理
const formats = ["YYYY-MM-DD HH:mm:ss", "YYYY-M-D H:m:s","x"];
const m = parseUTC(0, formats);
console.log(m.local().format("YYYY年MM月DD日 HH:mm:ss"));
// 输出: 2015年01月06日 07:00:00 ✅

const m1 = dayjs("2015-01-05 23:00:00",format,true);

console.log(m1.utc().format());

const m2 = dayjs("2026-01-01 00:00:00", format,true)
console.log(m2.local().fromNow());

// import dayjs from 'dayjs';

// // 解析
// dayjs();                          // 当前时间
// dayjs('2026-07-29');              // 字符串解析
// dayjs(1669500000000);             // 时间戳解析
// dayjs(new Date());                // Date 对象

// // 格式化
// dayjs().format();                 // 默认格式
// dayjs().format('YYYY-MM-DD HH:mm:ss');

// // 获取/设置
// dayjs().year();
// dayjs().month();
// dayjs().date();
// dayjs().day();                    // 星期几
// dayjs().hour();
// dayjs().minute();
// dayjs().second();

// // 操作
// dayjs().add(7, 'day');
// dayjs().subtract(1, 'month');
// dayjs().startOf('month');
// dayjs().endOf('day');

// // 比较
// dayjs().isBefore(dayjs('2026-12-31'));
// dayjs().isAfter(dayjs('2026-01-01'));
// dayjs().isSame(dayjs(), 'day');