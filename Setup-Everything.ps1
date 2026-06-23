# One-shot: local server + free HTTPS tunnel + opens Alexa Developer Console.
# Run while logged into Amazon Developer in your default browser.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$port = 8794
$existing = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $existing) {
  Start-Process -FilePath "node" -ArgumentList "server.mjs" -WorkingDirectory $Root -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

& (Join-Path $Root "scripts\Start-CloudflareTunnel.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$deploy = Get-Content (Join-Path $Root "data\deploy-url.json") -Raw | ConvertFrom-Json
$url = $deploy.url

Write-Host ""
Write-Host "=== COPY THIS INTO ALEXA DEVELOPER CONSOLE (Code tab) ===" -ForegroundColor Yellow
Write-Host "WEB_APP_URL is already set to: $url" -ForegroundColor White
Write-Host ""
Write-Host "Opening Alexa Developer Console..." -ForegroundColor Cyan
Start-Process "https://developer.amazon.com/alexa/console/ask"

Write-Host "Opening live app preview..." -ForegroundColor Cyan
Start-Process $url

Write-Host ""
Write-Host "On the tablet, after skill is saved in Dev mode:" -ForegroundColor Green
Write-Host '  "Alexa, open My Morning Weather"' -ForegroundColor White
