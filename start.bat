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

REM Set default port to 3001 (to avoid conflicts with OpenWebUI on 3000)
REM You can override by setting PORT environment variable before running this script
if not defined PORT set PORT=3001

echo The app will be available at: http://localhost:%PORT%
echo.
echo Press Ctrl+C to stop the server
echo.
echo Note: To change the port, set PORT=XXXX before running this script
echo       Example: set PORT=3002
echo       Then run: start.bat
echo       Or edit this file and change the default port
echo.

REM Set PORT and start Next.js dev server using npx (finds local next in node_modules)
set PORT=%PORT%
npx next dev -p %PORT%

REM If we get here, the server exited
echo.
echo Server has stopped.
pause
