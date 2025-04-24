@echo off
setlocal enabledelayedexpansion

REM === CONFIGURATION ===
set "PYTHON_VERSION=3.11.8"
set "PYTHON_ZIP=python-%PYTHON_VERSION%-embed-amd64.zip"
set "PYTHON_URL=https://www.python.org/ftp/python/%PYTHON_VERSION%/%PYTHON_ZIP%"
set "PYTHON_DIR=setup\python"
set "PYTHON_EXE=%PYTHON_DIR%\python.exe"

set "NODE_VERSION=v20.11.1"
set "NODE_ZIP=node-%NODE_VERSION%-win-x64.zip"
set "NODE_URL=https://nodejs.org/dist/%NODE_VERSION%/node-%NODE_VERSION%-win-x64.zip"
set "NODE_DIR=setup\node"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [INFO] Starting full plugin setup...
echo --------------------------------------

REM === STEP 1: Setup Node.js ===
%NODE_EXE% --version >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  echo [WARN] Node.js not found. Downloading portable version...
  IF NOT EXIST "%NODE_DIR%" mkdir "%NODE_DIR%"
  powershell -Command "Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_ZIP%'"
  powershell -Command "Expand-Archive -Path '%NODE_ZIP%' -DestinationPath '%NODE_DIR%'"
  del "%NODE_ZIP%"

  REM Flatten if nested
  IF EXIST "%NODE_DIR%\node-%NODE_VERSION%-win-x64" (
    xcopy /E /I /Y "%NODE_DIR%\node-%NODE_VERSION%-win-x64\*" "%NODE_DIR%\"
    rmdir /S /Q "%NODE_DIR%\node-%NODE_VERSION%-win-x64"
  )
)

echo [INFO] Using Node: %NODE_EXE%
%NODE_EXE% --version

echo [INFO] Installing Node dependencies...
%NPM_CMD% install
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)

REM === STEP 2: Setup Python ===
%PYTHON_EXE% --version >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  echo [WARN] Python not found. Downloading portable version...
  IF NOT EXIST "%PYTHON_DIR%" mkdir "%PYTHON_DIR%"
  powershell -Command "Invoke-WebRequest -Uri '%PYTHON_URL%' -OutFile '%PYTHON_ZIP%'"
  powershell -Command "Expand-Archive -Path '%PYTHON_ZIP%' -DestinationPath '%PYTHON_DIR%'"
  del "%PYTHON_ZIP%"

  echo [INFO] Bootstrapping pip into embedded Python...
  echo import ensurepip; ensurepip.bootstrap() > "%PYTHON_DIR%\getpip.py"
  %PYTHON_EXE% "%PYTHON_DIR%\getpip.py"
  del "%PYTHON_DIR%\getpip.py"
)

:: Ensure pyftsubset (from pip) is discoverable by PATH
set "PYTHON_SCRIPTS=%PYTHON_DIR%\Scripts"
set "PATH=%PYTHON_SCRIPTS%;%PATH%"

echo [INFO] Using Python: %PYTHON_EXE%
%PYTHON_EXE% --version

echo [INFO] Installing Python dependencies...
%PYTHON_EXE% -m pip install --upgrade pip
%PYTHON_EXE% -m pip install fonttools brotli

echo.
echo --------------------------------------
echo [✅] Setup complete!
echo Python: %PYTHON_EXE%
echo Node:   %NODE_EXE%
echo --------------------------------------

pause
