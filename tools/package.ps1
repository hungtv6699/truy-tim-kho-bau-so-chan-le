$ErrorActionPreference='Stop'
Push-Location (Join-Path $PSScriptRoot '..')
try {
  New-Item -ItemType Directory -Force outputs | Out-Null
  Compress-Archive -Force -Path index.html,src,styles,assets,audio,HUONG-DAN.md -DestinationPath outputs/GAME_03_OFFLINE.zip
  Compress-Archive -Force -Path index.html,src,styles,assets,audio,tools,reports,README.md,HUONG-DAN.md -DestinationPath outputs/GAME_03_SOURCE_VA_BAN_GIAO.zip
} finally { Pop-Location }
