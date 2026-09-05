import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { ListeningScript } from '../../types';

interface TranscriptProps {
  script: ListeningScript;
  currentLineIndex?: number;
}

export function Transcript({ script, currentLineIndex = -1 }: TranscriptProps) {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showVocab, setShowVocab] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <BookOpen size={20} className="text-blue-600" />
          听力原文 Transcript
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              showPinyin ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            拼音
          </button>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              showEnglish ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Dialogue lines */}
      <div className="space-y-3">
        {script.dialogue.map((line, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg transition-colors ${
              idx === currentLineIndex
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50'
            }`}
          >
            <span className={`text-xs font-medium ${
              line.speaker === 'A' ? 'text-pink-600' : 'text-blue-600'
            }`}>
              {line.speakerName || `${line.speaker}：`}
            </span>
            <p className="chinese-text text-base mt-0.5">{line.chinese}</p>
            {showPinyin && (
              <p className="pinyin-text mt-0.5">{line.pinyin}</p>
            )}
            {showEnglish && (
              <p className="text-xs text-gray-400 mt-0.5 italic">{line.english}</p>
            )}
          </div>
        ))}
      </div>

      {/* Vocabulary */}
      {script.vocabulary.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowVocab(!showVocab)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            重点词汇 Key Vocabulary ({script.vocabulary.length})
            {showVocab ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showVocab && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {script.vocabulary.map((v, idx) => (
                <div key={idx} className="flex items-baseline gap-2 text-sm">
                  <span className="chinese-text font-medium">{v.chinese}</span>
                  <span className="pinyin-text">{v.pinyin}</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-gray-600">{v.english}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full English translation */}
      <details className="mt-3">
        <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
          完整英文翻译 Full English Translation
        </summary>
        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{script.fullEnglish}</p>
      </details>
    </div>
  );
}
