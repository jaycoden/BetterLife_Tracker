#!/bin/bash

# Jayden's Life OS - Desktop Launcher
# This script starts the server and opens the browser

PROJECT_DIR="/Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE"
LOG_FILE="$PROJECT_DIR/lifeos.log"
PID_FILE="$PROJECT_DIR/lifeos.pid"

# Function to check if server is already running
is_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Check if already running
if is_running; then
    echo "Life OS is already running!"
    # Just open the browser
    sleep 1
    open http://localhost:3000
    exit 0
fi

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Check if .env.local exists
if [ ! -f .env.local ]; then
    osascript -e 'display dialog "⚠️ Please configure your .env.local file first!\n\nSee QUICK_START.md for instructions." buttons {"OK"} default button "OK" with icon caution with title "Life OS - Configuration Required"'
    open "$PROJECT_DIR"
    exit 1
fi

# Start the development server in background
echo "🚀 Starting Life OS..." > "$LOG_FILE"
npm run dev >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > "$PID_FILE"

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Server is ready!"
        sleep 1
        open http://localhost:3000

        # Show success notification
        osascript -e 'display notification "Your Life OS is now running at http://localhost:3000" with title "Life OS Started" sound name "Glass"'
        exit 0
    fi
    sleep 1
done

# Server failed to start
echo "❌ Server failed to start. Check the logs."
osascript -e 'display dialog "Failed to start Life OS server.\n\nCheck lifeos.log for details." buttons {"OK"} default button "OK" with icon stop with title "Life OS - Error"'
rm -f "$PID_FILE"
exit 1
