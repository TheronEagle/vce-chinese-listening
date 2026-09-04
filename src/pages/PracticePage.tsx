import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { usePracticeStore } from '../stores/practiceStore';
import { useStatsStore } from '../stores/statsStore';
import { SAMPLE_EXERCISES } from '../data/sample-exercises';
import { markAllAnswers } from '../services/aiMarking';
import { AudioPlayer } from '../components/audio/AudioPlayer';
import { QuestionCard } from '../components/questions/QuestionCard';
import { Transcript } from '../components/common/Transcript';
import { Exercise, AudioSpeed } from '../types';

export function PracticePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [showingTranscript, setShowingTranscript] = useState(false);
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
    }

    // Default to first exercise or random
    if (!ex) {
      ex = SAMPLE_EXERCISES[Math.floor(Math.random() * SAMPLE_EXERCISES.length)];
    }

    if (ex) {
      setExercise(ex);
      setStoreExercise(ex);
    }

    return () => reset();
  }, [searchParams]);

  const currentQuestion = exercise?.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  const totalQuestions = exercise?.questions.length ?? 0;
  const answeredCount = answers.length;

  const handleAnswerSubmit = useCallback((questionId: string, answer: number | string) => {
    submitAnswer(questionId, answer);
  }, [submitAnswer]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleFinish = useCallback(() => {
    if (!exercise) return;

    // Mark all answers
    const results = markAllAnswers(exercise.questions, answers);

    // Apply marks back to store
    for (const result of results) {
      const answer = answers.find(a => a.questionId === result.questionId);
      if (answer) {
        usePracticeStore.getState().markAnswer(
          result.questionId,
          result.isCorrect,
          result.marksAwarded,
          result.feedback
        );
      }
    }

    // Complete session and record stats
    const session = completeSession();
    if (session) {
      recordSession(session, exercise.script.topic, exercise.script.difficulty,
        exercise.questions.map(q => q.type));
    }

    setShowingResults(true);
    setShowingTranscript(true);
  }, [exercise, answers, completeSession, recordSession]);

  const handleSpeedChange = useCallback((speed: AudioSpeed) => {
    setAudioSpeed(speed);
  }, [setAudioSpeed]);

  if (!exercise) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20 text-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          返回 Back
        </button>
        <div className="text-sm text-gray-400">
          {answeredCount}/{totalQuestions} 已答
        </div>
      </div>

      {/* Exercise title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold chinese-text">{exercise.script.title}</h2>
        <p className="text-sm text-gray-400">
          {exercise.script.topic} · {exercise.script.difficulty}
        </p>
      </div>

      {/* Audio Player */}
      <div className="mb-4">
        <AudioPlayer
          lines={exercise.script.dialogue}
          speed={audioSpeed}
          onSpeedChange={handleSpeedChange}
          disabled={showingResults}
        />
      </div>

      {/* Section toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setShowingTranscript(false); setShowingResults(false); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            !showingTranscript && !showingResults
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          做题 Questions
        </button>
        <button
          onClick={() => setShowingTranscript(true)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            showingTranscript && !showingResults
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          原文 Transcript
        </button>
        {showingResults && (
          <button
            className="flex-1 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-700"
          >
            结果 Results
          </button>
        )}
      </div>

      {/* Content */}
      {showingTranscript && !showingResults ? (
        <Transcript script={exercise.script} />
      ) : showingResults ? (
        <ResultsView exercise={exercise} answers={answers} />
      ) : currentQuestion ? (
        <div>
          {/* Question navigation dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {exercise.questions.map((q, i) => {
              const ans = answers.find(a => a.questionId === q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    i === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : ans
                        ? ans.isCorrect !== undefined
                          ? ans.isCorrect
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <QuestionCard
            question={currentQuestion}
            index={currentQuestionIndex}
            total={totalQuestions}
            answer={currentAnswer}
            onSubmit={handleAnswerSubmit}
            showFeedback={false}
          />

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              上一题
            </button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={handleFinish}
                disabled={answeredCount < totalQuestions}
                className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={16} />
                完成 Finish ({answeredCount}/{totalQuestions})
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                下一题
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Show transcript at bottom after results */}
      {showingResults && (
        <div className="mt-6">
          <Transcript script={exercise.script} />
        </div>
      )}
    </div>
  );
}

function ResultsView({ exercise, answers }: { exercise: Exercise; answers: any[] }) {
  const results = markAllAnswers(exercise.questions, answers);
  const totalMarks = exercise.questions.reduce((sum, q) => sum + q.marks, 0);
  const marksAwarded = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const percentage = totalMarks > 0 ? Math.round((marksAwarded / totalMarks) * 100) : 0;

  return (
    <div className="space-y-4 fade-in">
      {/* Score summary */}
      <div className={`text-center p-6 rounded-2xl ${
        percentage >= 80 ? 'bg-green-50 border-2 border-green-200' :
        percentage >= 60 ? 'bg-blue-50 border-2 border-blue-200' :
        'bg-amber-50 border-2 border-amber-200'
      }`}>
        <p className="text-5xl font-bold mb-1">
          {marksAwarded}<span className="text-2xl text-gray-400">/{totalMarks}</span>
        </p>
        <p className="text-lg font-medium text-gray-600">{percentage}%</p>
        <p className="text-sm text-gray-400 mt-1">
          {percentage >= 80 ? '太棒了！Excellent!' :
           percentage >= 60 ? '不错！Good job!' :
           '继续努力！Keep practicing!'}
        </p>
      </div>

      {/* Per-question results */}
      {exercise.questions.map((q, i) => {
        const result = results[i];
        return (
          <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                result.isCorrect
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {result.isCorrect ? '✓' : '✗'}
              </span>
              <span className="text-sm font-medium text-gray-500">
                第{i + 1}题 · {result.marksAwarded}/{result.marksTotal} 分
              </span>
            </div>
            <p className="chinese-text font-medium mb-1">{q.chineseQuestion}</p>
            <p className="text-sm text-gray-500 mb-2">{q.englishInstruction}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">{result.feedback}</p>
            {q.modelAnswer && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-400">参考答案：</p>
                <p className="chinese-text text-sm">{q.modelAnswer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
