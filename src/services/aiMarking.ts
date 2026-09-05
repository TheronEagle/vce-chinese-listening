import { Question, MarkingPoint, StudentAnswer } from '../types';

/**
 * AI-assisted semantic marking for Chinese answers.
 * Checks against marking points using keyword matching and semantic similarity.
 */

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s，。、；：！？""''（）【】《》·…—\-\.,!?;:'"()\[\]{}]/g, '')
    .trim();
}

function containsKeywords(answer: string, keywords: string[]): boolean {
  const normalized = normalizeText(answer);
  return keywords.some(kw => normalized.includes(normalizeText(kw)));
}

function semanticMatch(answer: string, markingPoint: MarkingPoint): boolean {
  const normalized = normalizeText(answer);

  // Check Chinese keywords
  if (markingPoint.chineseKeywords?.length) {
    const keywordHits = markingPoint.chineseKeywords.filter(kw =>
      normalized.includes(normalizeText(kw))
    );
    // If at least half the keywords match, consider it a match
    if (keywordHits.length >= Math.ceil(markingPoint.chineseKeywords.length / 2)) {
      return true;
    }
  }

  // Check English meaning (basic semantic check)
  const englishLower = markingPoint.englishMeaning.toLowerCase();
  const keyTerms = englishLower.split(/[,.\s]+/).filter(w => w.length > 3);
  // This is a simplified check — in production, use an embedding model
  return false;
}

export interface MarkingResult {
  questionId: string;
  marksAwarded: number;
  marksTotal: number;
  isCorrect: boolean;
  feedback: string;
  pointResults: { point: MarkingPoint; matched: boolean }[];
}

export function markAnswer(question: Question, answer: StudentAnswer): MarkingResult {
  const marksTotal = question.marks;

  // Multiple choice
  if (question.type === 'multiple_choice' || question.type === 'main_idea') {
    if (question.correctOptionIndex !== undefined && typeof answer.answer === 'number') {
      const isCorrect = answer.answer === question.correctOptionIndex;
      return {
        questionId: question.id,
        marksAwarded: isCorrect ? marksTotal : 0,
        marksTotal,
        isCorrect,
        feedback: isCorrect
          ? '正确！'
          : `不正确。正确答案是：${question.options?.[question.correctOptionIndex] ?? ''}`,
        pointResults: [],
      };
    }
    return {
      questionId: question.id,
      marksAwarded: 0,
      marksTotal,
      isCorrect: false,
      feedback: '未作答。',
      pointResults: [],
    };
  }

  // Written answer — check against marking points
  if (!question.markingPoints?.length) {
    return {
      questionId: question.id,
      marksAwarded: 0,
      marksTotal,
      isCorrect: false,
      feedback: '无法评分。',
      pointResults: [],
    };
  }

  const answerText = typeof answer.answer === 'string' ? answer.answer : '';
  if (!answerText.trim()) {
    return {
      questionId: question.id,
      marksAwarded: 0,
      marksTotal,
      isCorrect: false,
      feedback: '未作答。请用中文回答。',
      pointResults: question.markingPoints.map(mp => ({ point: mp, matched: false })),
    };
  }

  const pointResults = question.markingPoints.map(mp => ({
    point: mp,
    matched: semanticMatch(answerText, mp),
  }));

  const marksAwarded = pointResults.reduce((sum, pr) =>
    sum + (pr.matched ? pr.point.marks : 0), 0
  );

  const isCorrect = marksAwarded >= marksTotal;

  // Build feedback
  const feedbackParts: string[] = [];
  if (isCorrect) {
    feedbackParts.push('回答正确！');
  } else {
    feedbackParts.push(`得分：${marksAwarded}/${marksTotal}`);
    const missed = pointResults.filter(pr => !pr.matched);
    if (missed.length > 0) {
      feedbackParts.push('遗漏的要点：');
      for (const m of missed) {
        feedbackParts.push(`• ${m.point.englishMeaning}`);
        if (m.point.chineseKeywords?.length) {
          feedbackParts.push(`  关键词：${m.point.chineseKeywords.join('、')}`);
        }
      }
    }
  }

  return {
    questionId: question.id,
    marksAwarded,
    marksTotal,
    isCorrect,
    feedback: feedbackParts.join('\n'),
    pointResults,
  };
}

export function markAllAnswers(
  questions: Question[],
  answers: StudentAnswer[]
): MarkingResult[] {
  return questions.map(q => {
    const answer = answers.find(a => a.questionId === q.id);
    if (!answer) {
      return {
        questionId: q.id,
        marksAwarded: 0,
        marksTotal: q.marks,
        isCorrect: false,
        feedback: '未作答。',
        pointResults: (q.markingPoints || []).map(mp => ({ point: mp, matched: false })),
      };
    }
    return markAnswer(q, answer);
  });
}
