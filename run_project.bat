@echo off
TITLE Road Safety Management & Analysis System - Unified Runner
color 0B
echo =========================================================================
echo       ROAD SAFETY MANAGEMENT AND ANALYSIS SYSTEM (MAJOR PROJECT)
echo       Tech Stack: React.js + Python Flask + SQL + OpenStreetMap
echo =========================================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Python environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not added to your system PATH!
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

echo [2/4] Verifying Python backend dependencies (Flask, Flask-Cors)...
pip install -r backend\requirements.txt --quiet --disable-pip-version-check

echo [3/4] Ensuring SQL Database and initial datasets are initialized...
python backend\database\db.py

echo [4/4] Starting Flask Backend & Web Application Server on http://127.0.0.1:5000 ...
echo.
echo =========================================================================
echo   SYSTEM IS READY!
echo   * URL: http://127.0.0.1:5000
echo   * Admin Login:   admin / admin123
echo   * Citizen Login: rahul_sharma / user123
echo   * Press CTRL+C in this terminal window to stop the server anytime.
echo =========================================================================
echo.

:: Launch the browser after 2 seconds in the background
start "" cmd /c "timeout /t 2 >nul && start http://127.0.0.1:5000"

:: Start Flask server (serves both REST API and React UI)
python backend\app.py

pause
