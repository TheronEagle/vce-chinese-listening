import { create } from 'zustand';
import { Exercise, StudentAnswer, PracticeSession, AudioSpeed } from '../types';

interface PracticeState {
  // Current session
  currentExercise: Exercise | null;
  currentQuestionIndex: number;
  answers: StudentAnswer[];
  sessionStartTime: number | null;
  audioSpeed: AudioSpeed;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackCount: number;

  // UI state
  showTranscript: boolean;
  showResults: boolean;
  selectedSection: 'listening' | 'questions' | 'results';

  // Actions
  setExercise: (exercise: Exercise) => void;
  setAudioSpeed: (speed: AudioSpeed) => void;
  setCurrentQuestionIndex: (index: number) => void;
  submitAnswer: (questionId: string, answer: number | string, timeSpentMs?: number) => void;
  markAnswer: (questionId: string, isCorrect: boolean, marksAwarded: number, marksTotal: number, feedback: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  incrementPlaybackCount: () => void;
  showTranscriptPanel: () => void;
  showResultsPanel: () => void;
  setSection: (section: 'listening' | 'questions' | 'results') => void;
  completeSession: () => PracticeSession | null;
  reset: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  currentExercise: null,
  currentQuestionIndex: 0,
  answers: [],
  sessionStartTime: null,
  audioSpeed: 1.0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackCount: 0,
  showTranscript: false,
  showResults: false,
  selectedSection: 'listening',

  setExercise: (exercise) => set({
    currentExercise: exercise,
    currentQuestionIndex: 0,
    answers: [],
    sessionStartTime: Date.now(),
    showTranscript: false,
    showResults: false,
    selectedSection: 'listening',
    playbackCount: 0,
  }),

  setAudioSpeed: (speed) => set({ audioSpeed: speed }),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  submitAnswer: (questionId, answer, timeSpentMs) => {
    const { answers } = get();
    const existing = answers.findIndex(a => a.questionId === questionId);
    const newAnswer: StudentAnswer = { questionId, answer, timeSpentMs };
    if (existing >= 0) {
      const updated = [...answers];
      updated[existing] = newAnswer;
      set({ answers: updated });
    } else {
      set({ answers: [...answers, newAnswer] });
    }
  },

  markAnswer: (questionId, isCorrect, marksAwarded, marksTotal, feedback) => {
    const { answers } = get();
    const updated = answers.map(a =>
      a.questionId === questionId
        ? { ...a, isCorrect, marksAwarded, marksTotal, feedback }
        : a
    );
    set({ answers: updated });
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  incrementPlaybackCount: () => set(s => ({ playbackCount: s.playbackCount + 1 })),

  showTranscriptPanel: () => set({ showTranscript: true, selectedSection: 'questions' }),
  showResultsPanel: () => set({ showResults: true, selectedSection: 'results' }),
  setSection: (section) => set({ selectedSection: section }),

  completeSession: () => {
    const { currentExercise, answers, sessionStartTime, audioSpeed } = get();
    if (!currentExercise || !sessionStartTime) return null;

    const totalMarks = currentExercise.questions.reduce((sum, q) => sum + q.marks, 0);
    const marksAwarded = answers.reduce((sum, a) => sum + (a.marksAwarded ?? 0), 0);

    const session: PracticeSession = {
      id: `session-${Date.now()}`,
      exerciseId: currentExercise.id,
      startedAt: new Date(sessionStartTime).toISOString(),
      completedAt: new Date().toISOString(),
      answers,
      totalMarks,
      marksAwarded,
      audioSpeed,
      totalTimeMs: Date.now() - sessionStartTime,
    };

    return session;
  },

  reset: () => set({
    currentExercise: null,
    currentQuestionIndex: 0,
    answers: [],
    sessionStartTime: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackCount: 0,
    showTranscript: false,
    showResults: false,
    selectedSection: 'listening',
  }),
}));
