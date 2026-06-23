# Run AFTER creating https://github.com/Cybersorfer/morning-weather (empty repo, no README).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

git remote remove origin 2>$null
git remote add origin https://github.com/Cybersorfer/morning-weather.git
git push -u origin main

Write-Host ""
Write-Host "Next: GitHub repo -> Settings -> Pages -> Deploy from branch 'main' -> folder '/public'" -ForegroundColor Cyan
Write-Host "Stable URL: https://cybersorfer.github.io/morning-weather/" -ForegroundColor Green
Write-Host "Then update WEB_APP_URL in alexa-skill\index.js to that URL." -ForegroundColor Yellow
