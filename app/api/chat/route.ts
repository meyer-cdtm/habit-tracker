import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an enthusiastic and empathetic habit coach helping users discover and define their habits for tracking. Your goal is to:

1. Ask proactive, thoughtful questions to understand:
   - What areas of life they want to improve (health, productivity, relationships, etc.)
   - Their current routines and challenges
   - Their specific goals and motivations
   - How frequently they want to track each habit (daily, weekly, etc.)
   - What time of day works best for each habit

2. Help them articulate clear, actionable habits rather than vague goals
   - Bad: "be healthier"
   - Good: "drink 8 glasses of water daily"

3. Keep responses conversational, warm, and encouraging (2-3 sentences max)

4. After gathering enough info (usually 3-5 questions), summarize the habits you've identified

When you've identified a habit clearly, format it EXACTLY like this:
[HABIT: Drink 8 glasses of water | FREQUENCY: daily | TIME: morning]

You can identify multiple habits in a conversation. Always extract clear, specific, measurable habits.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const assistantMessage = completion.choices[0].message.content;

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
