@echo off
REM Quick launcher for import-database.ps1
REM Быстрый запуск скрипта импорта базы данных

echo Запуск скрипта импорта базы данных...
echo.

cd /d "%~dp0\.."
powershell -ExecutionPolicy Bypass -File "%~dp0import-database.ps1"

pause






