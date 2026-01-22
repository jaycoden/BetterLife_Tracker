# Quick Start Guide - Jayden's Life OS

## Get Your Life OS Running in 5 Minutes

### Step 1: Configure Firebase (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (name it anything, like "Jayden Life OS")
3. **Enable Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Get Started"
   - Click "Sign-in method" tab
   - Enable "Email/Password" (toggle it on)
   - Enable "Google" (toggle it on, add your email as support email)
4. **Create Firestore Database**:
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (easier for now)
   - Select a location close to you
   - Click "Enable"
5. **Get your config**:
   - Click the gear icon ⚙️ next to "Project Overview"
   - Click "Project settings"
   - Scroll down to "Your apps"
   - Click the web icon `</>`
   - Register your app (name it "Life OS")
   - Copy the firebaseConfig object values

### Step 2: Get Anthropic API Key (1 minute)

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create Key"
5. Copy the API key (starts with `sk-ant-`)

### Step 3: Configure Environment Variables (1 minute)

Open the file `.env.local` in your project folder and paste in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...  (from Firebase config)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

ANTHROPIC_API_KEY=sk-ant-...  (your Anthropic key)

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Start the App (30 seconds)

Open Terminal and run:

```bash
cd /Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE
./start-lifeos.sh
```

Or simply:

```bash
npm run dev
```

### Step 5: Bookmark It!

1. Open your browser to: **http://localhost:3000**
2. Create an account (sign up)
3. Bookmark the page (⌘+D on Mac, Ctrl+D on Windows)
4. Name it "My Life OS" or "Daily Dashboard"

## Daily Usage

**To start your Life OS each day:**

1. Open Terminal
2. Run: `cd /Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE && npm run dev`
3. Open your bookmark: http://localhost:3000

**To stop it:**
- Press `Ctrl+C` in the Terminal

## Make it Even Easier (Optional)

### Create a Desktop Shortcut (Mac)

1. Open Automator (search in Spotlight)
2. Choose "Application"
3. Add "Run Shell Script" action
4. Paste this:
   ```bash
   cd /Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE
   npm run dev
   ```
5. Save as "Life OS" on your Desktop
6. Double-click to start!

### Or Create an Alfred/Raycast Command

Add this as a custom script:
```bash
cd /Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE && npm run dev
```

## Troubleshooting

**"Server not running" when I open the bookmark:**
- Make sure you started the app in Terminal first
- Check that you see "Ready in..." in the Terminal output

**"Firebase error":**
- Double-check your `.env.local` file has the correct values
- Make sure you enabled Email/Password auth in Firebase Console

**"API error":**
- Verify your Anthropic API key is correct
- Check you have credits in your Anthropic account

## Next Steps

Once you're logged in:
1. Set up your smoke-free tracker
2. Create your first goal
3. Complete a daily check-in
4. Write a journal entry

Enjoy your Life OS! 🚀
