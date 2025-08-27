#!/bin/bash

# OpenCode Quick Setup Script
# One-command setup for the collaborative coding platform

echo "🚀 OpenCode Quick Setup"
echo "======================"
echo ""

# Check if Python is installed
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python first."
    echo "   Visit: https://www.python.org/downloads/"
    exit 1
fi

# Create images directory if it doesn't exist
echo "📁 Creating necessary directories..."
mkdir -p images/favicon

# Create placeholder favicon files to avoid 404 errors
touch images/favicon/favicon-16x16.png
touch images/favicon/favicon-32x32.png

# Find an available port
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
    echo "⚠️  Port $PORT is in use, trying port $((PORT + 1))..."
    PORT=$((PORT + 1))
done

echo "✅ Setup complete!"
echo ""
echo "🌐 Starting server on port $PORT..."
echo "=================================="
echo ""
echo "📝 Access the app at: http://localhost:$PORT"
echo ""
echo "🔐 Admin credentials:"
echo "   Email: admin@opencode.com"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
if [ "$PYTHON_CMD" = "python3" ]; then
    $PYTHON_CMD -m http.server $PORT
else
    $PYTHON_CMD -m SimpleHTTPServer $PORT
fi