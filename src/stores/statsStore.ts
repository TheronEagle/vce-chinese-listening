import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserStats, PracticeSession, VCECategory, QuestionType,
  Difficulty, TopicStats, QuestionTypeStats
} from '../types';

const DEFAULT_TOPIC_STATS = (): Record<VCECategory, TopicStats> => {
  const categories: VCECategory[] = [
    'personal_life', 'family', 'school', 'festivals', 'lifestyle',
    'travel', 'food', 'leisure', 'employment', 'future_aspirations',
    'study', 'study_abroad', 'chinese_culture', 'chinese_society',
    'chinese_philosophies', 'myths_legends', 'contemporary_china', 'social_economic',
  ];
  const record = {} as Record<VCECategory, TopicStats>;
  for (const cat of categories) {
    record[cat] = {
      topic: cat,
      exercisesCompleted: 0,
      totalMarks: 0,
      marksAwarded: 0,
      accuracy: 0,
      recentAccuracy: 0,
    };
  }
  return record;
};

const DEFAULT_QTYPE_STATS = (): Record<QuestionType, QuestionTypeStats> => {
  const types: QuestionType[] = [
    'multiple_choice', 'specific_information', 'which_three', 'why_reason',
    'advantages', 'disadvantages', 'main_idea', 'supporting_details',
    'comparison', 'opinion_attitude', 'perspective', 'challenges',
    'solutions', 'cause_effect', 'complex_4mark', 'complex_5mark', 'complex_6mark',
  ];
  const record = {} as Record<QuestionType, QuestionTypeStats>;
  for (const t of types) {
    record[t] = { type: t, questionsAnswered: 0, correctCount: 0, totalMarks: 0, marksAwarded: 0, accuracy: 0 };
  }
  return record;
};

const initialStats: UserStats = {
  totalExercises: 0,
  totalQuestions: 0,
  totalMarks: 0,
  marksAwarded: 0,
  overallAccuracy: 0,
  currentStreak: 0,
  longestStreak: 0,
  topicStats: DEFAULT_TOPIC_STATS(),
  questionTypeStats: DEFAULT_QTYPE_STATS(),
  speedStats: {},
  difficultyStats: {
    beginner: { attempts: 0, accuracy: 0 },
    intermediate: { attempts: 0, accuracy: 0 },
    advanced: { attempts: 0, accuracy: 0 },
  },
  recentSessions: [],
  vocabularyWeaknesses: [],
  commonMistakes: [],
  lastUpdated: new Date().toISOString(),
};

interface StatsState {
  stats: UserStats;
  recordSession: (session: PracticeSession, topic: VCECategory, difficulty: Difficulty, questionTypes: QuestionType[]) => void;
  getWeakTopics: () => VCECategory[];
  getWeakQuestionTypes: () => QuestionType[];
  resetStats: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: initialStats,

      recordSession: (session, topic, difficulty, questionTypes) => {
        set(state => {
          const s = { ...state.stats };
          const marks = session.marksAwarded;
          const total = session.totalMarks;
          const accuracy = total > 0 ? (marks / total) * 100 : 0;

          // Overall
          s.totalExercises += 1;
          s.totalQuestions += session.answers.length;
          s.totalMarks += total;
          s.marksAwarded += marks;
          s.overallAccuracy = s.totalMarks > 0 ? (s.marksAwarded / s.totalMarks) * 100 : 0;

          // Streak
          if (accuracy >= 60) {
            s.currentStreak += 1;
            s.longestStreak = Math.max(s.longestStreak, s.currentStreak);
          } else {
            s.currentStreak = 0;
          }

          // Topic stats
          const ts = { ...s.topicStats[topic] };
          ts.exercisesCompleted += 1;
          ts.totalMarks += total;
          ts.marksAwarded += marks;
          ts.accuracy = ts.totalMarks > 0 ? (ts.marksAwarded / ts.totalMarks) * 100 : 0;
          ts.lastPracticed = new Date().toISOString();
          // Recent accuracy (last 5)
          const recentForTopic = s.recentSessions
            .filter(rs => rs.exerciseId.includes(topic))
            .slice(-4);
          const recentTotal = recentForTopic.reduce((sum, rs) => sum + rs.totalMarks, 0) + total;
          const recentAwarded = recentForTopic.reduce((sum, rs) => sum + rs.marksAwarded, 0) + marks;
          ts.recentAccuracy = recentTotal > 0 ? (recentAwarded / recentTotal) * 100 : 0;
          s.topicStats = { ...s.topicStats, [topic]: ts };

          // Question type stats
          const newQStats = { ...s.questionTypeStats };
          for (const qt of questionTypes) {
            const qs = { ...newQStats[qt] };
            qs.questionsAnswered += 1;
            qs.totalMarks += total;
            qs.marksAwarded += marks;
            qs.accuracy = qs.totalMarks > 0 ? (qs.marksAwarded / qs.totalMarks) * 100 : 0;
            newQStats[qt] = qs;
          }
          s.questionTypeStats = newQStats;

          // Speed stats
          const speedKey = String(session.audioSpeed);
          const existing = s.speedStats[speedKey] || { attempts: 0, accuracy: 0 };
          const newAttempts = existing.attempts + 1;
          const newAccuracy = ((existing.accuracy * existing.attempts) + accuracy) / newAttempts;
          s.speedStats = { ...s.speedStats, [speedKey]: { attempts: newAttempts, accuracy: newAccuracy } };

          // Difficulty stats
          const ds = s.difficultyStats[difficulty];
          const dsAttempts = ds.attempts + 1;
          const dsAccuracy = ((ds.accuracy * ds.attempts) + accuracy) / dsAttempts;
          s.difficultyStats = {
            ...s.difficultyStats,
            [difficulty]: { attempts: dsAttempts, accuracy: dsAccuracy },
          };

          // Recent sessions (keep last 20)
          s.recentSessions = [session, ...s.recentSessions].slice(0, 20);

          s.lastUpdated = new Date().toISOString();
          return { stats: s };
        });
      },

      getWeakTopics: () => {
        const { stats } = get();
        return Object.values(stats.topicStats)
          .filter(t => t.exercisesCompleted > 0 && t.accuracy < 70)
          .sort((a, b) => a.accuracy - b.accuracy)
          .map(t => t.topic);
      },

      getWeakQuestionTypes: () => {
        const { stats } = get();
        return Object.values(stats.questionTypeStats)
          .filter(q => q.questionsAnswered > 0 && q.accuracy < 70)
          .sort((a, b) => a.accuracy - b.accuracy)
          .map(q => q.type);
      },

      resetStats: () => set({ stats: initialStats }),
    }),
    { name: 'vce-chinese-stats' }
  )
);
