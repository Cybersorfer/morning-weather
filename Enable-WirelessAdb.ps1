# Enable wireless ADB on Fire tablet (USB must be connected once).
$ErrorActionPreference = "Stop"

$devices = adb devices 2>&1 | Select-String "`tdevice$"
if (-not $devices) {
  Write-Host "No USB device in 'device' state. Plug in tablet and allow USB debugging." -ForegroundColor Red
  exit 1
}

Write-Host "Enabling TCP/IP ADB on port 5555..." -ForegroundColor Cyan
adb tcpip 5555
Start-Sleep -Seconds 2

$ip = (adb shell ip route 2>$null | Select-String -Pattern 'wlan0.*?(\d+\.\d+\.\d+\.\d+)' | ForEach-Object {
  if ($_.Line -match 'src (\d+\.\d+\.\d+\.\d+)') { $Matches[1] }
} | Select-Object -First 1)

if (-not $ip) {
  $ip = (adb shell "ip -f inet addr show wlan0" 2>$null | Select-String 'inet (\d+\.\d+\.\d+\.\d+)' | ForEach-Object {
    if ($_.Line -match 'inet (\d+\.\d+\.\d+\.\d+)/') { $Matches[1] }
  } | Select-Object -First 1)
}

if (-not $ip) {
  Write-Host "Could not read tablet Wi-Fi IP. On tablet: Settings -> Device Options -> About -> note IP" -ForegroundColor Yellow
  Write-Host "Then run: adb connect TABLET_IP:5555" -ForegroundColor Yellow
  exit 1
}

adb connect "${ip}:5555"
Start-Sleep -Seconds 2
adb devices -l

$info = @"
tabletIp=$ip
wirelessEndpoint=${ip}:5555
enabledAt=$(Get-Date -Format o)
"@
$out = Join-Path $PSScriptRoot "data\wireless-adb.txt"
New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
Set-Content -Path $out -Value $info -Encoding UTF8

Write-Host ""
Write-Host "Wireless ADB ready: ${ip}:5555" -ForegroundColor Green
Write-Host "Saved to: $out" -ForegroundColor Cyan
Write-Host "Next time (same Wi-Fi): adb connect ${ip}:5555" -ForegroundColor Yellow
