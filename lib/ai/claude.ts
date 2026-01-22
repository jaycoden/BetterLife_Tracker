import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIInsightRequest {
  journalEntries?: string[];
  goals?: string[];
  trackerData?: Record<string, any>;
  timeframe?: string;
  specificQuestion?: string;
}

export const generateJournalInsights = async (entries: string[]): Promise<string> => {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analyze these journal entries and provide meaningful insights about patterns, themes, and growth opportunities. Keep the response concise and actionable.

Journal Entries:
${entries.join('\n\n---\n\n')}

Provide:
1. Key themes and patterns
2. Emotional trends
3. Actionable suggestions for growth`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    return textContent && textContent.type === 'text' ? textContent.text : '';
  } catch (error) {
    console.error('Error generating journal insights:', error);
    throw error;
  }
};

export const generateWeeklyReview = async (
  weekData: AIInsightRequest
): Promise<string> => {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1536,
      messages: [
        {
          role: 'user',
          content: `Generate a comprehensive weekly review based on the following data:

${weekData.journalEntries ? `Journal Entries:\n${weekData.journalEntries.join('\n\n')}\n\n` : ''}
${weekData.goals ? `Goals:\n${weekData.goals.join('\n')}\n\n` : ''}
${weekData.trackerData ? `Tracker Data:\n${JSON.stringify(weekData.trackerData, null, 2)}\n\n` : ''}

Provide:
1. Weekly highlights and accomplishments
2. Areas for improvement
3. Progress toward goals
4. Recommendations for next week`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    return textContent && textContent.type === 'text' ? textContent.text : '';
  } catch (error) {
    console.error('Error generating weekly review:', error);
    throw error;
  }
};

export const generateGoalSuggestions = async (
  currentGoals: string[],
  context?: string
): Promise<string> => {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Based on these current goals and context, suggest new goals or refinements:

Current Goals:
${currentGoals.join('\n')}

${context ? `Additional Context:\n${context}` : ''}

Provide 3-5 specific, actionable goal suggestions with rationale.`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    return textContent && textContent.type === 'text' ? textContent.text : '';
  } catch (error) {
    console.error('Error generating goal suggestions:', error);
    throw error;
  }
};

export const analyzeJournalEntry = async (entry: string): Promise<{
  themes: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  keyTopics: string[];
  summary: string;
}> => {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `Analyze this journal entry and return a JSON object with themes, sentiment, keyTopics, and summary:

${entry}

Return ONLY valid JSON in this exact format:
{
  "themes": ["theme1", "theme2"],
  "sentiment": "positive|negative|neutral|mixed",
  "keyTopics": ["topic1", "topic2"],
  "summary": "brief summary"
}`,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return JSON.parse(textContent.text);
    }
    throw new Error('No text content in response');
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    return {
      themes: [],
      sentiment: 'neutral',
      keyTopics: [],
      summary: '',
    };
  }
};
