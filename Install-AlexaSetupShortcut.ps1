$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "Setup Alexa Weather Skill.lnk"
$Wsh = New-Object -ComObject WScript.Shell
$Sc = $Wsh.CreateShortcut($ShortcutPath)
$Sc.TargetPath = "powershell.exe"
$Sc.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$(Join-Path $Root 'Setup-AlexaSkill.ps1')`""
$Sc.WorkingDirectory = $Root
$Sc.Description = "Copy Alexa code + open setup wizard"
$Sc.Save()
Write-Host "Desktop shortcut: $ShortcutPath" -ForegroundColor Green
