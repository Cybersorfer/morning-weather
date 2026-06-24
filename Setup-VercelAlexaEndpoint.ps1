# Opens Vercel import for free HTTPS Alexa backend (no AWS).
$ErrorActionPreference = "Stop"
Write-Host ""
Write-Host "=== No AWS needed — use HTTPS endpoint ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Vercel opens — click Import for repo: Cybersorfer/morning-weather" -ForegroundColor Yellow
Write-Host "2. Click Deploy (defaults are fine)" -ForegroundColor Yellow
Write-Host "3. Copy your URL, e.g. https://morning-weather-xxx.vercel.app" -ForegroundColor Yellow
Write-Host "4. Alexa Console -> Build -> Endpoint -> HTTPS" -ForegroundColor Yellow
Write-Host "   URL: https://YOUR-APP.vercel.app/api/alexa" -ForegroundColor Green
Write-Host "   SSL: My skill is hosted on a subdomain..." -ForegroundColor Yellow
Write-Host "5. Save -> Test: open my morning weather" -ForegroundColor Yellow
Write-Host ""
Start-Process "https://vercel.com/new/clone?repository-url=https://github.com/Cybersorfer/morning-weather"
Start-Process "https://developer.amazon.com/alexa/console/ask"
