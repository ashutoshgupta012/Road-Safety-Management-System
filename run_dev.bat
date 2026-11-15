@echo off
TITLE Road Safety Management System - Full Development Mode
color 0A
echo =========================================================================
echo       ROAD SAFETY SYSTEM - FULL DEV MODE (Flask:5000 + Vite:5173)
echo =========================================================================
echo.

cd /d "%~dp0"

echo Starting Python Flask Backend on port 5000 in background window...
start "RSMS Backend Server (Flask :5000)" cmd /k "python backend\app.py"

timeout /t 2 >nul

echo Starting Vite React Frontend on port 5173 with proxy...
start "" cmd /c "timeout /t 3 >nul && start http://localhost:5173"
cd frontend
cmd /c "npm run dev"

pause
