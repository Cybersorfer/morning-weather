# Waits for GitHub repo, then pushes and prints Pages URL.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "Waiting for https://github.com/Cybersorfer/morning-weather ..." -ForegroundColor Cyan
Write-Host "Create it on GitHub (empty, no README) if you have not yet." -ForegroundColor Yellow

for ($i = 0; $i -lt 60; $i++) {
  try {
    $r = Invoke-WebRequest -Uri "https://github.com/Cybersorfer/morning-weather" -Method Head -UseBasicParsing -ErrorAction Stop
    if ($r.StatusCode -eq 200) { break }
  } catch {
    Start-Sleep -Seconds 2
  }
  if ($i -eq 59) { throw "Repo not found after 2 minutes" }
}

git push -u origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$pagesUrl = "https://cybersorfer.github.io/morning-weather/"
Write-Host ""
Write-Host "Pushed! Enable Pages: repo Settings -> Pages -> Branch main -> folder /public" -ForegroundColor Cyan
Write-Host "Stable app URL: $pagesUrl" -ForegroundColor Green

$skillPath = Join-Path $Root "alexa-skill\index.js"
$skill = Get-Content $skillPath -Raw
$skill = $skill -replace 'const WEB_APP_URL = process\.env\.WEB_APP_URL \|\| "[^"]+"', "const WEB_APP_URL = process.env.WEB_APP_URL || `"$pagesUrl`""
Set-Content -Path $skillPath -Value $skill -Encoding UTF8
Write-Host "Updated alexa-skill\index.js with GitHub Pages URL." -ForegroundColor Green
