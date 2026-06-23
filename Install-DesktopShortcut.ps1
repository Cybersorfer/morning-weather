$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "My Morning Weather.lnk"
$Wsh = New-Object -ComObject WScript.Shell
$Sc = $Wsh.CreateShortcut($ShortcutPath)
$Sc.TargetPath = "powershell.exe"
$Sc.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$(Join-Path $Root 'Start-MorningWeather-Service.ps1')`""
$Sc.WorkingDirectory = $Root
$Sc.Description = "Kid weather app HTTPS tunnel for Alexa"
$Sc.Save()
Write-Host "Desktop shortcut created: $ShortcutPath" -ForegroundColor Green
