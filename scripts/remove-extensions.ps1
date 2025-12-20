# Script to remove .ts/.tsx extensions from imports
# Run: powershell -ExecutionPolicy Bypass -File .\scripts\remove-extensions.ps1

$rootPath = "d:\hrm2"
$folders = @("features", "components", "contexts", "hooks", "lib")

# Pattern to match imports with .tsx or .ts extensions
$pattern = "(from\s+['""])([^'""]+)(\.tsx?)(['""])"

$totalFiles = 0
$modifiedFiles = 0

foreach ($folder in $folders) {
    $folderPath = Join-Path $rootPath $folder
    if (-not (Test-Path $folderPath)) { continue }
    
    # Process .tsx files first, then .ts
    $files = Get-ChildItem -Path $folderPath -Recurse -Include "*.tsx","*.ts" -File | 
             Where-Object { $_.FullName -notmatch "__tests__" -and $_.FullName -notmatch "node_modules" }
    
    foreach ($file in $files) {
        $totalFiles++
        
        # Read file as bytes to preserve encoding
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $content = [System.Text.Encoding]::UTF8.GetString($bytes)
        
        # Check if file has imports with extensions
        if ($content -match $pattern) {
            # Remove .ts and .tsx extensions from imports
            $newContent = $content -replace $pattern, '$1$2$4'
            
            if ($content -ne $newContent) {
                # Write back with UTF8 without BOM
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
                $modifiedFiles++
                Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
            }
        }
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Total files scanned: $totalFiles"
Write-Host "Files modified: $modifiedFiles" -ForegroundColor Yellow
