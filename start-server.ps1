# PowerShell script to start the development server
Write-Host "Starting Al-Asmakh Development Server..." -ForegroundColor Green
Write-Host ""

# Navigate to project directory
Set-Location "D:\Al-Asmkah-Main\Al-Asmakh2025"

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "Starting server on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
npm run dev
