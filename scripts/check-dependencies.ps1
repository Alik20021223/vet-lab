# Проверка зависимостей для импорта базы данных

Write-Host "🔍 Проверка зависимостей для импорта базы данных VetLab" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# 1. Проверка Docker
Write-Host "1. Проверка Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker установлен: $dockerVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Docker не установлен или не работает" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "   ❌ Docker не найден" -ForegroundColor Red
    $allOk = $false
}

# 2. Проверка Docker Compose
Write-Host "2. Проверка Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker compose version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker Compose установлен: $composeVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Docker Compose не установлен или не работает" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "   ❌ Docker Compose не найден" -ForegroundColor Red
    $allOk = $false
}

# 3. Проверка Docker daemon
Write-Host "3. Проверка Docker daemon..." -ForegroundColor Yellow
try {
    $dockerPs = docker ps 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker daemon работает" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Docker daemon не запущен" -ForegroundColor Red
        Write-Host "   💡 Запустите Docker Desktop" -ForegroundColor Yellow
        $allOk = $false
    }
} catch {
    Write-Host "   ❌ Не удалось подключиться к Docker" -ForegroundColor Red
    $allOk = $false
}

# 4. Проверка docker-compose.production.yml
Write-Host "4. Проверка docker-compose.production.yml..." -ForegroundColor Yellow
if (Test-Path "docker-compose.production.yml") {
    Write-Host "   ✅ Файл docker-compose.production.yml найден" -ForegroundColor Green
} else {
    Write-Host "   ❌ Файл docker-compose.production.yml не найден" -ForegroundColor Red
    $allOk = $false
}

# 5. Проверка папки database-export
Write-Host "5. Проверка папки database-export..." -ForegroundColor Yellow
if (Test-Path "database-export") {
    Write-Host "   ✅ Папка database-export найдена" -ForegroundColor Green
    
    # Проверка SQL файлов
    $sqlFiles = Get-ChildItem -Path "database-export" -Filter "database_backup_*.sql" -ErrorAction SilentlyContinue
    if ($sqlFiles.Count -gt 0) {
        Write-Host "   ✅ Найдено SQL файлов: $($sqlFiles.Count)" -ForegroundColor Green
        $latestFile = $sqlFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        $fileSizeMB = [math]::Round($latestFile.Length / 1MB, 2)
        Write-Host "      Последний файл: $($latestFile.Name) ($fileSizeMB MB)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  SQL файлы не найдены в database-export/" -ForegroundColor Yellow
    }
    
    # Проверка архивов uploads
    $uploadsFiles = Get-ChildItem -Path "database-export" -Filter "uploads_*.tar.gz" -ErrorAction SilentlyContinue
    if ($uploadsFiles.Count -gt 0) {
        Write-Host "   ✅ Найдено архивов uploads: $($uploadsFiles.Count)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Архивы uploads не найдены (необязательно)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ Папка database-export не найдена" -ForegroundColor Red
    $allOk = $false
}

# 6. Проверка tar (для распаковки uploads)
Write-Host "6. Проверка tar (для распаковки uploads)..." -ForegroundColor Yellow
$tarCmd = Get-Command tar -ErrorAction SilentlyContinue
if ($tarCmd) {
    Write-Host "   ✅ tar доступен: $($tarCmd.Source)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  tar не найден (можно использовать WSL или Git Bash)" -ForegroundColor Yellow
}

# 7. Проверка WSL (опционально)
Write-Host "7. Проверка WSL (опционально)..." -ForegroundColor Yellow
$wslCmd = Get-Command wsl -ErrorAction SilentlyContinue
if ($wslCmd) {
    Write-Host "   ✅ WSL доступен: $($wslCmd.Source)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  WSL не найден (необязательно)" -ForegroundColor Gray
}

# 8. Проверка PowerShell версии
Write-Host "8. Проверка PowerShell..." -ForegroundColor Yellow
$psVersion = $PSVersionTable.PSVersion
Write-Host "   ✅ PowerShell версия: $psVersion" -ForegroundColor Green

# Итоговый результат
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "✅ Все основные зависимости установлены!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Можно запускать импорт базы данных:" -ForegroundColor Cyan
    Write-Host "   powershell -ExecutionPolicy Bypass -File scripts\import-database.ps1" -ForegroundColor White
} else {
    Write-Host "❌ Некоторые зависимости отсутствуют!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Установите недостающие компоненты перед запуском импорта" -ForegroundColor Yellow
}
Write-Host ""







