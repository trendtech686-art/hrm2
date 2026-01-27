@echo off
echo Cleaning up cache and build files to free memory...

RD /S /Q .next 2>nul
RD /S /Q node_modules\.cache 2>nul
DEL /Q *.tsbuildinfo 2>nul
DEL /Q tsconfig.tsbuildinfo 2>nul

echo Cleanup complete!
echo.
echo Please restart VS Code for best performance.
pause
