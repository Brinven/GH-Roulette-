@echo off
echo ========================================
echo   GitHub Roulette - Starting App
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/3] Checking dependencies...
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo Dependencies found.
)

echo.
echo [2/3] Starting development server...
echo.
echo The app will be available at: http://localhost:3000
echo Browser will open automatically in 3 seconds...
echo Press Ctrl+C to stop the server
echo.

REM Wait a bit for the server to start, then open browser
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Start the dev server
call npm run dev

REM If the server exits, pause so user can see any error messages
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Server exited with an error.
    pause
)

