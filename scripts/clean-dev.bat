@echo off
echo Cleaning Next.js cache and restarting development server...

REM Kill all Node.js processes
taskkill /f /im node.exe >nul 2>&1

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Remove .next folder
if exist .next (
    echo Removing .next folder...
    rmdir /s /q .next
)

REM Remove node_modules/.cache if exists
if exist node_modules\.cache (
    echo Removing node_modules cache...
    rmdir /s /q node_modules\.cache
)

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

echo Starting development server...
npm run dev
