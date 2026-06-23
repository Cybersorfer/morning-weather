# Starts Morning Weather server + free HTTPS tunnel (background). Run at login or from Desktop shortcut.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8794

$listen = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $listen) {
  Start-Process -FilePath "node" -ArgumentList "server.mjs" -WorkingDirectory $Root -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

& (Join-Path $Root "scripts\Start-CloudflareTunnel.ps1") | Out-Null

$deployPath = Join-Path $Root "data\deploy-url.json"
if (Test-Path $deployPath) {
  $url = (Get-Content $deployPath -Raw | ConvertFrom-Json).url
  Write-Host "Morning Weather is live at $url"
}
