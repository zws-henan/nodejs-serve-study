console.log("当前命令行",process.cwd());

setTimeout(() => {
    console.log('setTimeout');
}, 1000);

process.exit(0); // 退出进程，退出码为0,成功退出无错误
// process.exit(1); // 退出进程，退出码为1,失败退出有错误