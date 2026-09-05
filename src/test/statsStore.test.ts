import { describe, it, expect, beforeEach } from 'vitest';
import { act } from 'react';
import { useStatsStore } from '../stores/statsStore';
import type { PracticeSession, VCECategory, Difficulty, QuestionType } from '../types';

/**
 * BUG-003 regression tests — recordSession must aggregate per-question
 * marks into each question-type bucket, NOT the session total.
 *
 * Before the fix: every question type in a session received the FULL
 * session marks / session total, making every type's accuracy equal
 * to the overall session accuracy (misleading).
 */

const baseStats = () => useStatsStore.getState().stats;

const makeSession = (
  answers: Array<{ questionId: string; marksAwarded: number; marksTotal: number }>,
  audioSpeed = 1.0,
): PracticeSession => ({
  id: 'sess-1',
  exerciseId: 'ex-test',
  startedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  answers: answers.map((a) => ({
    questionId: a.questionId,
    answer: 'x',
    marksAwarded: a.marksAwarded,
    marksTotal: a.marksTotal,
    isCorrect: a.marksAwarded === a.marksTotal,
  })),
  totalMarks: answers.reduce((s, a) => s + a.marksTotal, 0),
  marksAwarded: answers.reduce((s, a) => s + a.marksAwarded, 0),
  audioSpeed: audioSpeed as PracticeSession['audioSpeed'],
  totalTimeMs: 1000,
});

