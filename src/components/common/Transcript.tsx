import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Play, Volume2 } from 'lucide-react';
import { ListeningScript, DialogueLine, AudioSpeed } from '../../types';
import { playLine, playFullDialogue, stopAudio } from '../../services/audio';

interface TranscriptProps {
  script: ListeningScript;
  exerciseId?: string;
  currentLineIndex?: number;
  audioSpeed?: AudioSpeed;
}

/**
 * Transcript — revealed after exercise completion.
 *
 * Modes:
 *  - Default: Chinese only (cleanest)
 *  - Toggle Pinyin: adds pinyin line
 *  - Toggle English: adds English line
 *  - Vocabulary & full English translation are collapsible
 *
 * Per-line playback: if exerciseId is provided, each line has a small
 * play button next to it so students can re-listen to a specific line
 * while comparing notes.
 */
export function Transcript({
  script,
  exerciseId,
  currentLineIndex = -1,
  audioSpeed = 1.0,
}: TranscriptProps) {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showVocab, setShowVocab] = useState(false);
  const [showFullTranslation, setShowFullTranslation] = useState(false);

  const handlePlayLine = (line: DialogueLine, idx: number) => {
    if (!exerciseId) return;
    playLine(exerciseId, idx, line, audioSpeed);
  };

  const handlePlayFull = () => {
    if (!exerciseId) return;
    stopAudio();
    playFullDialogue(exerciseId, script.dialogue, audioSpeed);
  };

  const handleStop = () => stopAudio();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
          <BookOpen size={18} className="text-blue-600" />
          听力原文 Transcript
        </h3>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {exerciseId && (
            <>
              <button
                onClick={handlePlayFull}
                className="flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Play full dialogue"
              >
                <Volume2 size={12} />
                Play Full
              </button>
              <button
                onClick={handleStop}
                className="text-xs px-2 sm:px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Stop audio"
              >
                Stop
              </button>
            </>
          )}
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className={`text-xs px-2 sm:px-2.5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showPinyin ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}
            aria-pressed={showPinyin}
          >
            拼音
          </button>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`text-xs px-2 sm:px-2.5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showEnglish ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}
            aria-pressed={showEnglish}
          >
            English
          </button>
        </div>
      </div>

      {/* Dialogue lines */}
      <ol className="space-y-2.5" role="list">
        {script.dialogue.map((line, idx) => (
          <li
            key={idx}
            className={`p-2.5 sm:p-3 rounded-lg transition-colors ${
              idx === currentLineIndex
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs font-mono text-gray-400 mt-1 min-w-[1.5rem] flex-shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium ${
                  line.speaker === 'A' ? 'text-pink-600' : 'text-blue-600'
                }`}>
                  {line.speakerName || `${line.speaker}：`}
                </span>
                <p className="chinese-text text-base mt-0.5 leading-relaxed break-words">
                  {line.chinese}
                </p>
                {showPinyin && (
                  <p className="pinyin-text mt-0.5">{line.pinyin}</p>
                )}
                {showEnglish && (
                  <p className="text-xs text-gray-500 mt-0.5 italic break-words">{line.english}</p>
                )}
              </div>
              {exerciseId && (
                <button
                  onClick={() => handlePlayLine(line, idx)}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Play line ${idx + 1}`}
                  title={`Play line ${idx + 1}`}
                >
                  <Play size={12} className="ml-0.5" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Vocabulary */}
      {script.vocabulary.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowVocab(!showVocab)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:underline"
          >
            重点词汇 Key Vocabulary ({script.vocabulary.length})
            {showVocab ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showVocab && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {script.vocabulary.map((v, idx) => (
                <div key={idx} className="flex items-baseline gap-2 text-sm">
                  <span className="chinese-text font-medium flex-shrink-0">{v.chinese}</span>
                  <span className="pinyin-text flex-shrink-0">{v.pinyin}</span>
                  <span className="text-gray-400 flex-shrink-0">—</span>
                  <span className="text-gray-600 break-words">{v.english}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full English translation */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => setShowFullTranslation(!showFullTranslation)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:underline"
        >
          完整英文翻译 Full English Translation
          {showFullTranslation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showFullTranslation && (
          <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{script.fullEnglish}</p>
        )}
      </div>
    </div>
  );
}