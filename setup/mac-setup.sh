#!/bin/bash
# setup.sh (macOS/Linux plugin setup with Python version-agnostic path resolution)

set -e

# Check for Python 3
if ! command -v python3 >/dev/null; then
  echo "❌ Python 3 is not installed. Please install it from https://www.python.org/downloads/"
  exit 1
fi

# Check for pip3
if ! command -v pip3 >/dev/null; then
  echo "❌ pip3 is missing. Try reinstalling Python 3 or follow: https://pip.pypa.io/en/stable/installation/"
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