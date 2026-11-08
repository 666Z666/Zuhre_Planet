@echo off
echo [*] KAPTAN INFAZ PROTOKOLU: Zuhre Planet Canliya Aliniyor...
echo.

echo [1/3] Statik Eserler Derleniyor (pnpm build)...
call pnpm run build
if %errorlevel% neq 0 (
    echo [HATA] Build isleminde sorun cikti. Ciktiyi kontrol ediniz!
    exit /b %errorlevel%
)
echo [+] Build basarili. Islem tamam.
echo.

echo [2/3] Docker Altyapisi Sifirlaniyor ve Insa Ediliyor...
call docker-compose -f docker-compose.prod.yml down
call docker-compose -f docker-compose.prod.yml up -d --build
if %errorlevel% neq 0 (
    echo [HATA] Docker konteynerleri ayaga kalkamadi.
    exit /b %errorlevel%
)
echo [+] Docker Containers kusursuz durumda.
echo.

echo [3/3] GOREV TAMAMLANDI!
echo Nginx: http://localhost:80 adresinde aktif.
echo Lutfen basariyla bitince Gemini Ajanina "Hazir" onayini verin.
pause
