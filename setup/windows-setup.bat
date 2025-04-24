@echo off
setlocal enabledelayedexpansion

REM === BASE PATHS ===
set "SCRIPT_DIR=%~dp0"
set "NODE_DIR=%SCRIPT_DIR%node"
set "PYTHON_DIR=%SCRIPT_DIR%python"

REM === NODE CONFIG ===
set "NODE_VERSION=v20.11.1"
set "NODE_ZIP=node-%NODE_VERSION%-win-x64.zip"
set "NODE_URL=https://nodejs.org/dist/%NODE_VERSION%/%NODE_ZIP%"
set "NODE_ZIP_PATH=%NODE_DIR%\%NODE_ZIP%"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

REM === PYTHON CONFIG ===
set "PYTHON_VERSION=3.11.8"
set "PYTHON_ZIP=python-%PYTHON_VERSION%-embed-amd64.zip"
set "PYTHON_URL=https://www.python.org/ftp/python/%PYTHON_VERSION%/%PYTHON_ZIP%"
set "PYTHON_ZIP_PATH=%PYTHON_DIR%\%PYTHON_ZIP%"
set "PYTHON_EXE=%PYTHON_DIR%\python.exe"

echo.
echo ======================================
echo [INFO] Starting full plugin setup...
echo ======================================
echo.

REM === NODE SETUP ===
IF EXIST "%NODE_EXE%" (
  echo [SUCCESS] Node.js already present at: %NODE_EXE%
) ELSE (
  echo Node.js not found. Downloading portable version...

  IF NOT EXIST "%NODE_DIR%" mkdir "%NODE_DIR%"

  echo.
  echo ======================================
  echo [INFO] Downloading Node.js...
  echo This may take a minute. Please wait.
  echo ======================================
  echo.

  powershell -Command "Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_ZIP_PATH%'"

  echo [INFO] Extracting Node...
  powershell -Command "Expand-Archive -Path '%NODE_ZIP_PATH%' -DestinationPath '%NODE_DIR%'"
  del "%NODE_ZIP_PATH%"

  IF EXIST "%NODE_DIR%\node-%NODE_VERSION%-win-x64" (
    xcopy /E /I /Y "%NODE_DIR%\node-%NODE_VERSION%-win-x64\*" "%NODE_DIR%\"
    rmdir /S /Q "%NODE_DIR%\node-%NODE_VERSION%-win-x64"
  )

  echo [INFO] Cleaning unnecessary Node files...
  del "%NODE_DIR%\README.md" >nul 2>nul
  del "%NODE_DIR%\LICENSE" >nul 2>nul
  del "%NODE_DIR%\corepack*" >nul 2>nul
  del "%NODE_DIR%\install_tools.bat" >nul 2>nul
  del "%NODE_DIR%\nodevars.bat" >nul 2>nul

  IF EXIST "%NODE_EXE%" (
    echo [SUCCESS] Node.js successfully installed at: %NODE_EXE%
  ) ELSE (
    echo [ERROR] Node installation failed.
    pause
    exit /b 1
  )
)

echo.
echo ======================================
echo [INFO] Installing Node dependencies...
echo ======================================
echo.

%NPM_CMD% install
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)
echo [SUCCESS] npm dependencies installed.

REM === PYTHON SETUP ===
where python >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
  echo [SUCCESS] System Python found.
  set "PYTHON_EXE=python"
) ELSE (
  echo Python not found. Downloading portable version...

  IF NOT EXIST "%PYTHON_DIR%" mkdir "%PYTHON_DIR%"

  echo.
  echo ======================================
  echo [INFO] Downloading Python...
  echo This may take a minute. Please wait.
  echo ======================================
  echo.

  powershell -Command "Invoke-WebRequest -Uri '%PYTHON_URL%' -OutFile '%PYTHON_ZIP_PATH%'"

  echo [INFO] Extracting Python...
  powershell -Command "Expand-Archive -Path '%PYTHON_ZIP_PATH%' -DestinationPath '%PYTHON_DIR%'"
  del "%PYTHON_ZIP_PATH%"

  echo [INFO] Bootstrapping pip into embedded Python...
  echo import ensurepip; ensurepip.bootstrap() > "%PYTHON_DIR%\getpip.py"
  %PYTHON_DIR%\python.exe "%PYTHON_DIR%\getpip.py"
  del "%PYTHON_DIR%\getpip.py"

  IF EXIST "%PYTHON_EXE%" (
    echo [SUCCESS] Portable Python installed at: %PYTHON_EXE%
  ) ELSE (
    echo [ERROR] Python installation failed.
    pause
    exit /b 1
  )

  set "PYTHON_SCRIPTS=%PYTHON_DIR%\Scripts"
  set "PATH=%PYTHON_SCRIPTS%;%PATH%"
)

echo.
echo ======================================
echo [INFO] Installing Python dependencies...
echo ======================================
echo.

echo [INFO] Using Python: %PYTHON_EXE%
%PYTHON_EXE% --version

%PYTHON_EXE% -m pip install --upgrade pip
%PYTHON_EXE% -m pip install fonttools brotli
echo [SUCCESS] Python packages installed.

echo.
echo ======================================
echo [✅] Setup complete!
echo Python: %PYTHON_EXE%
echo Node:   %NODE_EXE%
echo ======================================
echo.

pause
