# Jayden's Life OS

A comprehensive personal productivity and life tracking system built with Next.js 14, Firebase, and Claude AI.

## Features

- **Smoke-Free Tracker**: Track your journey to quitting smoking with daily check-ins, milestones, and money saved
- **Daily Check-ins**: Morning routines and evening reviews to start and end your day with intention
- **Journal**: Capture thoughts and reflections with AI-powered analysis and insights
- **Goal Tracking**: Set and monitor short-term and long-term goals with milestone tracking
- **Habit Trackers**: Build positive habits with customizable trackers and streak monitoring
- **Work Dashboard**: Manage projects, tasks, and time tracking for your freelance/work life
- **Weekly Reviews**: Get AI-generated insights from your weekly data
- **AI Insights**: Powered by Claude AI to provide personalized recommendations and pattern recognition

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password + Google)
- **AI**: Anthropic Claude API
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Anthropic API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd JAYDENOS_LIFE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google
4. Create a Firestore Database:
   - Go to Firestore Database > Create database
   - Start in production mode or test mode
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" and click the web icon
   - Copy your Firebase configuration values

### 4. Set Up Anthropic API

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key and copy it

### 5. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Firebase and Anthropic credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your Account

1. Click "Sign up" on the login page
2. Create an account with email/password or use Google Sign-In
3. You'll be redirected to the dashboard

## Project Structure

```
JAYDENOS_LIFE/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Main dashboard
│   ├── daily/               # Daily check-ins
│   ├── journal/             # Journal entries
│   ├── goals/               # Goal tracking
│   ├── trackers/            # Habit trackers
│   ├── work/                # Work dashboard
│   ├── weekly/              # Weekly reviews
│   ├── insights/            # AI insights
│   ├── login/               # Login page
│   └── signup/              # Signup page
├── components/              # React components
│   ├── layout/              # Layout components
│   ├── trackers/            # Tracker components
│   ├── goals/               # Goal components
│   └── shared/              # Shared/common components
├── lib/                     # Core utilities
│   ├── firebase/            # Firebase configuration
│   ├── ai/                  # Claude AI integration
│   ├── hooks/               # React hooks
│   └── utils/               # Helper functions
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Firebase Firestore Structure

The app uses the following Firestore collections:

- `users/{userId}` - User profiles and settings
- `journal/{entryId}` - Journal entries
- `goals/{goalId}` - User goals
- `trackers/{trackerId}` - Habit trackers
- `projects/{projectId}` - Work projects
- `tasks/{taskId}` - Work tasks
- `timeEntries/{entryId}` - Time tracking entries
- `dailyCheckins/{checkinId}` - Morning/evening check-ins

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features to Build Next

This is the foundation. Here are some features you can implement:

1. **Smoke-Free Tracker Logic**: Implement the quit date setter and stats calculator
2. **Journal with AI Analysis**: Create journal entry forms with Claude AI integration
3. **Goal Management**: Build CRUD operations for goals and milestones
4. **Custom Habit Trackers**: Allow users to create and manage custom trackers
5. **Work Time Tracking**: Implement timer and time entry management
6. **Daily Check-in Forms**: Build morning routine and evening review forms
7. **Weekly Review Generator**: Integrate Claude AI to generate weekly summaries
8. **Data Visualization**: Add charts and graphs for progress tracking
9. **Notifications**: Add email/push notifications for reminders
10. **Export Data**: Allow users to export their data

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel settings
5. Deploy

### Important Notes

- Make sure to add your environment variables in Vercel's project settings
- Update `NEXT_PUBLIC_APP_URL` to your production URL
- Configure Firebase for your production domain

## Contributing

This is a personal project, but feel free to fork and customize for your own use.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
