@echo off
cd /d "%~dp0"

:: Cari Chrome
set CHROME=
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"      set CHROME="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if exist "%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"       set CHROME="%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"
if exist "%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe"  set CHROME="%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe"

if not defined CHROME (
    echo [!] Chrome tidak ditemukan. Buka manual: http://localhost:8765/index.html
    pause & exit /b
)

:: Start server (PowerShell bawaan Windows — tidak perlu install apapun)
netstat -ano | findstr ":8765 " >nul 2>&1
if %errorlevel% neq 0 (
    start /b powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "%~dp0server.ps1"
    timeout /t 1 /nobreak >nul
)

start "" %CHROME% "http://localhost:8765/index.html"
