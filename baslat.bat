@echo off
echo ==========================================
echo TechStore Baslatiliyor...
echo ==========================================

REM Backend'i yeni pencerede baslat
echo Backend (API) baslatiliyor...
start "TechStore API" cmd /k "cd src/TechStore.API && dotnet run"

REM Kisa bir bekleme (API'nin ayaga kalkmasi icin)
timeout /t 5

REM Frontend'i yeni pencerede baslat
echo Frontend (React) baslatiliyor...
start "TechStore Frontend" cmd /k "cd techstore-frontend && npm run dev"

echo ==========================================
echo Proje baslatildi!
echo Tarayicinizda http://localhost:5173 adresine gidin.
echo Durdurmak icin acilan pencereleri kapatin.
echo ==========================================
pause
