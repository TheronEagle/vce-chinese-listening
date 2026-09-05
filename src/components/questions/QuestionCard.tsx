import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Send } from 'lucide-react';
import { Question, StudentAnswer, QuestionType } from '../../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  answer?: StudentAnswer;
  onSubmit: (questionId: string, answer: number | string) => void;
  onNext?: () => void;
  isLast?: boolean;
  onFinish?: () => void;
  canGoNext?: boolean;
  showFeedback?: boolean;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: '选择题',
  specific_information: '具体信息',
  which_three: '哪三个',
  why_reason: '原因',
  advantages: '优点',
  disadvantages: '缺点',
  main_idea: '主旨大意',
  supporting_details: '支持细节',
  comparison: '比较',
  opinion_attitude: '观点态度',
  perspective: '观点',
  challenges: '挑战',
  solutions: '解决方案',
  cause_effect: '因果关系',
  complex_4mark: '综合题4分',
  complex_5mark: '综合题5分',
  complex_6mark: '综合题6分',
};

/**
 * QuestionCard — one card per question.
 *
 * IMPORTANT: the parent MUST pass `key={question.id}` when rendering this
 * component, otherwise React reuses the same instance across questions
 * and local state (selectedOption, textAnswer, submitted) leaks between
 * questions. The parent (PracticePage) does this.
 *
 * Local state contract:
 * - selectedOption: index of MC option (number) or undefined
 * - textAnswer: text for written questions
 * - submitted: whether the question has been submitted (locally)
 *   This stays local until the parent persists it via onSubmit.
 *
 * Submitted feedback shown only when `showFeedback` is true.
 */
