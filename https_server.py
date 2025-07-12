#!/usr/bin/env python3
"""
HTTPS сервер для тестирования GPS на мобильных устройствах
Использует самоподписанный сертификат для обхода ограничения "secure origins"
"""

import http.server
import ssl
import socketserver
import os
from pathlib import Path

class HTTPSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Добавляем заголовки для HTTPS и мобильных устройств
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Заголовки для PWA
        self.send_header('Service-Worker-Allowed', '/')
        super().end_headers()

def create_self_signed_cert():
    """Создает самоподписанный сертификат для HTTPS"""
    try:
        import subprocess
        
        # Проверяем есть ли OpenSSL
        result = subprocess.run(['openssl', 'version'], 
                              capture_output=True, text=True)
        print(f"OpenSSL версия: {result.stdout.strip()}")
        
        # Создаем приватный ключ
        subprocess.run([
            'openssl', 'genrsa', '-out', 'server.key', '2048'
        ], check=True)
        
        # Создаем самоподписанный сертификат
        subprocess.run([
            'openssl', 'req', '-new', '-x509', '-key', 'server.key',
            '-out', 'server.crt', '-days', '365', '-subj',
            '/C=RU/ST=State/L=City/O=DevServer/CN=192.168.2.104'
        ], check=True)
        
        print("✅ Самоподписанный сертификат создан!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка создания сертификата: {e}")
        return False
    except FileNotFoundError:
        print("❌ OpenSSL не найден. Установите OpenSSL.")
        return False

def start_https_server():
    """Запускает HTTPS сервер"""
    PORT = 8443
    
    # Проверяем наличие сертификатов
    if not (Path('server.crt').exists() and Path('server.key').exists()):
        print("🔧 Создаем SSL сертификаты...")
        if not create_self_signed_cert():
            print("❌ Не удалось создать сертификаты")
            return
    
    # Создаем HTTPS сервер
    with socketserver.TCPServer(("", PORT), HTTPSHandler) as httpd:
        # Оборачиваем в SSL
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain('server.crt', 'server.key')
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        
        print(f"""
🚀 HTTPS сервер запущен!

📱 Для мобильного устройства:
   https://192.168.2.104:{PORT}/mobile-gps-fixed.html

⚠️  ВАЖНО: При первом заходе браузер покажет предупреждение о безопасности.
   Нажмите "Дополнительно" → "Перейти на сайт" (или аналогично)
   
🔧 После этого GPS должен заработать!

Для остановки сервера нажмите Ctrl+C
        """)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Сервер остановлен")

if __name__ == "__main__":
    start_https_server()
