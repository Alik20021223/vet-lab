# Import Database Script (PowerShell)
# Импортирует данные на сервере в production базу данных

$ErrorActionPreference = "Stop"

# Вспомогательная функция для извлечения числа из результата psql
function Get-NumberFromPsqlResult {
    param([object]$result)
    
    if (-not $result) {
        return 0
    }
    
    # Обрабатываем результат (может быть массивом строк или строкой)
    $numberStr = ""
    if ($result -is [array]) {
        # Берем первую строку, содержащую число
        $numberStr = ($result | Where-Object { $_ -match '\d+' } | Select-Object -First 1) -replace '\s', ''
    } else {
        $numberStr = ($result -replace '\s', '').Trim()
    }
    
    # Извлекаем число
    if ($numberStr -match '(\d+)') {
        return [int]$matches[1]
    }
    
    return 0
}

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

# Проверяем текущее состояние базы данных
Write-Host "🔍 Проверяем текущее состояние базы данных..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
$currentTables = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>&1
$ErrorActionPreference = "Stop"

if ($LASTEXITCODE -eq 0 -and $currentTables) {
    $tableCount = Get-NumberFromPsqlResult -result $currentTables
    
    if ($tableCount -gt 0) {
        Write-Host "⚠️  В базе уже есть $tableCount таблиц" -ForegroundColor Yellow
        Write-Host "💡 Рекомендуется очистить базу перед импортом для избежания конфликтов" -ForegroundColor Yellow
        Write-Host ""
        $clearDb = Read-Host "Очистить базу данных перед импортом? (y/N)"
        if ($clearDb -eq 'y' -or $clearDb -eq 'Y') {
            Write-Host "🗑️  Очищаем базу данных..." -ForegroundColor Yellow
            $ErrorActionPreference = "Continue"
            
            # Полная очистка базы: удаляем все объекты (таблицы, типы, функции и т.д.)
            $cleanupOutput = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -c "
                -- Отключаем все активные соединения
                SELECT pg_terminate_backend(pid) 
                FROM pg_stat_activity 
                WHERE datname = current_database() 
                AND pid <> pg_backend_pid();
                
                -- Удаляем все таблицы с CASCADE (удалит и зависимости)
                DO \$\$ 
                DECLARE 
                    r RECORD;
                BEGIN
                    -- Удаляем все таблицы
                    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                    END LOOP;
                    
                    -- Удаляем все типы (ENUM и другие)
                    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e') LOOP
                        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
                    END LOOP;
                    
                    -- Удаляем все последовательности
                    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
                        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
                    END LOOP;
                END \$\$;
            " 2>&1
            $ErrorActionPreference = "Stop"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ База данных очищена (таблицы, типы, последовательности)" -ForegroundColor Green
                
                # Проверяем, что очистка прошла успешно
                $ErrorActionPreference = "Continue"
                $remainingTables = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>&1
                $remainingTypes = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e';" 2>&1
                $ErrorActionPreference = "Stop"
                
                if ($LASTEXITCODE -eq 0) {
                    $tableCountAfter = Get-NumberFromPsqlResult -result $remainingTables
                    $typeCountAfter = Get-NumberFromPsqlResult -result $remainingTypes
                    Write-Host "   Осталось таблиц: $tableCountAfter, типов: $typeCountAfter" -ForegroundColor Gray
                }
            } else {
                Write-Host "⚠️  Не удалось полностью очистить базу" -ForegroundColor Yellow
                if ($cleanupOutput) {
                    $errors = $cleanupOutput | Where-Object { $_ -match "ERROR" -or $_ -match "FATAL" }
                    if ($errors) {
                        Write-Host "   Ошибки очистки:" -ForegroundColor Yellow
                        $errors | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
                    }
                }
                Write-Host "   Продолжаем импорт..." -ForegroundColor Yellow
            }
            Write-Host ""
        }
    } else {
        Write-Host "✅ База данных пуста, готовы к импорту" -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "ℹ️  Не удалось проверить состояние базы, продолжаем..." -ForegroundColor Gray
    Write-Host ""
}

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
        docker compose -f docker-compose.production.yml exec -T db pg_isready -U vetlab_user -d vetlab_db 2>&1 | Out-Null
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
Write-Host "📄 Размер файла: $([math]::Round($sqlFile.Length / 1MB, 2)) MB" -ForegroundColor Gray

