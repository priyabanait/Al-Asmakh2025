@echo off
echo Starting Al-Asmakh Development Server...
echo.
cd /d "D:\Al-Asmkah-Main\Al-Asmakh2025"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm run dev
pause
