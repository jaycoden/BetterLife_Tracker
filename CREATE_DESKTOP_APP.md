# Create Desktop App for Life OS

Follow these steps to create a clickable desktop icon for your Life OS.

## Method 1: Using Automator (Recommended - 2 minutes)

### Step 1: Open Automator

1. Press `⌘ + Space` to open Spotlight
2. Type "Automator" and press Enter
3. Click "New Document"
4. Choose **"Application"** and click "Choose"

### Step 2: Create the Script

1. In the left sidebar, search for "Run Shell Script"
2. Drag "Run Shell Script" to the right panel
3. Paste this code:

```bash
/Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE/launch-lifeos.sh
```

4. Make sure "Shell: /bin/bash" is selected at the top

### Step 3: Save the Application

1. Press `⌘ + S` to save
2. Name it: **"Life OS"**
3. Save location: **Desktop** (or Applications folder)
4. Click "Save"

### Step 4: Add a Cool Icon (Optional)

1. Find an icon you like (or use emoji)
2. Right-click the "Life OS" app on your Desktop
3. Click "Get Info"
4. Click the small icon at the top left
5. Press `⌘ + V` to paste a new icon (copy one first with `⌘ + C`)

### Step 5: Test It!

Double-click the "Life OS" app on your Desktop. It should:
- Start the server automatically
- Open your browser to http://localhost:3000
- Show a notification when ready

---

## Method 2: Using Script Editor (Alternative)

### Step 1: Open Script Editor

1. Press `⌘ + Space` and type "Script Editor"
2. Press Enter

### Step 2: Paste This AppleScript

```applescript
do shell script "/Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE/launch-lifeos.sh"
```

### Step 3: Save as Application

1. Click File → Export
2. Name: **"Life OS"**
3. File Format: **Application**
4. Save to: **Desktop**
5. Click "Save"

---

## Method 3: Quick Shortcut (Fastest - 30 seconds)

### Create a Desktop Alias

1. Open Terminal
2. Run this command:

```bash
ln -s /Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE/launch-lifeos.sh ~/Desktop/Life\ OS
```

3. Double-click "Life OS" on your Desktop to launch!

---

## Usage

### Starting Life OS

1. Double-click the "Life OS" icon on your Desktop
2. Wait a few seconds for the server to start
3. Your browser will open automatically
4. You'll see a notification when it's ready

### Stopping Life OS

**Option 1: Quit from Terminal**
1. Open Terminal
2. Run: `pkill -f "npm run dev"`

**Option 2: Create a Stop Script**
- I can create a "Stop Life OS" desktop icon too if you want

---

## Troubleshooting

**App won't open:**
- Right-click the app → Open
- Click "Open" in the security dialog
- This only needs to be done once

**Server not starting:**
- Check that you've configured `.env.local`
- See `QUICK_START.md` for setup instructions

**Browser doesn't open:**
- Manually open: http://localhost:3000
- Check `lifeos.log` file for errors

---

## First Time Setup

Before using the desktop app, you need to:

1. **Configure Firebase** (see `QUICK_START.md`)
2. **Add Anthropic API key** (see `QUICK_START.md`)
3. **Edit `.env.local`** with your credentials

---

## Want to Stop the Server Later?

I can create a "Stop Life OS" desktop icon too. Let me know!

---

**Ready?** Choose Method 1 (Automator) and follow the steps above. You'll have a desktop app in 2 minutes! 🚀
