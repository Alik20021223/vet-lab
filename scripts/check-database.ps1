# Script to check database status
$ErrorActionPreference = "Continue"

# Helper function to extract number from psql result
function Get-NumberFromPsqlResult {
    param([object]$result)
    if (-not $result) { return 0 }
    $numberStr = ""
    if ($result -is [array]) {
        $numberStr = ($result | Where-Object { $_ -match '\d+' } | Select-Object -First 1) -replace '\s', ''
    } else {
        $numberStr = ($result -replace '\s', '').Trim()
    }
    if ($numberStr -match '(\d+)') {
        return [int]$matches[1]
    }
    return 0
}

Write-Host "Checking database status..." -ForegroundColor Cyan
Write-Host ""

# Check table count
Write-Host "Table count:" -ForegroundColor Yellow
$tableCount = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>&1
if ($LASTEXITCODE -eq 0) {
    $count = Get-NumberFromPsqlResult -result $tableCount
    Write-Host "   Tables: $count" -ForegroundColor Green
} else {
    Write-Host "   Error checking tables" -ForegroundColor Red
}
Write-Host ""

# Check main tables
Write-Host "Data in main tables:" -ForegroundColor Yellow

$query1 = 'SELECT COUNT(*) FROM "User";'
$result1 = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c $query1 2>&1
if ($LASTEXITCODE -eq 0 -and $result1) {
    $count = Get-NumberFromPsqlResult -result $result1
    $color = if ($count -gt 0) { "Green" } else { "Gray" }
    Write-Host "   Users: $count" -ForegroundColor $color
} else {
    Write-Host "   Users: table not found or error" -ForegroundColor Yellow
}

$query2 = 'SELECT COUNT(*) FROM "CatalogItem";'
$result2 = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c $query2 2>&1
if ($LASTEXITCODE -eq 0 -and $result2) {
    $count = Get-NumberFromPsqlResult -result $result2
    $color = if ($count -gt 0) { "Green" } else { "Gray" }
    Write-Host "   CatalogItems: $count" -ForegroundColor $color
} else {
    Write-Host "   CatalogItems: table not found or error" -ForegroundColor Yellow
}

$query3 = 'SELECT COUNT(*) FROM "News";'
$result3 = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c $query3 2>&1
if ($LASTEXITCODE -eq 0 -and $result3) {
    $count = Get-NumberFromPsqlResult -result $result3
    $color = if ($count -gt 0) { "Green" } else { "Gray" }
    Write-Host "   News: $count" -ForegroundColor $color
} else {
    Write-Host "   News: table not found or error" -ForegroundColor Yellow
}

$query4 = 'SELECT COUNT(*) FROM "Service";'
$result4 = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c $query4 2>&1
if ($LASTEXITCODE -eq 0 -and $result4) {
    $count = Get-NumberFromPsqlResult -result $result4
    $color = if ($count -gt 0) { "Green" } else { "Gray" }
    Write-Host "   Services: $count" -ForegroundColor $color
} else {
    Write-Host "   Services: table not found or error" -ForegroundColor Yellow
}

$query5 = 'SELECT COUNT(*) FROM "Brand";'
$result5 = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c $query5 2>&1
if ($LASTEXITCODE -eq 0 -and $result5) {
    $count = Get-NumberFromPsqlResult -result $result5
    $color = if ($count -gt 0) { "Green" } else { "Gray" }
    Write-Host "   Brands: $count" -ForegroundColor $color
} else {
    Write-Host "   Brands: table not found or error" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Check completed" -ForegroundColor Green
