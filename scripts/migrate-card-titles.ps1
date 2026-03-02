# CardTitle Migration Script
# Migrates CardTitle className="text-*" to use size variant

$ErrorActionPreference = "Continue"

# Get all .tsx files in features and components directories
$files = Get-ChildItem -Recurse -Filter "*.tsx" -Path "features", "components" | Where-Object { $_.Name -notlike "*.bak*" }

$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileReplacements = 0
    
    # Pattern 1: size="sm" - for text-sm, text-body-sm
    # Replace: className="text-sm font-medium" -> size="sm"
    # Replace: className="text-sm font-medium text-muted-foreground" -> size="sm" className="text-muted-foreground"
    
    # Simple text-sm patterns (stat cards)
    $content = $content -replace 'CardTitle className="text-sm font-medium"', 'CardTitle size="sm"'
    $content = $content -replace 'CardTitle className="text-sm font-semibold"', 'CardTitle size="sm"'
    $content = $content -replace 'CardTitle className="text-body-sm font-medium"', 'CardTitle size="sm"'
    
    # text-sm with additional classes
    $content = $content -replace 'CardTitle className="text-sm font-medium text-muted-foreground"', 'CardTitle size="sm" className="text-muted-foreground"'
    $content = $content -replace 'CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"', 'CardTitle size="sm" className="text-muted-foreground flex items-center gap-2"'
    $content = $content -replace 'CardTitle className="text-sm font-semibold flex items-center gap-2"', 'CardTitle size="sm" className="flex items-center gap-2"'
    $content = $content -replace 'CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-900"', 'CardTitle size="sm" className="flex items-center gap-2 text-amber-900"'
    $content = $content -replace 'CardTitle className="text-sm font-medium flex items-center gap-2"', 'CardTitle size="sm" className="flex items-center gap-2"'
    
    # Pattern 2: size="lg" - for text-lg, text-h3, text-h2, text-h1
    # text-lg patterns
    $content = $content -replace 'CardTitle className="text-lg"', 'CardTitle size="lg"'
    $content = $content -replace 'CardTitle className="text-lg font-semibold"', 'CardTitle size="lg"'
    $content = $content -replace 'CardTitle className="text-lg font-semibold flex items-center gap-2"', 'CardTitle size="lg" className="flex items-center gap-2"'
    
    # text-h3 patterns -> size="lg"
    $content = $content -replace 'CardTitle className="text-h3"', 'CardTitle size="lg"'
    $content = $content -replace 'CardTitle className="text-h3 truncate"', 'CardTitle size="lg" className="truncate"'
    $content = $content -replace 'CardTitle className="text-h3 flex items-center gap-2"', 'CardTitle size="lg" className="flex items-center gap-2"'
    
    # text-h2 patterns -> size="lg"
    $content = $content -replace 'CardTitle className="text-h2"', 'CardTitle size="lg"'
    
    # text-h1 patterns -> size="lg" with className for extra styles
    $content = $content -replace 'CardTitle className="text-h1 font-extrabold tracking-tight"', 'CardTitle size="lg" className="font-extrabold tracking-tight"'
    
    # text-2xl patterns (login forms) -> size="lg"
    $content = $content -replace 'CardTitle className="text-2xl"', 'CardTitle size="lg"'
    
    # Pattern 3: Default (no size needed) - for text-base, text-h4, text-h5, text-h6, text-body-base
    # text-base patterns
    $content = $content -replace 'CardTitle className="text-base"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-base font-semibold"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-base font-medium"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-base leading-6"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-base font-medium uppercase"', 'CardTitle className="uppercase"'
    $content = $content -replace 'CardTitle className="text-base flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
    
    # text-body-base patterns
    $content = $content -replace 'CardTitle className="text-body-base"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-body-base font-medium"', 'CardTitle'
    
    # text-h4 patterns -> default
    $content = $content -replace 'CardTitle className="text-h4"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-h4 font-semibold"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-h4 font-semibold flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
    
    # text-h5 patterns -> default
    $content = $content -replace 'CardTitle className="text-h5"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-h5 font-semibold"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-h5 flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
    $content = $content -replace 'CardTitle className="text-h5 font-semibold flex items-center gap-2"', 'CardTitle className="flex items-center gap-2"'
    
    # text-h6 patterns -> default
    $content = $content -replace 'CardTitle className="text-h6"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-h6 font-semibold"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-h6 font-medium"', 'CardTitle'
    $content = $content -replace 'CardTitle className="text-h6 text-primary"', 'CardTitle className="text-primary"'
    $content = $content -replace 'CardTitle className="text-h6 font-semibold leading-tight group-hover:text-primary transition-colors"', 'CardTitle className="leading-tight group-hover:text-primary transition-colors"'
    
    # Check if content changed
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -NoNewline -Encoding UTF8
        $fileReplacements = 1
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
    
    $totalReplacements += $fileReplacements
}

Write-Host ""
Write-Host "Migration complete! Updated $totalReplacements files." -ForegroundColor Cyan
