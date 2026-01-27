@echo off
echo ============================================
echo FORCE RESTART - Killing all related processes
echo ============================================
echo.

echo Stopping VS Code...
taskkill /F /IM Code.exe 2>nul
timeout /t 2 /nobreak >nul

echo Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Stopping TypeScript server...
taskkill /F /IM tsserver.exe 2>nul
timeout /t 1 /nobreak >nul

echo Cleaning cache...
rd /s /q .next 2>nul
rd /s /q node_modules\.cache 2>nul
rd /s /q node_modules\.vite 2>nul
del /q *.tsbuildinfo 2>nul
del /q tsconfig.tsbuildinfo 2>nul

echo.
echo ============================================
echo Done! Now you can:
echo 1. Wait 5 seconds
echo 2. Open VS Code again
echo ============================================
pause
