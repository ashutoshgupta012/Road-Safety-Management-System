@echo off
TITLE Push Road Safety Management System to GitHub
cd /d "%~dp0"
echo ========================================================
echo   Pushing project to GitHub repository:
echo   https://github.com/ashutoshgupta012/Road-Safety-Management-System.git
echo ========================================================
echo.
git push -u origin main
echo.
pause
