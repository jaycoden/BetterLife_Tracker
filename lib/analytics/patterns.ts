/**
 * Deterministic Pattern Analysis Utility
 * Provides free, local, offline analysis without AI
 */

import { getTodayString, getDaysAgo, getWeekStart } from '@/lib/utils/date';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type EnergyLevel = 'high' | 'medium' | 'low';
export type NervousSystemState = 'calm' | 'wired' | 'anxious' | 'numb';

export interface EnergyCheckIn {
  date: string;
  energy: EnergyLevel;
  nervousSystem: NervousSystemState;
  factors: string[];
  note?: string;
}

export interface VapeDay {
  status: 'clean' | 'cigarette' | 'vape';
}

export interface SelfExpression {
  date: string;
  expressed: boolean;
  types: string[];
  note?: string;
}

export interface PatternInsight {
  type: 'correlation' | 'streak' | 'warning' | 'celebration' | 'observation';
  title: string;
  description: string;
  data?: any;
  priority: 'high' | 'medium' | 'low';
}

// ============================================================================
// ENERGY & NERVOUS SYSTEM ANALYSIS
// ============================================================================

export function analyzeEnergyPatterns(checkins: EnergyCheckIn[]): PatternInsight[] {
  if (checkins.length < 3) {
    return [];
  }

  const insights: PatternInsight[] = [];
  const last7Days = checkins.slice(-7);
  const last30Days = checkins.slice(-30);

  // 1. Energy trend
  const energyScores = { high: 3, medium: 2, low: 1 };
  const avgEnergy = last7Days.reduce((sum, c) => sum + energyScores[c.energy], 0) / last7Days.length;

  if (avgEnergy < 1.5) {
    insights.push({
      type: 'warning',
      title: 'Low Energy Week',
      description: `Your energy has been consistently low this week (avg: ${avgEnergy.toFixed(1)}/3). Consider what might be draining you.`,
      priority: 'high',
    });
  } else if (avgEnergy > 2.5) {
    insights.push({
      type: 'celebration',
      title: 'High Energy Week',
      description: `You've had strong energy this week (avg: ${avgEnergy.toFixed(1)}/3). What's working well?`,
      priority: 'medium',
    });
  }

  // 2. Nervous system state patterns
  const nsStates = last7Days.map(c => c.nervousSystem);
  const anxiousCount = nsStates.filter(s => s === 'anxious').length;
  const calmCount = nsStates.filter(s => s === 'calm').length;

  if (anxiousCount >= 4) {
    insights.push({
      type: 'warning',
      title: 'Anxious Pattern Detected',
      description: `You've felt anxious ${anxiousCount} out of ${last7Days.length} days this week. What's contributing to this?`,
      priority: 'high',
    });
  }

  if (calmCount >= 5) {
    insights.push({
      type: 'celebration',
      title: 'Regulated Nervous System',
      description: `You've been feeling calm ${calmCount} out of ${last7Days.length} days this week. Your nervous system is well-regulated.`,
      priority: 'low',
    });
  }

  // 3. Factor analysis
  const factorCounts: Record<string, number> = {};
  last7Days.forEach(c => {
    c.factors.forEach(f => {
      factorCounts[f] = (factorCounts[f] || 0) + 1;
    });
  });

  const topFactors = Object.entries(factorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (topFactors.length > 0) {
    const [topFactor, count] = topFactors[0];
    if (count >= 4) {
      insights.push({
        type: 'observation',
        title: `${topFactor} is a Major Factor`,
        description: `${topFactor} has affected your state ${count} out of ${last7Days.length} days this week.`,
        data: { factor: topFactor, frequency: count },
        priority: 'medium',
      });
    }
  }

  // 4. Energy/NS correlation
  const anxiousLowEnergyCount = last7Days.filter(
    c => c.nervousSystem === 'anxious' && c.energy === 'low'
  ).length;

  if (anxiousLowEnergyCount >= 3) {
    insights.push({
      type: 'correlation',
      title: 'Anxiety + Low Energy Pattern',
      description: `Anxiety and low energy occurred together ${anxiousLowEnergyCount} times this week. This combination deserves attention.`,
      priority: 'high',
    });
  }

  // 5. Low-capacity day detection
  const lowCapacityDays = last7Days.filter(
    c => (c.energy === 'low' && (c.nervousSystem === 'anxious' || c.nervousSystem === 'numb'))
  ).length;

  if (lowCapacityDays >= 3) {
    insights.push({
      type: 'warning',
      title: 'Multiple Low-Capacity Days',
      description: `You've had ${lowCapacityDays} days this week with low energy and a dysregulated nervous system. Consider activating Low-Capacity Mode.`,
      priority: 'high',
    });
  }

  return insights;
}

// ============================================================================
// VAPING/SMOKING PATTERN ANALYSIS
// ============================================================================

export function analyzeVapingPatterns(
  dayStatuses: Record<string, 'clean' | 'cigarette' | 'vape'>,
  quitDate: string
): PatternInsight[] {
  const insights: PatternInsight[] = [];

  // Get last 30 days
  const today = new Date();
  const last30Days: Array<{ date: string; status: 'clean' | 'cigarette' | 'vape' }> = [];

  for (let i = 29; i >= 0; i--) {
    const date = getDaysAgo(i);
    const status = dayStatuses[date] || 'clean';
    last30Days.push({ date, status });
  }

  // Count statuses
  const cleanDays = last30Days.filter(d => d.status === 'clean').length;
  const cigDays = last30Days.filter(d => d.status === 'cigarette').length;
  const vapeDays = last30Days.filter(d => d.status === 'vape').length;

  // 1. Overall progress
  if (cleanDays >= 25) {
    insights.push({
      type: 'celebration',
      title: 'Excellent Smoke-Free Month',
      description: `You've been fully clean ${cleanDays} out of 30 days this month. You're crushing it.`,
      priority: 'high',
    });
  } else if (cleanDays >= 20) {
    insights.push({
      type: 'celebration',
      title: 'Strong Progress',
      description: `${cleanDays}/30 clean days this month. Keep building on this momentum.`,
      priority: 'medium',
    });
  }

  // 2. Vaping pattern warning
  if (vapeDays >= 5) {
    insights.push({
      type: 'warning',
      title: 'Vaping Frequency Increasing',
      description: `You've vaped ${vapeDays} days this month. This pattern is worth examining - what's triggering it?`,
      priority: 'high',
    });
  }

  // 3. Cigarette reduction
  if (cigDays > 0 && cigDays <= 3) {
    insights.push({
      type: 'observation',
      title: 'Minimal Cigarette Use',
      description: `Only ${cigDays} cigarette days this month. You're managing to avoid the worst harm even on tough days.`,
      priority: 'low',
    });
  }

  // 4. Weekly pattern detection
  const last7Days = last30Days.slice(-7);
  const recentVapeDays = last7Days.filter(d => d.status === 'vape').length;

  if (recentVapeDays >= 4) {
    insights.push({
      type: 'warning',
      title: 'Recent Vaping Spike',
      description: `You've vaped ${recentVapeDays} out of the last 7 days. Something's going on - check your energy and nervous system data.`,
      priority: 'high',
    });
  }

  // 5. Streak milestones
  const currentStreak = calculateCurrentStreak(dayStatuses);
  if (currentStreak >= 7 && currentStreak < 30) {
    insights.push({
      type: 'celebration',
      title: `${currentStreak}-Day Vape-Free Streak`,
      description: `You've gone ${currentStreak} days without vaping. Keep going - 30 days is within reach.`,
      priority: 'medium',
    });
  }

  return insights;
}

function calculateCurrentStreak(dayStatuses: Record<string, 'clean' | 'cigarette' | 'vape'>): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = getDaysAgo(i);
    const status = dayStatuses[date] || 'clean';

    if (status === 'vape') {
      break;
    }
    streak++;
  }

  return streak;
}

