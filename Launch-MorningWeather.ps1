$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
Write-Host "Starting My Morning Weather at http://127.0.0.1:8794/" -ForegroundColor Cyan
node server.mjs
