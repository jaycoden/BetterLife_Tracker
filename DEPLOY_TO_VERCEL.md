# Deploy Your Life OS to Vercel

Get a permanent URL like `jaydens-lifeos.vercel.app` that you can bookmark and access anytime, anywhere!

## Why Vercel?

- **Always Online**: No need to run Terminal or start servers
- **Free**: Completely free for personal projects
- **Fast**: Loads instantly from anywhere
- **Secure**: HTTPS automatically enabled
- **Easy Updates**: Just push to GitHub to update

## Step-by-Step Deployment (10 minutes)

### Step 1: Push to GitHub (3 minutes)

1. **Initialize Git** (if not already done):
   ```bash
   cd /Users/jaydendoell/Downloads/claudecode_JayCoden/JAYDENOS_LIFE
   git add .
   git commit -m "Initial commit - Life OS"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Name it `jaydens-life-os` (or any name you like)
   - Keep it **Private** (important for your personal data)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/jaydens-life-os.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up Firebase (2 minutes)

Follow the Firebase setup from `QUICK_START.md` if you haven't already:

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Email/Password and Google authentication
3. Create Firestore database (test mode is fine)
4. Get your Firebase config values

### Step 3: Get Anthropic API Key (1 minute)

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an API key
3. Copy it (starts with `sk-ant-`)

### Step 4: Deploy to Vercel (4 minutes)

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in (use GitHub account)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your `jaydens-life-os` repository
   - Click "Import"

3. **Configure Environment Variables**:
   - Before deploying, click "Environment Variables"
   - Add each variable from your `.env.local`:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = your_value_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789
   NEXT_PUBLIC_FIREBASE_APP_ID = 1:123...
   ANTHROPIC_API_KEY = sk-ant-...
   NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
   ```

   **Important**: For `NEXT_PUBLIC_APP_URL`, you can leave it as the Vercel URL or update it after deployment.

4. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - You'll get a URL like `jaydens-lifeos.vercel.app`

### Step 5: Update Firebase Settings

1. Go back to [Firebase Console](https://console.firebase.google.com/)
2. Go to Authentication → Settings → Authorized domains
3. Add your Vercel domain: `your-project.vercel.app`
4. Click "Add domain"

### Step 6: Bookmark Your Life OS!

1. Visit your new URL: `https://your-project.vercel.app`
2. Create your account
3. **Bookmark it!** (⌘+D or Ctrl+D)
4. Add it to your favorites bar or home screen

## Daily Usage

Just open your bookmark! No Terminal, no server, no setup needed. Your Life OS is always ready.

## Updating Your Life OS

When you want to add features or make changes:

```bash
git add .
git commit -m "Add new feature"
git push
```

Vercel will automatically rebuild and deploy your changes in ~2 minutes!

## Custom Domain (Optional)

Want `lifeos.yourdomain.com` instead of Vercel's URL?

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update your DNS settings (Vercel will show you how)

## Troubleshooting

**Build Failed:**
- Check the build logs in Vercel
- Make sure all environment variables are set

**Can't Sign In:**
- Verify Firebase authorized domains includes your Vercel URL
- Check environment variables are correct

**API Errors:**
- Verify Anthropic API key is valid
- Check you have credits in your account

## Cost

- **Vercel**: Free (unlimited for personal use)
- **Firebase**: Free tier (generous limits for personal use)
- **Anthropic API**: Pay as you go (typical usage: $1-5/month)

Total: ~$1-5/month (mostly Anthropic usage)

---

**Ready to deploy?** Follow the steps above and you'll have your Life OS online in 10 minutes! 🚀
