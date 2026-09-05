// ============================================================
// VCE Chinese Listening Practice — Type Definitions
// ============================================================

/** VCE topic categories aligned with study design */
export type VCECategory =
  | 'personal_life'
  | 'family'
  | 'school'
  | 'festivals'
  | 'lifestyle'
  | 'travel'
  | 'food'
  | 'leisure'
  | 'employment'
  | 'future_aspirations'
  | 'study'
  | 'study_abroad'
  | 'chinese_culture'
  | 'chinese_society'
  | 'chinese_philosophies'
  | 'myths_legends'
  | 'contemporary_china'
  | 'social_economic';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type AudioSpeed = 0.75 | 0.85 | 1.0 | 1.1 | 1.25 | 1.5 | 1.75 | 2.0;

export type QuestionType =
  | 'multiple_choice'
  | 'specific_information'
  | 'which_three'
  | 'why_reason'
  | 'advantages'
  | 'disadvantages'
  | 'main_idea'
  | 'supporting_details'
  | 'comparison'
  | 'opinion_attitude'
  | 'perspective'
  | 'challenges'
  | 'solutions'
  | 'cause_effect'
  | 'complex_4mark'
  | 'complex_5mark'
  | 'complex_6mark';

/** Dialogue line with speaker */
export interface DialogueLine {
  speaker: 'A' | 'B' | 'narrator';
  speakerName?: string;
  chinese: string;
  pinyin: string;
  english: string;
}

/** A listening script / dialogue */
export interface ListeningScript {
  id: string;
  title: string;
  topic: VCECategory;
  difficulty: Difficulty;
  dialogue: DialogueLine[];
  vocabulary: VocabularyItem[];
  /** Full English translation of the entire script */
  fullEnglish: string;
}

/** Vocabulary item */
export interface VocabularyItem {
  chinese: string;
  pinyin: string;
  english: string;
  partOfSpeech?: string;
}

/** Marking point for AI grading */
export interface MarkingPoint {
  id: string;
  /** Key idea / expected content */
  keyIdea: string;
  /** Acceptable variations / paraphrases */
  acceptableVariations?: string[];
  /** Chinese keywords that should appear */
  chineseKeywords?: string[];
  /** English meaning for semantic matching */
  englishMeaning: string;
  marks: number;
}

/** A single question */
export interface Question {
  id: string;
  type: QuestionType;
  /** Question text in Chinese */
  chineseQuestion: string;
  /** Question text in English (instruction) */
  englishInstruction: string;
  /** Total marks for this question */
  marks: number;
  /** For multiple choice */
  options?: string[];
  /** Correct answer index for MC */
  correctOptionIndex?: number;
  /** Structured marking points for written answers */
  markingPoints?: MarkingPoint[];
  /** Model answer (shown after completion) */
  modelAnswer?: string;
  /** Model answer pinyin */
  modelAnswerPinyin?: string;
  /** Which part of the script this question relates to */
  sourceReference?: string;
  /** Hints for adaptive system */
  tags?: string[];
}

/** A complete listening exercise */
export interface Exercise {
  id: string;
  script: ListeningScript;
  questions: Question[];
  createdAt: string;
}

/** Student answer for a question */
export interface StudentAnswer {
  questionId: string;
  /** For MC: selected index. For written: text answer */
  answer: number | string;
  isCorrect?: boolean;
  marksAwarded?: number;
  marksTotal?: number;
  feedback?: string;
  timeSpentMs?: number;
}

/** A completed practice session */
export interface PracticeSession {
  id: string;
  exerciseId: string;
  startedAt: string;
  completedAt?: string;
  answers: StudentAnswer[];
  totalMarks: number;
  marksAwarded: number;
  audioSpeed: AudioSpeed;
  /** Time spent on entire session */
  totalTimeMs: number;
}

/** Topic performance stats */
export interface TopicStats {
  topic: VCECategory;
  exercisesCompleted: number;
  totalMarks: number;
  marksAwarded: number;
  accuracy: number;
  recentAccuracy: number;
  lastPracticed?: string;
}

/** Question type performance stats */
export interface QuestionTypeStats {
  type: QuestionType;
  questionsAnswered: number;
  correctCount: number;
  totalMarks: number;
  marksAwarded: number;
  accuracy: number;
}

/** Overall user statistics */
export interface UserStats {
  totalExercises: number;
  totalQuestions: number;
  totalMarks: number;
  marksAwarded: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  topicStats: Record<VCECategory, TopicStats>;
  questionTypeStats: Record<QuestionType, QuestionTypeStats>;
  speedStats: Record<string, { attempts: number; accuracy: number }>;
  difficultyStats: Record<Difficulty, { attempts: number; accuracy: number }>;
  recentSessions: PracticeSession[];
  vocabularyWeaknesses: string[];
  commonMistakes: string[];
  lastUpdated: string;
}

/** Adaptive recommendation */
export interface AdaptiveRecommendation {
  topic: VCECategory;
  difficulty: Difficulty;
  questionTypes: QuestionType[];
  reason: string;
  priority: number;
}
