# Habit Tracker with AI Onboarding

A mobile-first habit tracking application with an intelligent chatbot onboarding experience powered by OpenAI's ChatGPT. The chatbot asks proactive questions to understand your goals and helps you define meaningful, trackable habits.

## Features

- **AI-Powered Onboarding**: Conversational chatbot that asks thoughtful questions to understand your habits
- **Dual Mode Experience**:
  - **Chat Mode**: Text-based conversation with OpenAI GPT
  - **Voice Mode**: Call-like interface with real-time voice AI powered by VAPI
- **Multi-Step Progress Indicator**: Visual progress tracker showing your onboarding journey (Goals → Habits → Details → Review)
- **Real-time Habit Visualization**: See your habits being extracted and displayed as you chat or speak
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly UI
- **Streak Tracking**: Automatically calculates and displays your habit streaks
- **Weekly Overview**: Visual calendar showing your progress throughout the week
- **Local Storage**: Your habits and progress are saved locally in your browser
- **Beautiful Gradients & Animations**: Modern, colorful UI with smooth fade-in and slide-up transitions

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o-mini) for chat mode
- VAPI for voice mode with real-time AI conversations
- date-fns for date manipulation
- lucide-react for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys)) for chat mode
- VAPI account ([Sign up here](https://vapi.ai)) for voice mode (optional)

### Installation

1. Clone the repository and navigate to the project:

```bash
cd habit-tracker
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:

**Required for Chat Mode:**
```
OPENAI_API_KEY=sk-your-api-key-here
```

**Optional for Voice Mode:**
```
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your-vapi-assistant-id
```

> **Note**: Chat mode works out of the box with just the OpenAI key. Voice mode requires VAPI configuration (see [VAPI Setup](#vapi-setup) below).

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser (or open on your phone using your local IP address for mobile testing)

## How It Works

### Onboarding Flow

The onboarding experience is designed with a 4-step visual progress indicator:

**Step 1: Goals** 🎯
- The chatbot greets you and asks about areas of your life you want to improve

**Step 2: Habits** ✨
- The bot helps you articulate specific, actionable habits

**Step 3: Details** 📋
- It asks follow-up questions to understand:
  - How frequently you want to track each habit (daily/weekly)
  - What time of day works best (morning/afternoon/evening/anytime)

**Step 4: Review** ✅
- As the chatbot identifies habits, they appear in a preview card at the bottom
- Review your habits and click "Start Tracking These Habits" to begin

### Voice & Chat Modes

The app offers two distinct onboarding experiences:

#### Chat Mode (Default)
- Text-based conversation with GPT-4o-mini
- Type your responses using the keyboard
- Perfect for detailed, thoughtful responses
- Works with just an OpenAI API key

#### Voice Mode
- Tap the **phone icon** 📞 to switch to voice mode
- **Call-like interface** with real-time voice AI
- Features:
  - Large animated avatar that responds to voice
  - Call controls: mute, speaker, end call
  - Live transcription display (optional)
  - Real-time conversation with natural speech
  - Automatic step progression
- Powered by VAPI for human-like voice interactions
- Tap "Switch to Chat" to return to text mode anytime

### Tracking Habits

- Tap any habit to mark it complete for today
- View your completion rate at the top (Today %)
- See your longest streak (Streak)
- Check the weekly calendar to see your progress
- Tap the settings icon to reset and start a new onboarding

### Data Persistence

All your habits and completion data are stored in browser localStorage, so your progress persists between sessions.

## Project Structure

```
habit-tracker/
├── app/
│   ├── api/chat/route.ts      # OpenAI API endpoint
│   ├── page.tsx               # Main app component
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles & animations
├── components/
│   ├── Onboarding.tsx         # Main onboarding coordinator
│   ├── VoiceOnboarding.tsx    # Voice mode with call-like UI
│   ├── HabitPreview.tsx       # Habit preview card
│   ├── HabitTracker.tsx       # Main habit tracking dashboard
│   └── StepIndicator.tsx      # Multi-step progress indicator
├── types/
│   └── habit.ts               # TypeScript types
└── utils/
    ├── habitParser.ts         # Extract habits from chat messages
    └── storage.ts             # localStorage utilities
```

## VAPI Setup

To enable voice mode, you need to set up a VAPI assistant:

1. **Sign up for VAPI**
   - Go to [vapi.ai](https://vapi.ai) and create an account
   - Get your Public Key from the dashboard

2. **Create an Assistant**
   - In the VAPI dashboard, create a new assistant
   - Configure it with a similar system prompt as the chat mode (see `app/api/chat/route.ts` for inspiration)
   - Important instructions for the assistant:
     ```
     You are a habit coach helping users discover habits to track.
     Ask about their goals, help them define specific habits, and extract:
     - Habit name
     - Frequency (daily/weekly)
     - Time of day (morning/afternoon/evening/anytime)

     When you identify a habit, format it as:
     [HABIT: <name> | FREQUENCY: <frequency> | TIME: <time>]
     ```
   - Copy the Assistant ID

3. **Add to Environment Variables**
   ```
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your-assistant-id
   ```

4. **Test Voice Mode**
   - Start the app and tap the phone icon
   - Grant microphone permissions when prompted
   - Start a voice conversation!

## Customization

### Chatbot Behavior

Edit the system prompt in `app/api/chat/route.ts` to change how the chatbot interacts with users.

### Styling

The app uses Tailwind CSS. Customize colors and styles in:
- `app/globals.css` for global styles
- Individual component files for component-specific styles

### OpenAI Model

You can change the model in `app/api/chat/route.ts` (currently using `gpt-4o-mini` for cost efficiency).

## Mobile Testing

To test on a real mobile device:

1. Find your computer's local IP address:
   - Mac/Linux: `ifconfig | grep inet`
   - Windows: `ipconfig`

2. Run the dev server:
   ```bash
   pnpm dev
   ```

3. On your phone, navigate to `http://YOUR_IP:3000`

## License

MIT

## Contributing

Feel free to submit issues and pull requests!
