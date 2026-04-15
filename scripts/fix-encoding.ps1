# Fix double-encoded UTF-8 files and remove duplicate 'use client'
# PowerShell 5.1 Set-Content -Encoding utf8 caused double-encoding

$targetDir = "features/reports/business-activity/pages"
$files = Get-ChildItem -Path $targetDir -Filter "*.tsx"

foreach ($file in $files) {
    # Read raw bytes
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    
    # Remove BOM if present
    $startIdx = 0
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        $startIdx = 3
    }
    
    # Decode as Latin-1 (ISO-8859-1) to get original UTF-8 bytes back
    $latin1 = [System.Text.Encoding]::GetEncoding("ISO-8859-1")
    $content = $latin1.GetString($bytes, $startIdx, $bytes.Length - $startIdx)
    
    # Now encode those characters as Latin-1 bytes = original UTF-8 bytes
    $originalBytes = $latin1.GetBytes($content)
    
    # Decode as proper UTF-8
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    $text = $utf8NoBom.GetString($originalBytes)
    
    # Check if fixing was successful (should contain Vietnamese)
    if ($text -match "Báo cáo|thời gian|chi nhánh|sản phẩm|nhân viên|khách hàng|đơn hàng") {
        # Remove duplicate 'use client' (keep first one only)
        $text = $text -replace "^'use client'\r?\n\r?\n(/\*\*[\s\S]*?\*/)\r?\n\r?\n'use client'", "'use client'`n`n`$1"
        
        # Write back as UTF-8 without BOM
        [System.IO.File]::WriteAllText($file.FullName, $text, $utf8NoBom)
        Write-Output "FIXED: $($file.Name)"
    } else {
        Write-Output "SKIP (no Vietnamese found after decode): $($file.Name)"
    }
}

# Also fix report-chart.tsx
$chartFile = "features/reports/business-activity/components/report-chart.tsx"
$bytes = [System.IO.File]::ReadAllBytes($chartFile) 
$startIdx = 0
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    $startIdx = 3
}
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
# report-chart.tsx was only BOM added, not double-encoded (only chart colors replaced, no Vietnamese re-encoded)
# Just remove BOM
$content = $utf8NoBom.GetString($bytes, $startIdx, $bytes.Length - $startIdx)
[System.IO.File]::WriteAllText($chartFile, $content, $utf8NoBom)
Write-Output "FIXED BOM: report-chart.tsx"

Write-Output "--- Done ---"
