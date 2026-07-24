import URl from "url";

const url = new URL('https://node.org.cn:8080/docs/latest/api/os.html?search=os&version=latest#oseol');

console.log(url);
for (const [key, value] of url.searchParams) {
    console.log(key, value);
}

const obj = {
    href: 'https://node.org.cn:8080/docs/latest/api/os.html?search=os&version=latest#oseol',
    origin: 'https://node.org.cn:8080',
    protocol: 'https:',
    username: '',
    password: '',
    host: 'node.org.cn:8080',
    hostname: 'node.org.cn',
    port: '8080',
    pathname: '/docs/latest/api/os.html',
    search: '?search=os&version=latest',
    hash: '#oseoleeee'
}

console.log(URl.format(obj));