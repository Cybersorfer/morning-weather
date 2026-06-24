# Copies Alexa skill code to clipboard and opens the Developer Console.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillFile = Join-Path $Root "alexa-skill\index.js"
$Wizard = Join-Path $Root "ALEXA-WIZARD.html"

if (-not (Test-Path $SkillFile)) { throw "Missing $SkillFile" }

$code = Get-Content $SkillFile -Raw -Encoding UTF8
Set-Clipboard -Value $code

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Alexa skill code COPIED to clipboard" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Follow the wizard in your browser (3 clicks in Amazon UI)." -ForegroundColor Yellow
Write-Host ""

Start-Process $Wizard
Start-Process "https://developer.amazon.com/alexa/console/ask"

Write-Host "Wizard: $Wizard"
Write-Host "After skill is created with ALEXA-HOSTED hosting:"
Write-Host "  Code tab -> Ctrl+V -> Deploy"
