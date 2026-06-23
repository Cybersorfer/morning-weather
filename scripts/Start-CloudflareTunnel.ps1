# Starts free Cloudflare HTTPS tunnel for Alexa (public folder served locally).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DataDir = Join-Path $Root "data"
$TunnelFile = Join-Path $DataDir "tunnel-url.json"
$DeployFile = Join-Path $DataDir "deploy-url.json"
$port = if ($env:MORNING_WEATHER_PORT) { [int]$env:MORNING_WEATHER_PORT } else { 8794 }
$LogFile = Join-Path $DataDir "tunnel.log"

New-Item -ItemType Directory -Force -Path $DataDir | Out-Null

$cloudflaredCmd = Get-Command cloudflared -ErrorAction SilentlyContinue
$cloudflared = if ($cloudflaredCmd) { $cloudflaredCmd.Source } else { $null }
if (-not $cloudflared) {
  Write-Host "Installing cloudflared..." -ForegroundColor Yellow
  winget install Cloudflare.cloudflared --source winget --accept-package-agreements --accept-source-agreements
  $cloudflaredCmd = Get-Command cloudflared -ErrorAction SilentlyContinue
  $cloudflared = if ($cloudflaredCmd) { $cloudflaredCmd.Source } else { $null }
}
if (-not $cloudflared) { throw "cloudflared not found" }

Get-CimInstance Win32_Process -Filter "Name='cloudflared.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like "*127.0.0.1:$port*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

if (Test-Path $LogFile) { Remove-Item $LogFile -Force }

Start-Process -FilePath $cloudflared `
  -ArgumentList @("tunnel", "--url", "http://127.0.0.1:$port", "--logfile", $LogFile, "--loglevel", "info") `
  -WorkingDirectory $Root -WindowStyle Hidden

$url = $null
for ($i = 0; $i -lt 35; $i++) {
  Start-Sleep -Seconds 1
  if (-not (Test-Path $LogFile)) { continue }
  $log = Get-Content $LogFile -Raw -ErrorAction SilentlyContinue
  if ($log -match "(https://[a-z0-9-]+\.trycloudflare\.com)") {
    $url = $Matches[1]
    break
  }
}

if (-not $url) { throw "Tunnel URL not ready. Check $LogFile" }

$payload = @{
  url = "$url/"
  origin = $url
  updatedAt = (Get-Date).ToUniversalTime().ToString("o")
  note = "Free Cloudflare quick tunnel. URL changes if tunnel restarts."
} | ConvertTo-Json

Set-Content -Path $TunnelFile -Value $payload -Encoding UTF8
Set-Content -Path $DeployFile -Value $payload -Encoding UTF8

$skillPath = Join-Path $Root "alexa-skill\index.js"
if (Test-Path $skillPath) {
  $skill = Get-Content $skillPath -Raw
  $skill = $skill -replace 'const WEB_APP_URL = process\.env\.WEB_APP_URL \|\| "[^"]+"', "const WEB_APP_URL = process.env.WEB_APP_URL || `"$url/`""
  Set-Content -Path $skillPath -Value $skill -Encoding UTF8
}

Write-Host "HTTPS URL: $url/" -ForegroundColor Green
Write-Host "Alexa skill WEB_APP_URL updated in alexa-skill\index.js" -ForegroundColor Cyan
exit 0
