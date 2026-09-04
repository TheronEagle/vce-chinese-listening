import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { Question, StudentAnswer, QuestionType } from '../../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  answer?: StudentAnswer;
  onSubmit: (questionId: string, answer: number | string) => void;
  showFeedback?: boolean;
  disabled?: boolean;
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

export function QuestionCard({
  question,
  index,
  total,
  answer,
  onSubmit,
  showFeedback = false,
  disabled = false,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(
    typeof answer?.answer === 'number' ? answer.answer : undefined
  );
  const [textAnswer, setTextAnswer] = useState(
    typeof answer?.answer === 'string' ? answer.answer : ''
  );
  const [submitted, setSubmitted] = useState(!!answer);

  useEffect(() => {
    if (answer) {
      setSubmitted(true);
      if (typeof answer.answer === 'number') setSelectedOption(answer.answer);
      if (typeof answer.answer === 'string') setTextAnswer(answer.answer);
    }
  }, [answer]);

  const handleSubmit = () => {
    if (question.type === 'multiple_choice' || question.type === 'main_idea') {
      if (selectedOption === undefined) return;
      onSubmit(question.id, selectedOption);
    } else {
      if (!textAnswer.trim()) return;
      onSubmit(question.id, textAnswer);
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedOption(undefined);
    setTextAnswer('');
  };

  const isMC = question.type === 'multiple_choice' || question.type === 'main_idea';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {QUESTION_TYPE_LABELS[question.type]}
        </span>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
        </span>
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-lg font-medium chinese-text mb-1">{question.chineseQuestion}</p>
        <p className="text-sm text-gray-500">{question.englishInstruction}</p>
      </div>

      {/* Answer area */}
      {!submitted ? (
        <div>
          {isMC && question.options ? (
            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  disabled={disabled}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all chinese-text ${
                    selectedOption === i
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50`}
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
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={disabled}
                placeholder="请用中文回答 / Answer in Chinese..."
                className="w-full h-28 px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 chinese-text text-base transition-colors disabled:opacity-50"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={disabled || (isMC ? selectedOption === undefined : !textAnswer.trim())}
            className="mt-3 w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send size={16} />
            提交答案 Submit
          </button>
        </div>
      ) : (
        <div>
          {/* Show submitted answer */}
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">你的答案 Your Answer:</p>
            {isMC ? (
              <p className="chinese-text font-medium">
                {String.fromCharCode(65 + (selectedOption ?? 0))}. {question.options?.[selectedOption ?? 0]}
              </p>
            ) : (
              <p className="chinese-text">{textAnswer}</p>
            )}
          </div>

          {/* Feedback */}
          {showFeedback && answer && (
            <FeedbackPanel question={question} answer={answer} />
          )}

          {!disabled && (
            <button
              onClick={handleReset}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              重新作答 Try Again
            </button>
          )}
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
    <div className={`p-4 rounded-lg border-2 ${
      isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? (
          <CheckCircle2 size={20} className="text-green-600" />
        ) : (
          <XCircle size={20} className="text-amber-600" />
        )}
        <span className="font-medium">
          {isCorrect ? '正确！' : `${marksAwarded}/${marksTotal} 分`}
        </span>
      </div>

      {answer.feedback && (
        <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">{answer.feedback}</p>
      )}

      {/* Model answer */}
      {question.modelAnswer && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-1">参考答案 Model Answer:</p>
          <p className="chinese-text font-medium">{question.modelAnswer}</p>
          {question.modelAnswerPinyin && (
            <p className="pinyin-text mt-1">{question.modelAnswerPinyin}</p>
          )}
        </div>
      )}
    </div>
  );
}
