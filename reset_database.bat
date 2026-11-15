@echo off
TITLE Reset Road Safety SQL Database
color 0E
echo =========================================================================
echo       ROAD SAFETY MANAGEMENT SYSTEM - DATABASE RESET & SEED TOOL
echo =========================================================================
echo.
echo This will reset the SQLite database (road_safety.db) with fresh seed
echo data including sample accident blackspots, traffic rules, and demo accounts.
echo.
set /p confirm="Are you sure you want to proceed? (Y/N): "
if /i "%confirm%" neq "y" goto cancel

cd /d "%~dp0"
python -c "import os; os.remove('backend/database/road_safety.db') if os.path.exists('backend/database/road_safety.db') else None"
python backend\database\db.py
echo.
echo [SUCCESS] Database successfully re-created and seeded!
pause
exit /b 0

:cancel
echo Reset cancelled by user.
pause
