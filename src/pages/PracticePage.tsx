import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen, CircleAlert } from 'lucide-react';
import { usePracticeStore } from '../stores/practiceStore';
import { useStatsStore } from '../stores/statsStore';
import { SAMPLE_EXERCISES } from '../data/sample-exercises';
import { markAllAnswers } from '../services/aiMarking';
import { AudioPlayer } from '../components/audio/AudioPlayer';
import { QuestionCard } from '../components/questions/QuestionCard';
import { Transcript } from '../components/common/Transcript';
import { ListeningNotes } from '../components/common/ListeningNotes';
import { Exercise, AudioSpeed } from '../types';

export function PracticePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showingResults, setShowingResults] = useState(false);

  const {
    currentQuestionIndex, answers, audioSpeed,
    setExercise: setStoreExercise, setCurrentQuestionIndex,
    submitAnswer, setAudioSpeed, completeSession,
    reset,
  } = usePracticeStore();

  const recordSession = useStatsStore(s => s.recordSession);

  // Load exercise
  useEffect(() => {
    const exerciseId = searchParams.get('exercise');
    let ex: Exercise | undefined;

    if (exerciseId) {
      ex = SAMPLE_EXERCISES.find(e => e.id === exerciseId);
      if (!ex) setLoadError(`Exercise "${exerciseId}" not found.`);
    }

    if (!ex) {
      ex = SAMPLE_EXERCISES[Math.floor(Math.random() * SAMPLE_EXERCISES.length)];
    }

    if (ex) {
      setExercise(ex);
      setStoreExercise(ex);
      setLoadError(null);
    }

    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const currentQuestion = exercise?.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  const totalQuestions = exercise?.questions.length ?? 0;
  const answeredCount = answers.length;
  const allAnswered = answeredCount >= totalQuestions && totalQuestions > 0;

  const handleAnswerSubmit = useCallback((questionId: string, answer: number | string) => {
    submitAnswer(questionId, answer);
  }, [submitAnswer]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Scroll the next question into view on mobile.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIndex, totalQuestions, setCurrentQuestionIndex]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  const handleFinish = useCallback(() => {
    if (!exercise) return;

    const results = markAllAnswers(exercise.questions, answers);

    for (const result of results) {
      const answer = answers.find(a => a.questionId === result.questionId);
      if (answer) {
        usePracticeStore.getState().markAnswer(
          result.questionId,
          result.isCorrect,
          result.marksAwarded,
          result.marksTotal,
          result.feedback,
        );
      }
    }

    const session = completeSession();
    if (session) {
      recordSession(
        session,
        exercise.script.topic,
        exercise.script.difficulty,
        exercise.questions.map(q => q.type),
      );
    }

    setShowingResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [exercise, answers, completeSession, recordSession]);

  const handleSpeedChange = useCallback((speed: AudioSpeed) => {
    setAudioSpeed(speed);
  }, [setAudioSpeed]);

  // Loading state
  if (loadError) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20 text-center">
        <CircleAlert size={48} className="mx-auto text-red-400 mb-3" />
        <p className="text-gray-700 font-medium mb-2">Could not load exercise</p>
        <p className="text-sm text-gray-500 mb-6">{loadError}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-3" aria-label="Loading" />
        <p className="text-gray-400">加载中 Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
        >
          <ArrowLeft size={16} />
          返回 Home
        </button>
        {!showingResults && (
          <div className="text-xs sm:text-sm text-gray-500">
            {answeredCount}/{totalQuestions} 已答
          </div>
        )}
      </div>

      {/* Exercise title */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold chinese-text leading-tight">
          {exercise.script.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          {exercise.script.topic.replace('_', ' ')} · {exercise.script.difficulty}
        </p>
      </div>

      {/* Results mode — show results + transcript */}
      {showingResults ? (
        <ResultsView
          exercise={exercise}
          answers={answers}
          onNewExercise={() => navigate('/')}
        />
      ) : (
        <>
          {/* Audio Player */}
          <div className="mb-4">
            <AudioPlayer
              exerciseId={exercise.id}
              lines={exercise.script.dialogue}
              speed={audioSpeed}
              onSpeedChange={handleSpeedChange}
              disabled={showingResults}
            />
          </div>

          {/* Listening Notes */}
          <div className="mb-4">
            <ListeningNotes
              exerciseId={exercise.id}
              visible={!showingResults}
            />
          </div>

          {/* Transcript lock reminder */}
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <BookOpen size={14} className="text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">🔒 Transcript hidden</span> until you submit all answers. 完成所有题目后才能查看原文。
            </p>
          </div>

          {/* Question dots — at-a-glance progress */}
          <QuestionDots
            total={totalQuestions}
            current={currentQuestionIndex}
            answers={answers}
            questionIds={exercise.questions.map(q => q.id)}
            onJump={(i) => {
              setCurrentQuestionIndex(i);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Current question — keyed by question.id so React fully remounts per question */}
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              index={currentQuestionIndex}
              total={totalQuestions}
              answer={currentAnswer}
              onSubmit={handleAnswerSubmit}
              onNext={handleNext}
              onFinish={handleFinish}
              isLast={currentQuestionIndex === totalQuestions - 1}
              canGoNext={true}
              showFeedback={currentAnswer?.isCorrect !== undefined}
            />
          )}

          {/* Below-card nav for jumping back / finishing directly */}
          <div className="flex items-center justify-between mt-4 gap-2">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <ArrowLeft size={16} />
              上一题 Prev
            </button>

            {allAnswered && currentQuestionIndex === totalQuestions - 1 && currentAnswer?.isCorrect !== undefined && (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <CheckCircle size={16} />
                完成练习 View Results
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function QuestionDots({
  total,
  current,
  answers,
  questionIds,
  onJump,
}: {
  total: number;
  current: number;
  answers: { questionId: string; isCorrect?: boolean }[];
  questionIds: string[];
  onJump: (index: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">Questions</span>
        <span className="text-xs text-gray-400">{current + 1} of {total}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {Array.from({ length: total }).map((_, i) => {
          const qid = questionIds[i];
          const ans = qid ? answers.find(a => a.questionId === qid) : undefined;
          const isCurrent = i === current;
          const isAnswered = ans !== undefined;
          const isCorrect = ans?.isCorrect;
          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              aria-label={`Go to question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isCurrent
                  ? 'bg-blue-600 text-white'
                  : isAnswered
                    ? isCorrect
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultsView({
  exercise,
  answers,
  onNewExercise,
}: {
  exercise: Exercise;
  answers: any[];
  onNewExercise: () => void;
}) {
  const results = markAllAnswers(exercise.questions, answers);
  const totalMarks = exercise.questions.reduce((sum, q) => sum + q.marks, 0);
  const marksAwarded = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const percentage = totalMarks > 0 ? Math.round((marksAwarded / totalMarks) * 100) : 0;

  // Per-question-type performance
  const byType = new Map<string, { awarded: number; total: number; count: number }>();
  for (let i = 0; i < exercise.questions.length; i++) {
    const q = exercise.questions[i];
    const r = results[i];
    const cur = byType.get(q.type) || { awarded: 0, total: 0, count: 0 };
    cur.awarded += r.marksAwarded;
    cur.total += q.marks;
    cur.count += 1;
    byType.set(q.type, cur);
  }

  // Identify weakest and strongest q-type for this exercise
  const sortedTypes = Array.from(byType.entries())
    .map(([type, v]) => ({ type, ...v, pct: v.total > 0 ? (v.awarded / v.total) * 100 : 0 }))
    .sort((a, b) => a.pct - b.pct);

  return (
    <div className="space-y-4 fade-in">
      {/* Score summary */}
      <div className={`text-center p-5 sm:p-6 rounded-2xl ${
        percentage >= 80 ? 'bg-green-50 border-2 border-green-200' :
        percentage >= 60 ? 'bg-blue-50 border-2 border-blue-200' :
        'bg-amber-50 border-2 border-amber-200'
      }`}>
        <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">
          Listening Complete
        </p>
        <p className="text-4xl sm:text-5xl font-bold mb-1">
          {marksAwarded}<span className="text-2xl text-gray-400">/{totalMarks}</span>
        </p>
        <p className="text-lg font-medium text-gray-600">{percentage}%</p>
        <p className="text-sm text-gray-500 mt-1">
          {percentage >= 80 ? '太棒了！Excellent work.' :
           percentage >= 60 ? '不错！Good job — review the misses below.' :
           '继续努力。Review the transcript and the missed marking points.'}
        </p>
      </div>

      {/* By-question-type breakdown */}
      {sortedTypes.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">By Question Type</h3>
          <div className="space-y-2">
            {sortedTypes.map(t => (
              <div key={t.type} className="flex items-center gap-2 text-sm">
                <span className="flex-1 text-gray-600">{t.type.replace('_', ' ')}</span>
                <span className="text-gray-500">{t.awarded}/{t.total}</span>
                <span className={`font-semibold w-12 text-right ${
                  t.pct >= 80 ? 'text-green-600' :
                  t.pct >= 60 ? 'text-blue-600' :
                  'text-amber-600'
                }`}>
                  {Math.round(t.pct)}%
                </span>
              </div>
            ))}
          </div>
          {sortedTypes[0] && sortedTypes[0].pct < 70 && (
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 p-2 rounded">
              ⚠️ Your weakest skill today: <span className="font-medium">{sortedTypes[0].type.replace('_', ' ')}</span>. Look for more exercises with this question type.
            </p>
          )}
        </div>
      )}

      {/* Per-question results */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">
          Question-by-Question
        </h3>
        <div className="space-y-3">
          {exercise.questions.map((q, i) => {
            const result = results[i];
            const userAns = answers.find(a => a.questionId === q.id);
            return (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                      result.isCorrect
                        ? 'bg-green-100 text-green-700'
                        : result.marksAwarded > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                    aria-label={result.isCorrect ? 'Correct' : 'Incorrect'}
                  >
                    {result.isCorrect ? '✓' : result.marksAwarded > 0 ? '~' : '✗'}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Q{i + 1} · {result.marksAwarded}/{result.marksTotal} pt{result.marksTotal !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {q.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="chinese-text font-medium mb-1 text-sm sm:text-base leading-relaxed">
                  {q.chineseQuestion}
                </p>
                {q.englishInstruction && (
                  <p className="text-xs text-gray-500 mb-2">{q.englishInstruction}</p>
                )}

                {userAns && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <p className="text-gray-500 font-medium mb-0.5">Your answer:</p>
                    <p className="chinese-text text-gray-700">
                      {typeof userAns.answer === 'number'
                        ? `${String.fromCharCode(65 + userAns.answer)}. ${q.options?.[userAns.answer]}`
                        : userAns.answer}
                    </p>
                  </div>
                )}

                {result.feedback && (
                  <p className="text-xs text-gray-700 mt-2 whitespace-pre-line">
                    {result.feedback}
                  </p>
                )}

                {q.markingPoints && q.markingPoints.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                      Show marking points ({q.markingPoints.length})
                    </summary>
                    <ul className="mt-2 space-y-1 text-xs">
                      {q.markingPoints.map((mp) => (
                        <li key={mp.id} className="flex items-start gap-1.5">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span className="flex-1 text-gray-700">
                            {mp.englishMeaning}
                            {mp.chineseKeywords && mp.chineseKeywords.length > 0 && (
                              <span className="text-gray-400"> ({mp.chineseKeywords.join('、')})</span>
                            )}
                          </span>
                          <span className="text-gray-500">{mp.marks}p</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                {q.modelAnswer && (
                  <details className="mt-1">
                    <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                      Show model answer
                    </summary>
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="chinese-text text-sm">{q.modelAnswer}</p>
                      {q.modelAnswerPinyin && (
                        <p className="pinyin-text mt-1">{q.modelAnswerPinyin}</p>
                      )}
                    </div>
                  </details>
                )}

                {q.sourceReference && (
                  <p className="text-xs text-gray-400 mt-2 italic">
                    📍 {q.sourceReference}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next action */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
        <button
          onClick={onNewExercise}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Another Exercise
        </button>
      </div>

      {/* Transcript */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={18} className="text-blue-600" />
          <h3 className="font-semibold text-gray-700">听力原文 Transcript</h3>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            ✓ Unlocked
          </span>
        </div>
        <Transcript script={exercise.script} />
      </div>
    </div>
  );
}