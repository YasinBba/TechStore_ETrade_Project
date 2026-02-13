@echo off
echo ==========================================
echo TEKNIK KONTROL BASLIYOR
echo ==========================================

echo [1/4] Dotnet Kontrolu:
dotnet --version
if %errorlevel% neq 0 (
    echo [HATA] Dotnet yuklu degil veya calismiyor!
) else (
    echo [OK] Dotnet Sürümü Bulundu.
)
echo.

echo [2/4] Node/NPM Kontrolu:
call npm -v
if %errorlevel% neq 0 (
    echo [HATA] Node/NPM yuklu degil!
) else (
    echo [OK] NPM Sürümü Bulundu.
)
echo.

echo [3/4] Backend Derleme Kontrolu:
cd src/TechStore.API
call dotnet build
if %errorlevel% neq 0 (
    echo [HATA] Backend derlenemedi!
) else (
    echo [OK] Backend derlendi.
)
cd ../..
echo.

echo [4/4] Frontend Paket Kontrolu:
cd techstore-frontend
if not exist "node_modules" (
    echo [UYARI] node_modules klasoru yok, kurulum yapiliyor...
    call npm install
)
echo [OK] Frontend klasoru mevcut.
cd ..
echo.

echo ==========================================
echo KONTROL TAMAMLANDI
echo Lutfen yukaridaki kirmizi hata mesajlarini okuyun.
echo Pencere kapanmamasi icin asagiya pause eklendi.
echo ==========================================
pause
