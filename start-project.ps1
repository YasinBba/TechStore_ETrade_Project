$BackendPath = "src/TechStore.API"
$FrontendPath = "techstore-frontend"

Write-Host "🚀 TechStore Başlatılıyor..." -ForegroundColor Green

# Start Backend
Write-Host "📂 Backend (API) başlatılıyor..." -ForegroundColor Cyan
Start-Process dotnet -ArgumentList "run --project $BackendPath" -WorkingDirectory . -NoNewWindow
Write-Host "✅ Backend komutu gönderildi (5260 portunda çalışacak)" -ForegroundColor Green

# Wait a bit for backend
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "📂 Frontend (React) başlatılıyor..." -ForegroundColor Cyan
Start-Process npm -ArgumentList "run dev" -WorkingDirectory $FrontendPath -NoNewWindow
Write-Host "✅ Frontend komutu gönderildi" -ForegroundColor Green

Write-Host "🎉 Proje çalışıyor! Tarayıcınızda http://localhost:5173 adresine gidebilirsiniz." -ForegroundColor Yellow
Write-Host "⚠️ Not: Durdurmak için terminali kapatın veya Ctrl+C kullanın." -ForegroundColor Gray
