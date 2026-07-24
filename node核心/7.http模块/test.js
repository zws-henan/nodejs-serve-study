import http from 'http';

const server = http.createServer((req, res) => {
    console.log(`\n=== ${new Date().toLocaleTimeString()} ===`);
    console.log(`请求方法: ${req.method}`);
    console.log(`请求路径: ${req.url}`);
    console.log(`User-Agent: ${req.headers['user-agent']}`);
    console.log(`Accept: ${req.headers['accept']}`);
    console.log(`Host: ${req.headers['host']}`);
    console.log(`远程地址: ${req.connection.remoteAddress}:${req.connection.remotePort}`);
    
    if (req.url === '/favicon.ico') {
        console.log('→ 返回空响应 (favicon.ico)');
        res.writeHead(204);
        res.end();
        return;
    }
    
    console.log('→ 返回 200 OK');
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end('<h1>Hello World!</h1><p>测试页面</p>');
});

server.on('error', (err) => {
    console.error('服务器错误:', err.message);
});

server.listen(6666, '0.0.0.0', () => {
    const addr = server.address();
    console.log(`服务器已启动，监听在 ${addr.address}:${addr.port}`);
    console.log('请用浏览器访问: http://localhost:6666');
    console.log('请用Apifox访问: http://127.0.0.1:6666');
});