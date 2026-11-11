$ErrorActionPreference='Stop'
Push-Location (Join-Path $PSScriptRoot '..')
try {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive=[IO.Compression.ZipFile]::OpenRead((Resolve-Path 'outputs/GAME_03_OFFLINE.zip'))
  try {
    $root=(Get-Location).Path
    $files=@(Get-Item index.html,HUONG-DAN.md)+@(Get-ChildItem src,styles,assets,audio -File -Recurse)
    $entries=@($archive.Entries | Where-Object Name)
    if($entries.Count -ne $files.Count){throw 'Unexpected ZIP file count'}
    foreach($file in $files){
      $rel=[IO.Path]::GetRelativePath($root,$file.FullName).Replace('\','/')
      $entry=$entries | Where-Object { $_.FullName.Replace('\','/') -ceq $rel }
      if(!$entry){throw "ZIP entry missing: $rel"}
      $stream=$entry.Open()
      try{ $hash=(Get-FileHash -InputStream $stream -Algorithm SHA256).Hash }
      finally{$stream.Dispose()}
      if($hash -ne (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash){throw "ZIP hash differs: $rel"}
    }
    "Verified $($files.Count) offline ZIP files against browser-tested source (SHA-256)."
  } finally { $archive.Dispose() }
} finally { Pop-Location }
