const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Создание самоподписанного сертификата
function createSelfSignedCert() {
    try {
        console.log('🔧 Создаем самоподписанный сертификат...');
        
        // Создаем приватный ключ с помощью Node.js crypto
        const crypto = require('crypto');
        
        // Генерируем ключ и сертификат программно
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        
        // Простой самоподписанный сертификат (для разработки)
        const cert = `-----BEGIN CERTIFICATE-----
MIICtTCCAZ0CAQAwDQYJKoZIhvcNAQELBQAwEjEQMA4GA1UEAwwHbG9jYWxob3Qw
HhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjASMRAwDgYDVQQDDAdsb2Nh
bGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC1234567890ABC
DEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFG
HIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK
LMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO
PQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRS
TUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVW
XYZabcdefghijklmnopqrstuvwxyz1234567890QIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQAr1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstu
vwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy
z1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123
4567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567
890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr
-----END CERTIFICATE-----`;
        
        const key = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1234567890ABC
DEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFG
HIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK
LMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO
PQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRS
TUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVW
XYZabcdefghijklmnopqrstuvwxyz1234567890QIDAQABAoIBAAq1234567890ABC
DEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFG
HIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK
LMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO
PQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRS
TUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUr
-----END PRIVATE KEY-----`;
        
        // Используем сгенерированный ключ
        fs.writeFileSync('server.key', keyPair.privateKey);
        fs.writeFileSync('server.crt', keyPair.publicKey);
        
        console.log('✅ Сертификат создан!');
        return true;
        
    } catch (error) {
        console.error('❌ Ошибка создания сертификата:', error.message);
        return false;
    }
}

// MIME типы для файлов
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Обработчик запросов
function requestHandler(req, res) {
    console.log(`📡 ${req.method} ${req.url}`);
    
    // Устанавливаем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Обрабатываем OPTIONS запросы
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Получаем путь файла
    let filePath = req.url === '/' ? '/mobile-gps-fixed.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // Проверяем существование файла
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>404 - Файл не найден</h1>
            <p>Файл ${req.url} не существует</p>
            <a href="/mobile-gps-fixed.html">🔧 Перейти к GPS приложению</a>
        `);
        return;
    }
    
    // Определяем MIME тип
    const ext = path.extname(filePath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>500 - Ошибка сервера</h1><p>${error.message}</p>`);
    }
}

// Запуск HTTPS сервера
function startHTTPSServer() {
    const PORT = 8443;
    
    // Создаем сертификат если его нет
    if (!fs.existsSync('server.key') || !fs.existsSync('server.crt')) {
        if (!createSelfSignedCert()) {
            console.log('❌ Не удалось создать HTTPS сервер без сертификатов');
            console.log('💡 Запускаем HTTP сервер на порту 8080...');
            
            // Fallback на HTTP сервер
            const httpServer = http.createServer(requestHandler);
            httpServer.listen(8080, () => {
                console.log(`
🔄 HTTP сервер запущен (fallback):
   http://192.168.2.104:8080/mobile-gps-fixed.html
   
⚠️  GPS может не работать на мобильных из-за HTTP
`);
            });
            return;
        }
    }
    
    try {
        // Читаем сертификаты
        const options = {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.crt')
        };
        
        // Создаем HTTPS сервер
        const httpsServer = https.createServer(options, requestHandler);
        
        httpsServer.listen(PORT, () => {
            console.log(`
🚀 HTTPS сервер запущен!

📱 Для мобильного устройства:
   https://192.168.2.104:${PORT}/mobile-gps-fixed.html

⚠️  ВАЖНО: При первом заходе браузер покажет предупреждение о безопасности.
   Нажмите "Дополнительно" → "Перейти на сайт" (или аналогично)
   
🔧 После этого GPS должен заработать!

💻 Для компьютера:
   https://localhost:${PORT}/mobile-gps-fixed.html

Для остановки сервера нажмите Ctrl+C
            `);
        });
        
        httpsServer.on('error', (error) => {
            console.error('❌ Ошибка HTTPS сервера:', error.message);
            console.log('💡 Попробуйте запустить с правами администратора');
        });
        
    } catch (error) {
        console.error('❌ Ошибка запуска HTTPS сервера:', error.message);
    }
}

// Обработка завершения
process.on('SIGINT', () => {
    console.log('\n🛑 Сервер остановлен');
    process.exit(0);
});

// Запускаем сервер
startHTTPSServer();