// ============================================================================
// SELF-EXPRESSION ANALYSIS
// ============================================================================

export function analyzeSelfExpressionPatterns(
  expressions: SelfExpression[],
  checkins: EnergyCheckIn[]
): PatternInsight[] {
  const insights: PatternInsight[] = [];

  if (expressions.length < 3) {
    return insights;
  }

  const last7Days = expressions.slice(-7);
  const expressedDays = last7Days.filter(e => e.expressed).length;

  // 1. Expression frequency
  if (expressedDays >= 5) {
    insights.push({
      type: 'celebration',
      title: 'Consistent Self-Expression',
      description: `You've expressed yourself ${expressedDays} out of 7 days this week. You're honoring your authentic self.`,
      priority: 'low',
    });
  } else if (expressedDays <= 2) {
    insights.push({
      type: 'observation',
      title: 'Limited Self-Expression',
      description: `Only ${expressedDays} days of self-expression this week. Are you giving yourself permission to be authentic?`,
      priority: 'medium',
    });
  }

  // 2. Correlation with energy/mood
  if (checkins.length >= 3) {
    const matches = expressions.map(e => {
      const checkin = checkins.find(c => c.date === e.date);
      return checkin ? { ...e, energy: checkin.energy, nervousSystem: checkin.nervousSystem } : null;
    }).filter(Boolean);

    if (matches.length >= 5) {
      const expressedMatches = matches.filter((m: any) => m.expressed);
      const highEnergyExpressed = expressedMatches.filter((m: any) => m.energy === 'high').length;
      const calmExpressed = expressedMatches.filter((m: any) => m.nervousSystem === 'calm').length;

      if (expressedMatches.length >= 3 && (highEnergyExpressed / expressedMatches.length >= 0.6 || calmExpressed / expressedMatches.length >= 0.6)) {
        insights.push({
          type: 'correlation',
          title: 'Expression Boosts Wellbeing',
          description: 'You tend to feel better (higher energy or calmer) on days when you express yourself. Self-expression might be key for you.',
          priority: 'high',
        });
      }
    }
  }

  // 3. Favorite expression types
  const typeCounts: Record<string, number> = {};
  last7Days.filter(e => e.expressed).forEach(e => {
    e.types.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
  });

  const topTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  if (topTypes.length > 0 && topTypes[0][1] >= 3) {
    const [type, count] = topTypes[0];
    insights.push({
      type: 'observation',
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Expression`,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} expression has been your primary outlet (${count} times this week).`,
      data: { type, frequency: count },
      priority: 'low',
    });
  }

  return insights;
}