# Проверяем первые строки SQL файла для диагностики
Write-Host "🔍 Проверяем SQL файл..." -ForegroundColor Cyan
$firstLines = Get-Content $sqlFile.FullName -TotalCount 5 -Encoding UTF8
if ($firstLines) {
    $hasPostgresCommands = $firstLines | Where-Object { $_ -match "CREATE|INSERT|COPY|SET|BEGIN" }
    if ($hasPostgresCommands) {
        Write-Host "✅ SQL файл выглядит корректно (содержит команды PostgreSQL)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  SQL файл может быть пустым или некорректным" -ForegroundColor Yellow
    }
}
Write-Host ""

# Импортируем SQL файл
# Метод 1: Через stdin (предпочтительный)
$importSuccess = $false
$importOutput = ""
$ErrorActionPreference = "Continue"

Write-Host "🔄 Пробуем метод 1: импорт через stdin..." -ForegroundColor Yellow
Write-Host "   (PowerShell не поддерживает оператор '<', используем Get-Content |)" -ForegroundColor Gray
try {
    # Используем ON_ERROR_STOP=off для продолжения при ошибках существующих объектов
    # Это позволит импортировать данные даже если некоторые типы уже существуют
    # В PowerShell нельзя использовать < для перенаправления, поэтому используем pipe
    $importOutput = Get-Content $sqlFile.FullName -Raw -Encoding UTF8 | docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -v ON_ERROR_STOP=off 2>&1
    $exitCode = $LASTEXITCODE
} catch {
    $importOutput = $_.Exception.Message
    $exitCode = 1
}

# Проверяем наличие критических ошибок в выводе (игнорируем ошибки о существующих объектах)
$hasErrors = $importOutput | Where-Object { 
    ($_ -match "ERROR" -or $_ -match "FATAL" -or $_ -match "syntax error") -and
    $_ -notmatch "already exists" -and
    $_ -notmatch "does not exist"
}

# Показываем вывод (фильтруем только предупреждения docker compose, но показываем ошибки psql)
$importantOutput = $importOutput | Where-Object { 
    $_ -and (
        $_ -match "ERROR" -or 
        $_ -match "FATAL" -or 
        $_ -match "INSERT" -or 
        $_ -match "CREATE" -or 
        $_ -match "ALTER" -or
        $_ -match "COPY" -or
        ($_ -notmatch 'level=warning' -and $_ -notmatch 'obsolete' -and $_ -notmatch '^$')
    )
}

if ($hasErrors) {
    Write-Host "❌ Обнаружены ошибки в выводе импорта!" -ForegroundColor Red
    Write-Host "📋 Детали ошибок:" -ForegroundColor Red
    $hasErrors | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    Write-Host ""
} elseif ($importantOutput) {
    Write-Host "📋 Вывод импорта:" -ForegroundColor Gray
    $importantOutput | Select-Object -First 20 | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    if ($importantOutput.Count -gt 20) {
        Write-Host "   ... (показано первых 20 строк из $($importantOutput.Count))" -ForegroundColor Gray
    }
    Write-Host ""
}

$ErrorActionPreference = "Stop"

