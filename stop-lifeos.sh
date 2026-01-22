#!/bin/bash

# Jayden's Life OS - Stop Script
# This script stops the Life OS server

PROJECT_DIR="/Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE"
PID_FILE="$PROJECT_DIR/lifeos.pid"

# Check if PID file exists
if [ ! -f "$PID_FILE" ]; then
    osascript -e 'display notification "Life OS is not running" with title "Life OS" sound name "Glass"'
    exit 0
fi

# Read PID and kill the process
PID=$(cat "$PID_FILE")
if ps -p $PID > /dev/null 2>&1; then
    kill $PID
    rm -f "$PID_FILE"
    osascript -e 'display notification "Life OS server has been stopped" with title "Life OS Stopped" sound name "Glass"'
    echo "✅ Life OS stopped successfully"
else
    rm -f "$PID_FILE"
    osascript -e 'display notification "Life OS was not running" with title "Life OS" sound name "Glass"'
    echo "ℹ️  Life OS was not running"
fi

# Also kill any remaining npm dev processes just in case
pkill -f "next dev" 2>/dev/null || true