// ============================================================================
// CROSS-DOMAIN CORRELATIONS
// ============================================================================

export function analyzeEnergyVapeCorrelation(
  checkins: EnergyCheckIn[],
  dayStatuses: Record<string, 'clean' | 'cigarette' | 'vape'>
): PatternInsight[] {
  const insights: PatternInsight[] = [];

  // Match checkins with vape status
  const matches = checkins.map(c => ({
    date: c.date,
    energy: c.energy,
    nervousSystem: c.nervousSystem,
    vapeStatus: dayStatuses[c.date] || 'clean',
  }));

  if (matches.length < 7) {
    return insights;
  }

  // Check if vaping correlates with low energy
  const lowEnergyDays = matches.filter(m => m.energy === 'low');
  const lowEnergyVapeDays = lowEnergyDays.filter(m => m.vapeStatus === 'vape').length;

  if (lowEnergyDays.length >= 3 && lowEnergyVapeDays / lowEnergyDays.length >= 0.6) {
    insights.push({
      type: 'correlation',
      title: 'Low Energy → Vaping Pattern',
      description: `You're more likely to vape on low-energy days (${lowEnergyVapeDays}/${lowEnergyDays.length} times). Low energy might be a trigger.`,
      priority: 'high',
    });
  }

  // Check if vaping correlates with anxiety
  const anxiousDays = matches.filter(m => m.nervousSystem === 'anxious');
  const anxiousVapeDays = anxiousDays.filter(m => m.vapeStatus === 'vape').length;

  if (anxiousDays.length >= 3 && anxiousVapeDays / anxiousDays.length >= 0.6) {
    insights.push({
      type: 'correlation',
      title: 'Anxiety → Vaping Pattern',
      description: `You're more likely to vape when anxious (${anxiousVapeDays}/${anxiousDays.length} times). Anxiety regulation might help reduce vaping.`,
      priority: 'high',
    });
  }

  // Check if clean days correlate with high energy
  const highEnergyDays = matches.filter(m => m.energy === 'high');
  const highEnergyCleanDays = highEnergyDays.filter(m => m.vapeStatus === 'clean').length;

  if (highEnergyDays.length >= 3 && highEnergyCleanDays / highEnergyDays.length >= 0.8) {
    insights.push({
      type: 'celebration',
      title: 'High Energy = Clean Days',
      description: `You stay clean when your energy is high (${highEnergyCleanDays}/${highEnergyDays.length} times). Energy management is key.`,
      priority: 'medium',
    });
  }

  return insights;
}

