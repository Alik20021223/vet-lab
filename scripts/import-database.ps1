# Import Database Script (PowerShell)
# Импортирует данные на сервере в production базу данных

$ErrorActionPreference = "Stop"

Write-Host "📥 Импорт базы данных VetLab" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Проверяем наличие папки database-export
if (-not (Test-Path "database-export")) {
    Write-Host "❌ Папка database-export не найдена!" -ForegroundColor Red
    Write-Host "Скопируйте папку database-export с вашего локального компьютера на сервер" -ForegroundColor Yellow
    exit 1
}

# Находим последний SQL файл
$sqlFiles = Get-ChildItem -Path "database-export" -Filter "database_backup_*.sql" | Sort-Object LastWriteTime -Descending

if ($sqlFiles.Count -eq 0) {
    Write-Host "❌ SQL файл не найден в database-export/" -ForegroundColor Red
    exit 1
}

$sqlFile = $sqlFiles[0]
Write-Host "📄 Найден файл: $($sqlFile.FullName)" -ForegroundColor Green
Write-Host ""

# Проверяем, запущены ли контейнеры
$ErrorActionPreference = "Continue"
$dbRunning = $false
$psOutput = docker compose -f docker-compose.production.yml ps db 2>&1
$ErrorActionPreference = "Stop"

if ($psOutput -match "running" -or $psOutput -match "Up") {
    $dbRunning = $true
}

if (-not $dbRunning) {
    Write-Host "⚠️  Контейнеры не запущены. Запускаем только базу данных и backend..." -ForegroundColor Yellow
    $ErrorActionPreference = "Continue"
    docker compose -f docker-compose.production.yml up -d db backend 2>&1 | Where-Object { $_ -notmatch 'level=warning' -and $_ -notmatch 'obsolete' } | Out-Null
    $ErrorActionPreference = "Stop"
    Write-Host "⏳ Ждём запуска базы данных..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # Ждём, пока база данных станет готовой
    $maxAttempts = 30
    $attempt = 0
    do {
        Start-Sleep -Seconds 2
        $attempt++
        $ErrorActionPreference = "Continue"
        $healthCheck = docker compose -f docker-compose.production.yml exec -T db pg_isready -U vetlab_user -d vetlab_db 2>&1 | Out-Null
        $ErrorActionPreference = "Stop"
        if ($LASTEXITCODE -eq 0) {
            break
        }
    } while ($attempt -lt $maxAttempts)
    
    if ($attempt -eq $maxAttempts) {
        Write-Host "❌ База данных не запустилась за отведённое время!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔄 Импортируем данные в базу..." -ForegroundColor Cyan

# Импортируем SQL файл
# Метод 1: Через stdin (предпочтительный)
$importSuccess = $false
$ErrorActionPreference = "Continue"
Get-Content $sqlFile.FullName -Raw -Encoding UTF8 | docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db 2>&1 | Where-Object { $_ -notmatch 'level=warning' -and $_ -notmatch 'obsolete' } | Out-Null
$ErrorActionPreference = "Stop"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Данные успешно импортированы!" -ForegroundColor Green
    $importSuccess = $true
} else {
    # Метод 2: Копируем файл в контейнер и импортируем оттуда
    Write-Host "⚠️  Первый метод не сработал, пробуем альтернативный..." -ForegroundColor Yellow
    $tempFileName = "temp_import.sql"
    
    # Копируем файл в контейнер
    $ErrorActionPreference = "Continue"
    docker cp $sqlFile.FullName "vetlab-db:/tmp/$tempFileName" 2>&1 | Out-Null
    $ErrorActionPreference = "Stop"
    
    if ($LASTEXITCODE -eq 0) {
        # Импортируем из контейнера
        $ErrorActionPreference = "Continue"
        docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -f "/tmp/$tempFileName" 2>&1 | Where-Object { $_ -notmatch 'level=warning' -and $_ -notmatch 'obsolete' } | Out-Null
        $ErrorActionPreference = "Stop"
        
        if ($LASTEXITCODE -eq 0) {
            # Удаляем временный файл
            $ErrorActionPreference = "Continue"
            docker compose -f docker-compose.production.yml exec -T db rm "/tmp/$tempFileName" 2>&1 | Out-Null
            $ErrorActionPreference = "Stop"
            Write-Host "✅ Данные успешно импортированы!" -ForegroundColor Green
            $importSuccess = $true
        }
    }
}

if (-not $importSuccess) {
    Write-Host "❌ Ошибка импорта данных!" -ForegroundColor Red
    exit 1
}

# Восстанавливаем uploads
$uploadsFiles = Get-ChildItem -Path "database-export" -Filter "uploads_*.tar.gz" | Sort-Object LastWriteTime -Descending

if ($uploadsFiles.Count -gt 0) {
    $uploadsFile = $uploadsFiles[0]
    Write-Host "📦 Восстанавливаем файлы uploads..." -ForegroundColor Cyan
    
    $extracted = $false
    
    # Метод 1: Используем встроенный tar в Windows 10/11
    if (Get-Command tar -ErrorAction SilentlyContinue) {
        Push-Location $PWD
        tar -xzf $uploadsFile.FullName 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $extracted = $true
            Write-Host "✅ Файлы uploads восстановлены!" -ForegroundColor Green
        }
        Pop-Location
    }
    
    # Метод 2: Через WSL
    if (-not $extracted) {
        $wslPath = $PWD.Path -replace '^([A-Z]):', '/mnt/$1' -replace '\\', '/'
        $wslCommand = "cd '$wslPath'; tar -xzf '$($uploadsFile.Name)'"
        wsl bash -c $wslCommand 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $extracted = $true
            Write-Host "✅ Файлы uploads восстановлены!" -ForegroundColor Green
        }
    }
    
    # Метод 3: Через Git Bash
    if (-not $extracted) {
        $bashPath = (Get-Command bash -ErrorAction SilentlyContinue).Source
        if ($bashPath) {
            $bashCommand = "cd '$PWD'; tar -xzf '$($uploadsFile.FullName)'"
            & $bashPath -c $bashCommand 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                $extracted = $true
                Write-Host "✅ Файлы uploads восстановлены!" -ForegroundColor Green
            }
        }
    }
    
    if (-not $extracted) {
        Write-Host "⚠️  Не удалось автоматически распаковать uploads. Распакуйте вручную:" -ForegroundColor Yellow
        Write-Host "   tar -xzf $($uploadsFile.FullName)" -ForegroundColor Yellow
        Write-Host "   или используйте 7-Zip/WinRAR для распаковки" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Архив uploads не найден, пропускаем..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔄 Перезапускаем приложение..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
docker compose -f docker-compose.production.yml restart db backend 2>&1 | Where-Object { $_ -notmatch 'level=warning' -and $_ -notmatch 'obsolete' } | Out-Null
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "✅ Импорт завершён успешно!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Ваше приложение доступно с полными данными" -ForegroundColor Green
Write-Host ""
