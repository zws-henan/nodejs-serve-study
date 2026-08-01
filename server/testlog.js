import log from "log4js"
import path from "path"
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
log.configure({
    appenders: {
        sql: {
            type: "file",
            filename: path.resolve(__dirname, "./logs/sql/logging.log"),
            // maxLogSize:1024,
            pattern:"yyyy-MM-dd",
            alwaysIncludePattern:true,
            keepFileExt:true,
            daysToKeep:7, // 无保留日志文件，即不保留日志备份文件。默认是1
            layout:{
                type:"pattern",
                pattern:"%c [%d{yyyy-MM-dd hh:mm:ss}] [%p]: %m%n"
            }
        },
        default:{
            type:"stdout"
        }
    },
    categories: {
        sql: {
            appenders: ["sql"],
            level: "all"
        },
        default:{
            appenders:["default"],
            level:"all"
        }
    }
})

process.on("exit",()=>{
    log.shutdown()
})

export const sqlLogger = log.getLogger("sql");
export const defaultLogger = log.getLogger();



// const logger = log.getLogger("sql")
// setInterval(()=>{
//     logger.info("aaa")    
// },100)
// // logger.level = "all"

// // logger.info(" Abc")