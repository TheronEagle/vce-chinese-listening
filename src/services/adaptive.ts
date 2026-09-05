import {
  UserStats, AdaptiveRecommendation, VCECategory,
  QuestionType, Difficulty, AudioSpeed
} from '../types';

/**
 * Adaptive engine that recommends exercises based on student performance.
 * Targets weaknesses and gradually increases difficulty.
 */

export function generateRecommendations(stats: UserStats): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];

  // Find weak topics
  const weakTopics = Object.values(stats.topicStats)
    .filter(t => t.exercisesCompleted > 0 && t.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  // Find weak question types
  const weakQTypes = Object.values(stats.questionTypeStats)
    .filter(q => q.questionsAnswered > 0 && q.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map(q => q.type);

  // Find appropriate difficulty
  const difficulty = recommendDifficulty(stats);

  // Find appropriate speed
  const speed = recommendSpeed(stats);

  // Generate topic-based recommendations
  for (const topic of weakTopics) {
    recommendations.push({
      topic: topic.topic,
      difficulty,
      questionTypes: weakQTypes.length > 0 ? weakQTypes : ['multiple_choice', 'why_reason'],
      reason: `你在${topic.topic}方面需要加强练习（正确率 ${Math.round(topic.accuracy)}%）`,
      priority: 100 - topic.accuracy,
    });
  }

  // If no weak topics, recommend by difficulty progression
  if (recommendations.length === 0) {
    const unpracticedTopics = Object.values(stats.topicStats)
      .filter(t => t.exercisesCompleted === 0)
      .map(t => t.topic)
      .slice(0, 3);

    for (const topic of unpracticedTopics) {
      recommendations.push({
        topic,
        difficulty: 'beginner',
        questionTypes: ['multiple_choice', 'specific_information', 'main_idea'],
        reason: '试试这个新主题！',
        priority: 50,
      });
    }
  }

  // Add question-type-focused recommendation if weak
  if (weakQTypes.length > 0) {
    const existingTopics = recommendations.map(r => r.topic);
    const topicForQType: VCECategory = existingTopics[0] || 'personal_life';
    if (!recommendations.find(r => r.questionTypes.some(qt => weakQTypes.includes(qt)))) {
      recommendations.push({
        topic: topicForQType,
        difficulty,
        questionTypes: weakQTypes,
        reason: `你的${weakQTypes.join('、')}题型需要更多练习`,
        priority: 80,
      });
    }
  }

  return recommendations.sort((a, b) => b.priority - a.priority);
}

function recommendDifficulty(stats: UserStats): Difficulty {
  const { beginner, intermediate, advanced } = stats.difficultyStats;

  // Start with beginner if new user
  if (stats.totalExercises < 3) return 'beginner';

  // Progress based on accuracy
  if (beginner.accuracy >= 80 && beginner.attempts >= 3) {
    if (intermediate.accuracy >= 75 && intermediate.attempts >= 3) {
      return 'advanced';
    }
    return 'intermediate';
  }
  return 'beginner';
}

function recommendSpeed(stats: UserStats): AudioSpeed {
  const speeds = Object.entries(stats.speedStats)
    .map(([speed, data]) => ({ speed: Number(speed) as AudioSpeed, ...data }))
    .sort((a, b) => a.speed - b.speed);

  if (speeds.length === 0) return 0.85;

  // Find the fastest speed where accuracy is still good
  const goodSpeeds = speeds.filter(s => s.accuracy >= 70);
  if (goodSpeeds.length === 0) return 0.75;

  const bestGoodSpeed = goodSpeeds[goodSpeeds.length - 1];
  // Try to nudge slightly faster
  const nextSpeed = getNextFasterSpeed(bestGoodSpeed.speed);
  return nextSpeed ?? bestGoodSpeed.speed;
}

function getNextFasterSpeed(current: AudioSpeed): AudioSpeed | null {
  const speeds: AudioSpeed[] = [0.75, 0.85, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];
  const idx = speeds.indexOf(current);
  if (idx < speeds.length - 1) return speeds[idx + 1];
  return null;
}

export function getRecommendedQuestionTypes(stats: UserStats): QuestionType[] {
  const weak = Object.values(stats.questionTypeStats)
    .filter(q => q.questionsAnswered > 0 && q.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map(q => q.type);

  if (weak.length === 0) {
    return ['multiple_choice', 'specific_information', 'why_reason'];
  }
  return weak;
}