export function QuestionCard({
  question,
  index,
  total,
  answer,
  onSubmit,
  onNext,
  isLast = false,
  onFinish,
  canGoNext = true,
  showFeedback = false,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(
    typeof answer?.answer === 'number' ? answer.answer : undefined,
  );
  const [textAnswer, setTextAnswer] = useState(
    typeof answer?.answer === 'string' ? answer.answer : '',
  );
  const [submitted, setSubmitted] = useState(!!answer);

  // Keep local state in sync with persisted store answer.
  // - When the parent provides an answer (e.g. user navigated back to a
  //   previously-answered question), reflect it.
  // - When answer goes away (e.g. user clicked Try Again), reset cleanly.
  useEffect(() => {
    if (answer) {
      setSubmitted(true);
      if (typeof answer.answer === 'number') setSelectedOption(answer.answer);
      if (typeof answer.answer === 'string') setTextAnswer(answer.answer);
    } else {
      // No persisted answer — ensure a clean input for this question.
      setSubmitted(false);
      setSelectedOption(undefined);
      setTextAnswer('');
    }
  }, [answer, question.id]);

  const handleSubmit = () => {
    if (question.type === 'multiple_choice' || question.type === 'main_idea') {
      if (selectedOption === undefined) return;
      onSubmit(question.id, selectedOption);
    } else {
      if (!textAnswer.trim()) return;
      onSubmit(question.id, textAnswer.trim());
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedOption(undefined);
    setTextAnswer('');
  };

  const handleNextClick = () => {
    if (isLast) {
      onFinish?.();
    } else {
      onNext?.();
    }
  };

  const isMC = question.type === 'multiple_choice' || question.type === 'main_idea';
  const hasInput = isMC ? selectedOption !== undefined : textAnswer.trim().length > 0;

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 fade-in"
      role="group"
      aria-label={`Question ${index + 1} of ${total}`}
    >
      {/* Header — progress + type + marks */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            第 {index + 1} 题 / {total}
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs font-medium text-gray-500">
            {QUESTION_TYPE_LABELS[question.type]}
          </span>
        </div>
        <span
          className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded"
          aria-label={`Worth ${question.marks} marks`}
        >
          {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
        </span>
      </div>

      {/* Progress bar — overall exercise progress */}
      <div className="mb-4">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((index + (submitted ? 1 : 0)) / total) * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-base sm:text-lg font-medium chinese-text mb-1.5 leading-relaxed">
          {question.chineseQuestion}
        </p>
        {question.englishInstruction && (
          <p className="text-sm text-gray-500">{question.englishInstruction}</p>
        )}
      </div>

      {/* Answer area */}
      {!submitted ? (
        <div>
          {isMC && question.options ? (
            <div className="space-y-2" role="radiogroup" aria-label={question.englishInstruction}>
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={selectedOption === i}
                  onClick={() => setSelectedOption(i)}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all chinese-text focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedOption === i
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <span className="font-medium mr-2 text-gray-400">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <label htmlFor={`answer-${question.id}`} className="sr-only">
                Your answer in Chinese
              </label>
              <textarea
                id={`answer-${question.id}`}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => {
                  // Cmd/Ctrl+Enter submits
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (hasInput) handleSubmit();
                  }
                }}
                placeholder="请用中文回答 / Answer in Chinese... (⌘/Ctrl+Enter to submit)"
                className="w-full h-28 sm:h-32 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 chinese-text text-base transition-colors"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasInput}
            className="mt-3 w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send size={16} />
            提交答案 Submit Answer
          </button>
        </div>
      ) : (
        <div>
          {/* Confirmation banner */}
          <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium text-green-700">
              ✓ Answer submitted
            </span>
          </div>

          {/* Show submitted answer */}
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 font-medium">你的答案 Your Answer:</p>
            {isMC ? (
              <p className="chinese-text font-medium">
                {String.fromCharCode(65 + (selectedOption ?? 0))}. {question.options?.[selectedOption ?? 0]}
              </p>
            ) : (
              <p className="chinese-text whitespace-pre-wrap break-words">{textAnswer}</p>
            )}
          </div>

          {/* Feedback — shown only when results are in (after submission) */}
          {showFeedback && answer && (
            <FeedbackPanel question={question} answer={answer} />
          )}

          {/* Action row — Try Again (secondary) + Next Question (primary) */}
          <div className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-blue-600 font-medium focus:outline-none focus:underline self-start sm:self-auto"
            >
              重新作答 Try Again
            </button>

            {canGoNext && (
              <button
                type="button"
                onClick={handleNextClick}
                className="flex items-center justify-center gap-1 px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLast ? '完成练习 Finish Exercise' : '下一题 Next Question'}
                {!isLast && <ChevronRight size={16} />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackPanel({ question, answer }: { question: Question; answer: StudentAnswer }) {
  const isCorrect = answer.isCorrect;
  const marksAwarded = answer.marksAwarded ?? 0;
  const marksTotal = answer.marksTotal ?? question.marks;

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? (
          <CheckCircle2 size={20} className="text-green-600" aria-label="Correct" />
        ) : (
          <XCircle size={20} className="text-amber-600" aria-label="Incorrect" />
        )}
        <span className="font-medium">
          {isCorrect
            ? '正确！Correct'
            : `${marksAwarded}/${marksTotal} 分 · Partial`}
        </span>
      </div>

      {answer.feedback && (
        <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">{answer.feedback}</p>
      )}

      {/* Marking points breakdown for written questions */}
      {question.markingPoints && question.markingPoints.length > 0 && answer.marksTotal !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">Marking Points / 评分点:</p>
          <ul className="space-y-1.5">
            {question.markingPoints.map((mp) => {
              const matched =
                answer.marksAwarded !== undefined && answer.marksAwarded >= 0
                  ? (answer.feedback?.includes(mp.englishMeaning) ?? false) ||
                    (answer.feedback?.includes(mp.chineseKeywords?.[0] ?? '___') ?? false)
                  : false;
              return (
                <li key={mp.id} className="text-xs flex items-start gap-2">
                  <span className={matched ? 'text-green-600' : 'text-gray-400'}>
                    {matched ? '✓' : '○'}
                  </span>
                  <span className="flex-1">
                    <span className="text-gray-700">{mp.englishMeaning}</span>
                    {mp.chineseKeywords && mp.chineseKeywords.length > 0 && (
                      <span className="text-gray-400"> · 关键词: {mp.chineseKeywords.join('、')}</span>
                    )}
                  </span>
                  <span className="text-gray-500 flex-shrink-0">{mp.marks} pt{mp.marks > 1 ? 's' : ''}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Model answer */}
      {question.modelAnswer && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">参考答案 Model Answer:</p>
          <p className="chinese-text font-medium">{question.modelAnswer}</p>
          {question.modelAnswerPinyin && (
            <p className="pinyin-text mt-1">{question.modelAnswerPinyin}</p>
          )}
        </div>
      )}
    </div>
  );
}