if ($exitCode -eq 0 -and -not $hasErrors) {
    Write-Host "✅ Команда импорта выполнена успешно (exit code: 0, ошибок не обнаружено)" -ForegroundColor Green
    
    # Проверяем, что данные действительно импортированы
    Write-Host "🔍 Проверяем наличие данных в базе..." -ForegroundColor Cyan
    $ErrorActionPreference = "Continue"
    $tableCheck = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>&1
    $ErrorActionPreference = "Stop"
    
    if ($LASTEXITCODE -eq 0 -and $tableCheck) {
        $tableCount = Get-NumberFromPsqlResult -result $tableCheck
        Write-Host "📊 Найдено таблиц в базе: $tableCount" -ForegroundColor Gray
        
        if ($tableCount -gt 0) {
            # Проверяем наличие данных в основных таблицах
            Write-Host "🔍 Проверяем данные в основных таблицах..." -ForegroundColor Cyan
            $ErrorActionPreference = "Continue"
            
            # Проверяем User
            $userCount = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM \"User\";" 2>&1
            if ($LASTEXITCODE -eq 0 -and $userCount) {
                $userCountNum = Get-NumberFromPsqlResult -result $userCount
                Write-Host "   👥 Пользователей: $userCountNum" -ForegroundColor Gray
            }
            
            # Проверяем CatalogItem
            $productCount = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM \"CatalogItem\";" 2>&1
            if ($LASTEXITCODE -eq 0 -and $productCount) {
                $productCountNum = Get-NumberFromPsqlResult -result $productCount
                Write-Host "   📦 Товаров: $productCountNum" -ForegroundColor Gray
            }
            
            # Проверяем News
            $newsCount = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM \"News\";" 2>&1
            if ($LASTEXITCODE -eq 0 -and $newsCount) {
                $newsCountNum = Get-NumberFromPsqlResult -result $newsCount
                Write-Host "   📰 Новостей: $newsCountNum" -ForegroundColor Gray
            }
            
            # Проверяем Service
            $serviceCount = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM \"Service\";" 2>&1
            if ($LASTEXITCODE -eq 0 -and $serviceCount) {
                $serviceCountNum = Get-NumberFromPsqlResult -result $serviceCount
                Write-Host "   🔧 Услуг: $serviceCountNum" -ForegroundColor Gray
            }
            
            $ErrorActionPreference = "Stop"
            Write-Host ""
            Write-Host "✅ Данные успешно импортированы и проверены!" -ForegroundColor Green
            $importSuccess = $true
        } else {
            Write-Host "⚠️  Таблицы не найдены! Возможно, импорт не выполнен." -ForegroundColor Yellow
            Write-Host "💡 Проверьте SQL файл на наличие ошибок" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Не удалось проверить таблицы, но exit code был 0" -ForegroundColor Yellow
        Write-Host "💡 Рекомендуется проверить базу данных вручную" -ForegroundColor Yellow
        $importSuccess = $true  # Доверяем exit code
    }
} else {
    if ($hasErrors) {
        Write-Host "❌ Ошибка импорта: обнаружены ошибки в SQL (exit code: $exitCode)" -ForegroundColor Red
    } else {
        Write-Host "❌ Ошибка импорта (exit code: $exitCode)" -ForegroundColor Red
    }
    if ($importantOutput) {
        Write-Host "Детали ошибки выше" -ForegroundColor Red
    }
    
    # Метод 2: Копируем файл в контейнер и импортируем оттуда
    Write-Host ""
    Write-Host "⚠️  Первый метод не сработал, пробуем альтернативный..." -ForegroundColor Yellow
    $tempFileName = "temp_import_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    
    # Копируем файл в контейнер
    Write-Host "📋 Копируем файл в контейнер..." -ForegroundColor Yellow
    $ErrorActionPreference = "Continue"
    $copyOutput = docker cp $sqlFile.FullName "vetlab-db:/tmp/$tempFileName" 2>&1
    $copyExitCode = $LASTEXITCODE
    $ErrorActionPreference = "Stop"
    
    if ($copyExitCode -eq 0) {
        Write-Host "✅ Файл скопирован в контейнер" -ForegroundColor Green
        
        # Импортируем из контейнера
        Write-Host "🔄 Импортируем из контейнера..." -ForegroundColor Yellow
        $ErrorActionPreference = "Continue"
        # Используем ON_ERROR_STOP=off для продолжения при ошибках существующих объектов
        $importOutput2 = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -v ON_ERROR_STOP=off -f "/tmp/$tempFileName" 2>&1
        $importExitCode2 = $LASTEXITCODE
        $ErrorActionPreference = "Stop"
        
        # Показываем важные сообщения
        $importantOutput2 = $importOutput2 | Where-Object { 
            $_ -and (
                $_ -match "ERROR" -or 
                $_ -match "FATAL" -or 
                $_ -match "INSERT" -or 
                $_ -match "CREATE" -or
                ($_ -notmatch 'level=warning' -and $_ -notmatch 'obsolete' -and $_ -notmatch '^$')
            )
        }
        
        if ($importantOutput2) {
            Write-Host "📋 Вывод импорта (метод 2):" -ForegroundColor Gray
            $importantOutput2 | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        }
        
        if ($importExitCode2 -eq 0) {
            # Удаляем временный файл
            $ErrorActionPreference = "Continue"
            docker compose -f docker-compose.production.yml exec -T db rm "/tmp/$tempFileName" 2>&1 | Out-Null
            $ErrorActionPreference = "Stop"
            
            # Проверяем данные
            Write-Host "🔍 Проверяем наличие данных в базе..." -ForegroundColor Cyan
            $ErrorActionPreference = "Continue"
            $tableCheck = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>&1
            $ErrorActionPreference = "Stop"
            
            if ($LASTEXITCODE -eq 0 -and $tableCheck) {
                $tableCount = Get-NumberFromPsqlResult -result $tableCheck
                Write-Host "📊 Найдено таблиц в базе: $tableCount" -ForegroundColor Gray
                
                if ($tableCount -gt 0) {
                    # Проверяем данные
                    Write-Host "🔍 Проверяем данные в основных таблицах..." -ForegroundColor Cyan
                    $ErrorActionPreference = "Continue"
                    
                    $userCount = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM \"User\";" 2>&1
                    if ($LASTEXITCODE -eq 0 -and $userCount) {
                        $userCountNum = Get-NumberFromPsqlResult -result $userCount
                        Write-Host "   👥 Пользователей: $userCountNum" -ForegroundColor Gray
                    }
                    
                    $productCount = docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -t -c "SELECT COUNT(*) FROM \"CatalogItem\";" 2>&1
                    if ($LASTEXITCODE -eq 0 -and $productCount) {
                        $productCountNum = Get-NumberFromPsqlResult -result $productCount
                        Write-Host "   📦 Товаров: $productCountNum" -ForegroundColor Gray
                    }
                    
                    $ErrorActionPreference = "Stop"
                    Write-Host ""
                    Write-Host "✅ Данные успешно импортированы и проверены!" -ForegroundColor Green
                    $importSuccess = $true
                } else {
                    Write-Host "⚠️  Таблицы не найдены!" -ForegroundColor Yellow
                    Write-Host "💡 Проверьте SQL файл на наличие ошибок" -ForegroundColor Yellow
                }
            } else {
                Write-Host "✅ Команда импорта выполнена успешно (exit code: 0)" -ForegroundColor Green
                Write-Host "⚠️  Но не удалось проверить таблицы" -ForegroundColor Yellow
                $importSuccess = $true
            }
        } else {
            Write-Host "❌ Ошибка импорта методом 2 (exit code: $importExitCode2)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Не удалось скопировать файл в контейнер (exit code: $copyExitCode)" -ForegroundColor Red
        if ($copyOutput) {
            Write-Host "Ошибка: $copyOutput" -ForegroundColor Red
        }
    }
}

if (-not $importSuccess) {
    Write-Host ""
    Write-Host "❌ Ошибка импорта данных!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Попробуйте выполнить импорт вручную (PowerShell):" -ForegroundColor Yellow
    Write-Host "   Get-Content $($sqlFile.FullName) -Raw -Encoding UTF8 | docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Или через копирование в контейнер:" -ForegroundColor Yellow
    Write-Host "   docker cp $($sqlFile.FullName) vetlab-db:/tmp/import.sql" -ForegroundColor Gray
    Write-Host "   docker compose -f docker-compose.production.yml exec -T db psql -U vetlab_user vetlab_db -f /tmp/import.sql" -ForegroundColor Gray
    Write-Host ""
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



