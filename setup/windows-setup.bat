@echo off
REM setup.bat (Windows plugin setup: installs Python + Node deps and checks PATH dynamically)

where python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  echo ❌ Python is not installed. Download from https://www.python.org/downloads/windows/
  pause
  exit /b 1
)

where pip >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
  echo ❌ pip is not installed. Try reinstalling Python or follow https://pip.pypa.io/en/stable/installation/
  pause
  exit /b 1
)

echo 📦 Installing Node dependencies via npm...
npm install

echo 📦 Installing fonttools and brotli via pip...
pip install --user fonttools brotli

REM Dynamically resolve the user-level scripts path
FOR /F "tokens=* USEBACKQ" %%F IN (`python -m site --user-base`) DO SET PYTHON_USER_BASE=%%F
SET PYTHON_USER_SCRIPTS=%PYTHON_USER_BASE%\Scripts

echo 💡 Make sure this folder is in your PATH: %PYTHON_USER_SCRIPTS%
echo If pyftsubset doesn’t work, add it manually via System > Environment Variables

IF EXIST "%PYTHON_USER_SCRIPTS%\pyftsubset.exe" (
  echo ✅ pyftsubset.exe found at %PYTHON_USER_SCRIPTS%
) ELSE (
  echo ⚠️ pyftsubset.exe not found. Check Python version or re-run installer.
)

pause