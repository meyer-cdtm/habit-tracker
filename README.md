# Habit Tracker with AI Onboarding

A mobile-first habit tracking application with an intelligent chatbot onboarding experience powered by OpenAI's ChatGPT. The chatbot asks proactive questions to understand your goals and helps you define meaningful, trackable habits.

## Features

- **AI-Powered Onboarding**: Conversational chatbot that asks thoughtful questions to understand your habits
- **Real-time Habit Visualization**: See your habits being extracted and displayed as you chat
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly UI
- **Streak Tracking**: Automatically calculates and displays your habit streaks
- **Weekly Overview**: Visual calendar showing your progress throughout the week
- **Local Storage**: Your habits and progress are saved locally in your browser
- **Beautiful Gradients**: Modern, colorful UI with smooth animations

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o-mini)
- date-fns for date manipulation
- lucide-react for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

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

4. Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-your-api-key-here
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser (or open on your phone using your local IP address for mobile testing)

## How It Works

### Onboarding Flow

1. The chatbot greets you and asks about areas of your life you want to improve
2. It asks follow-up questions to understand:
   - Your specific goals
   - How frequently you want to track each habit (daily/weekly)
   - What time of day works best (morning/afternoon/evening/anytime)
3. As the chatbot identifies habits, they appear in a preview card at the bottom
4. Once you're satisfied, click "Start Tracking These Habits" to begin

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
│   └── globals.css            # Global styles
├── components/
│   ├── Onboarding.tsx         # Chatbot onboarding UI
│   ├── HabitPreview.tsx       # Habit preview card
│   └── HabitTracker.tsx       # Main habit tracking dashboard
├── types/
│   └── habit.ts               # TypeScript types
└── utils/
    ├── habitParser.ts         # Extract habits from chat messages
    └── storage.ts             # localStorage utilities
```

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