describe('statsStore — recordSession BUG-003 fix', () => {
  beforeEach(() => {
    // Reset store state between tests.
    useStatsStore.getState().resetStats();
  });

  it('does not bleed session totals into every question type', () => {
    // Three questions, each a DIFFERENT question type, with different scores:
    //   Q1 (multiple_choice)     — 1/1  = 100%
    //   Q2 (specific_information)— 1/2  =  50%
    //   Q3 (why_reason)          — 2/3  =  66%
    // Session total: 4/6 ≈ 67%.
    const session = makeSession([
      { questionId: 'q1', marksAwarded: 1, marksTotal: 1 },
      { questionId: 'q2', marksAwarded: 1, marksTotal: 2 },
      { questionId: 'q3', marksAwarded: 2, marksTotal: 3 },
    ]);
    const types: QuestionType[] = ['multiple_choice', 'specific_information', 'why_reason'];

    act(() => {
      useStatsStore.getState().recordSession(session, 'school' as VCECategory, 'intermediate' as Difficulty, types);
    });

    const s = useStatsStore.getState().stats;
    const mc = s.questionTypeStats.multiple_choice;
    const si = s.questionTypeStats.specific_information;
    const wr = s.questionTypeStats.why_reason;

    // Per-type should match per-question marks only.
    expect(mc.totalMarks).toBe(1);
    expect(mc.marksAwarded).toBe(1);
    expect(mc.accuracy).toBe(100);

    expect(si.totalMarks).toBe(2);
    expect(si.marksAwarded).toBe(1);
    expect(si.accuracy).toBe(50);

    expect(wr.totalMarks).toBe(3);
    expect(wr.marksAwarded).toBe(2);
    expect(Math.round(wr.accuracy)).toBe(67);

    // Overall session accuracy should reflect the actual session total.
    expect(s.totalMarks).toBe(6);
    expect(s.marksAwarded).toBe(4);
    expect(Math.round(s.overallAccuracy)).toBe(67);
  });

  it('accumulates correctly across multiple sessions', () => {
    // Session 1: q1 (mc) 1/1, q2 (why) 0/2   -> session 1/3
    // Session 2: q1 (mc) 0/1, q2 (why) 2/2   -> session 2/3
    const s1 = makeSession([
      { questionId: 'q1', marksAwarded: 1, marksTotal: 1 },
      { questionId: 'q2', marksAwarded: 0, marksTotal: 2 },
    ]);
    const s2 = makeSession([
      { questionId: 'q1', marksAwarded: 0, marksTotal: 1 },
      { questionId: 'q2', marksAwarded: 2, marksTotal: 2 },
    ]);

    act(() => {
      useStatsStore.getState().recordSession(
        s1, 'food' as VCECategory, 'beginner' as Difficulty,
        ['multiple_choice', 'why_reason'],
      );
    });
    act(() => {
      useStatsStore.getState().recordSession(
        s2, 'food' as VCECategory, 'beginner' as Difficulty,
        ['multiple_choice', 'why_reason'],
      );
    });

    const s = useStatsStore.getState().stats;
    // MC: 1/1 + 0/1 = 1/2 = 50%
    expect(s.questionTypeStats.multiple_choice.marksAwarded).toBe(1);
    expect(s.questionTypeStats.multiple_choice.totalMarks).toBe(2);
    expect(s.questionTypeStats.multiple_choice.accuracy).toBe(50);
    expect(s.questionTypeStats.multiple_choice.questionsAnswered).toBe(2);

    // Why: 0/2 + 2/2 = 2/4 = 50%
    expect(s.questionTypeStats.why_reason.marksAwarded).toBe(2);
    expect(s.questionTypeStats.why_reason.totalMarks).toBe(4);
    expect(s.questionTypeStats.why_reason.accuracy).toBe(50);
    expect(s.questionTypeStats.why_reason.questionsAnswered).toBe(2);

    // Topic accumulated correctly:
    // Session 1: awarded=1, total=3
    // Session 2: awarded=2, total=3
    // Total: awarded=3, total=6
    const topic = s.topicStats.food;
    expect(topic.marksAwarded).toBe(3);
    expect(topic.totalMarks).toBe(6);
    expect(topic.exercisesCompleted).toBe(2);
  });

  it('topic stats aggregate independently of per-type stats', () => {
    // One session, one topic, mixed types
    const session = makeSession([
      { questionId: 'q1', marksAwarded: 1, marksTotal: 2 },
      { questionId: 'q2', marksAwarded: 2, marksTotal: 3 },
    ]);
    act(() => {
      useStatsStore.getState().recordSession(
        session, 'travel' as VCECategory, 'advanced' as Difficulty,
        ['opinion_attitude', 'comparison'],
      );
    });

    const s = useStatsStore.getState().stats;
    const topic = s.topicStats.travel;
    expect(topic.totalMarks).toBe(5);  // 2 + 3
    expect(topic.marksAwarded).toBe(3); // 1 + 2
    expect(topic.accuracy).toBe(60);
    // Per-type should NOT match topic total
    expect(s.questionTypeStats.opinion_attitude.totalMarks).toBe(2);
    expect(s.questionTypeStats.comparison.totalMarks).toBe(3);
  });

  it('records a streak when session accuracy >= 60%', () => {
    const good = makeSession([{ questionId: 'q1', marksAwarded: 4, marksTotal: 5 }]);
    act(() => {
      useStatsStore.getState().recordSession(
        good, 'school' as VCECategory, 'intermediate' as Difficulty,
        ['multiple_choice'],
      );
    });
    expect(useStatsStore.getState().stats.currentStreak).toBe(1);

    const bad = makeSession([{ questionId: 'q1', marksAwarded: 0, marksTotal: 5 }]);
    act(() => {
      useStatsStore.getState().recordSession(
        bad, 'school' as VCECategory, 'intermediate' as Difficulty,
        ['multiple_choice'],
      );
    });
    expect(useStatsStore.getState().stats.currentStreak).toBe(0);
  });

  it('handles questions without marksAwarded/marksTotal gracefully', () => {
    // Realistic edge case: an answer might lack marks info (e.g. user
    // navigated away mid-question). Should not throw or NaN.
    const session: PracticeSession = {
      id: 'sess-edge',
      exerciseId: 'ex-edge',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      answers: [
        { questionId: 'q1', answer: 'x' },
        { questionId: 'q2', answer: 'y', marksAwarded: 1, marksTotal: 2 },
      ],
      totalMarks: 2,
      marksAwarded: 1,
      audioSpeed: 1.0,
      totalTimeMs: 1000,
    };

    expect(() => {
      act(() => {
        useStatsStore.getState().recordSession(
          session, 'food' as VCECategory, 'beginner' as Difficulty,
          ['multiple_choice', 'why_reason'],
        );
      });
    }).not.toThrow();

    const s = useStatsStore.getState().stats;
    expect(Number.isFinite(s.questionTypeStats.multiple_choice.accuracy)).toBe(true);
  });
});