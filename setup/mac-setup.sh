#!/bin/bash
# setup.sh (macOS/Linux plugin setup with Python version-agnostic path resolution)

set -e

# Check for Python 3
if ! command -v python3 >/dev/null; then
  echo ""
  echo "❌ Python 3 is not installed."
  echo ""
  echo "Please install Python (which includes pip) from:"
  echo "  https://www.python.org/ftp/python/3.11.8/python-3.11.8-macos11.pkg"
  echo ""
  echo "✅ During installation, make sure to CHECK the box to add Python to your PATH."
  echo "🔁 Restart your terminal after installation."
  echo ""
  exit 1
fi

# Check for pip3
if ! command -v pip3 >/dev/null; then
  echo ""
  echo "❌ pip3 is not installed."
  echo ""
  echo "Please reinstall Python (which includes pip) from:"
  echo "  https://www.python.org/ftp/python/3.11.8/python-3.11.8-macos11.pkg"
  echo ""
  echo "✅ During installation, make sure to CHECK the box to add Python to your PATH."
  echo "🔁 Restart your terminal after installation."
  echo ""
  echo "Or, follow the pip-only installation guide here:"
  echo "  https://pip.pypa.io/en/stable/installation/"
  echo ""
  exit 1
fi

# Install Node dependencies
echo "📦 Installing Node dependencies via npm..."
npm install

# Get user script path based on Python version
TARGET="$(python3 -m site --user-base)/bin"

# Install Python dependencies
echo "📦 Installing fonttools and brotli via pip3..."
pip3 install --user fonttools brotli

# Add to PATH if not already added
if ! grep -q "$TARGET" "$HOME/.zshrc"; then
  echo "📄 Adding $TARGET to PATH in ~/.zshrc"
  echo "export PATH=\"$TARGET:\$PATH\"" >> "$HOME/.zshrc"
else
  echo "✅ PATH already includes $TARGET"
fi

# Apply path in current shell
export PATH="$TARGET:$PATH"

# Confirm pyftsubset is available
if command -v pyftsubset >/dev/null 2>&1; then
  echo "✅ pyftsubset is now available in PATH"
else
  echo "⚠️ pyftsubset not found after install. You may need to restart your terminal."
fi