// ============================================================================
// WEEKLY SUMMARY GENERATOR
// ============================================================================

export function generateWeeklySummary(data: {
  checkins: EnergyCheckIn[];
  dayStatuses: Record<string, 'clean' | 'cigarette' | 'vape'>;
  quitDate: string;
  expressions?: SelfExpression[];
}): {
  insights: PatternInsight[];
  stats: {
    avgEnergy: number;
    dominantNSState: string;
    cleanDays: number;
    vapeDays: number;
    cigDays: number;
    topFactors: Array<[string, number]>;
    expressionDays?: number;
  };
} {
  const { checkins, dayStatuses, quitDate, expressions = [] } = data;

  // Combine all insights
  const insights: PatternInsight[] = [
    ...analyzeEnergyPatterns(checkins),
    ...analyzeVapingPatterns(dayStatuses, quitDate),
    ...analyzeEnergyVapeCorrelation(checkins, dayStatuses),
    ...analyzeSelfExpressionPatterns(expressions, checkins),
  ];

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Calculate stats
  const last7Days = checkins.slice(-7);
  const energyScores = { high: 3, medium: 2, low: 1 };
  const avgEnergy = last7Days.length > 0
    ? last7Days.reduce((sum, c) => sum + energyScores[c.energy], 0) / last7Days.length
    : 0;

  const nsStates = last7Days.map(c => c.nervousSystem);
  const nsCounts: Record<string, number> = {};
  nsStates.forEach(s => {
    nsCounts[s] = (nsCounts[s] || 0) + 1;
  });
  const dominantNSState = Object.entries(nsCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown';

  // Count vape statuses for last 7 days
  const vapeStats = { clean: 0, cigarette: 0, vape: 0 };
  for (let i = 0; i < 7; i++) {
    const date = getDaysAgo(i);
    const status = dayStatuses[date] || 'clean';
    vapeStats[status]++;
  }

  // Factor analysis
  const factorCounts: Record<string, number> = {};
  last7Days.forEach(c => {
    c.factors.forEach(f => {
      factorCounts[f] = (factorCounts[f] || 0) + 1;
    });
  });
  const topFactors = Object.entries(factorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Count expression days for last 7 days
  let expressionDays = 0;
  if (expressions.length > 0) {
    const last7Expressions = expressions.slice(-7);
    expressionDays = last7Expressions.filter(e => e.expressed).length;
  }

  return {
    insights,
    stats: {
      avgEnergy,
      dominantNSState,
      cleanDays: vapeStats.clean,
      vapeDays: vapeStats.vape,
      cigDays: vapeStats.cigarette,
      topFactors,
      expressionDays,
    },
  };
}

// ============================================================================
// DASHBOARD INSIGHTS (TOP 3 FOR HOMEPAGE)
// ============================================================================

export function getDashboardInsights(data: {
  checkins: EnergyCheckIn[];
  dayStatuses: Record<string, 'clean' | 'cigarette' | 'vape'>;
  quitDate: string;
  expressions?: SelfExpression[];
}): PatternInsight[] {
  const summary = generateWeeklySummary(data);

  // Return top 3 high-priority insights, or top 3 overall
  const highPriority = summary.insights.filter(i => i.priority === 'high');

  if (highPriority.length >= 3) {
    return highPriority.slice(0, 3);
  }

  return summary.insights.slice(0, 3);
}
