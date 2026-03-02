# CardTitle Migration Script - Single File Test
# Test on one file first

param(
    [string]$TestFile = "features\tasks\components\dashboard-page.tsx"
)

$ErrorActionPreference = "Stop"

Write-Host "Testing migration on: $TestFile" -ForegroundColor Yellow
Write-Host ""

# Read original content
$content = Get-Content $TestFile -Raw -Encoding UTF8
$originalContent = $content

Write-Host "=== BEFORE ===" -ForegroundColor Cyan
$matches = [regex]::Matches($content, 'CardTitle className="text-[^"]*"')
foreach ($m in $matches) {
    Write-Host "  $($m.Value)" -ForegroundColor Gray
}
Write-Host ""

# Apply replacements
# Pattern 1: size="sm" - for text-sm, text-body-sm
$content = $content -replace 'CardTitle className="text-sm font-medium"', 'CardTitle size="sm"'
$content = $content -replace 'CardTitle className="text-sm font-semibold"', 'CardTitle size="sm"'
$content = $content -replace 'CardTitle className="text-body-sm font-medium"', 'CardTitle size="sm"'
$content = $content -replace 'CardTitle className="text-sm font-medium text-muted-foreground"', 'CardTitle size="sm" className="text-muted-foreground"'
$content = $content -replace 'CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"', 'CardTitle size="sm" className="text-muted-foreground flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-sm font-semibold flex items-center gap-2"', 'CardTitle size="sm" className="flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-900"', 'CardTitle size="sm" className="flex items-center gap-2 text-amber-900"'
$content = $content -replace 'CardTitle className="text-sm font-medium flex items-center gap-2"', 'CardTitle size="sm" className="flex items-center gap-2"'

# Pattern 2: size="lg" - for text-lg, text-h3, text-h2, text-h1
$content = $content -replace 'CardTitle className="text-lg"', 'CardTitle size="lg"'
$content = $content -replace 'CardTitle className="text-lg font-semibold"', 'CardTitle size="lg"'
$content = $content -replace 'CardTitle className="text-lg font-semibold flex items-center gap-2"', 'CardTitle size="lg" className="flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-h3"', 'CardTitle size="lg"'
$content = $content -replace 'CardTitle className="text-h3 truncate"', 'CardTitle size="lg" className="truncate"'
$content = $content -replace 'CardTitle className="text-h3 flex items-center gap-2"', 'CardTitle size="lg" className="flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-h2"', 'CardTitle size="lg"'
$content = $content -replace 'CardTitle className="text-h1 font-extrabold tracking-tight"', 'CardTitle size="lg" className="font-extrabold tracking-tight"'
$content = $content -replace 'CardTitle className="text-2xl"', 'CardTitle size="lg"'

# Pattern 3: Default (no size needed) - for text-base, text-h4, text-h5, text-h6, text-body-base
$content = $content -replace 'CardTitle className="text-base"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-base font-semibold"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-base font-medium"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-base leading-6"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-base font-medium uppercase"', 'CardTitle className="uppercase"'
$content = $content -replace 'CardTitle className="text-base flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-body-base"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-body-base font-medium"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h4"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h4 font-semibold"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h4 font-semibold flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-h5"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h5 font-semibold"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h5 flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-h5 font-semibold flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
$content = $content -replace 'CardTitle className="text-h6"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h6 font-semibold"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h6 font-medium"', 'CardTitle'
$content = $content -replace 'CardTitle className="text-h6 text-primary"', 'CardTitle className="text-primary"'
$content = $content -replace 'CardTitle className="text-h6 font-semibold leading-tight group-hover:text-primary transition-colors"', 'CardTitle className="leading-tight group-hover:text-primary transition-colors"'

Write-Host "=== AFTER ===" -ForegroundColor Green
$matchesAfter = [regex]::Matches($content, 'CardTitle[^>]*>')
foreach ($m in $matchesAfter) {
    Write-Host "  $($m.Value)" -ForegroundColor Gray
}
Write-Host ""

# Check remaining patterns
$remaining = [regex]::Matches($content, 'CardTitle className="text-[^"]*"')
if ($remaining.Count -gt 0) {
    Write-Host "=== REMAINING (not migrated) ===" -ForegroundColor Yellow
    foreach ($m in $remaining) {
        Write-Host "  $($m.Value)" -ForegroundColor Yellow
    }
}

# Diff check
if ($content -eq $originalContent) {
    Write-Host "No changes made." -ForegroundColor Yellow
} else {
    Write-Host "Changes detected! Ready to save." -ForegroundColor Green
    
    # Preview: Save to test file
    $testOutput = "$TestFile.migrated"
    Set-Content $testOutput -Value $content -NoNewline -Encoding UTF8
    Write-Host "Preview saved to: $testOutput" -ForegroundColor Cyan
}
