import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface ListeningNotesProps {
  exerciseId: string;
  /** Optional override for the title shown (e.g. "Your Notes" during review). */
  title?: string;
}

const STORAGE_KEY = 'vce-listening-notes';

function loadNotes(exerciseId: string): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const notes = JSON.parse(stored);
      return notes[exerciseId] || '';
    }
  } catch {}
  return '';
}

function saveNotes(exerciseId: string, notes: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const notesObj = stored ? JSON.parse(stored) : {};
    if (notes) {
      notesObj[exerciseId] = notes;
    } else {
      delete notesObj[exerciseId];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesObj));
  } catch {}
}

export function ListeningNotes({ exerciseId, title = '📝 听力笔记 Listening Notes' }: ListeningNotesProps) {
  const [notes, setNotes] = useState(() => loadNotes(exerciseId));
  const [expanded, setExpanded] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setNotes(loadNotes(exerciseId));
  }, [exerciseId]);

  const handleChange = (value: string) => {
    setNotes(value);
    // Debounced save to avoid hammering localStorage.
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveNotes(exerciseId, value);
    }, 500);
  };

  const handleClear = () => {
    if (typeof confirm !== 'undefined' && !confirm('Clear your notes for this exercise?')) {
      return;
    }
    setNotes('');
    saveNotes(exerciseId, '');
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900 focus:outline-none focus:underline"
          aria-expanded={expanded}
        >
          {title}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {notes && expanded && (
          <button
            onClick={handleClear}
            className="text-xs text-amber-600 hover:text-red-600 flex items-center gap-1 focus:outline-none focus:underline"
            aria-label="Clear notes"
          >
            <Trash2 size={12} />
            清除
          </button>
        )}
      </div>

      {expanded && (
        <>
          <p className="text-xs text-amber-700 mb-2">
            边听边记关键词，帮助你回答问题。Write key words while listening.
          </p>
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="在这里记笔记... Take notes here..."
            aria-label="Listening notes"
            className="w-full h-28 sm:h-32 p-2.5 sm:p-3 text-sm border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-y chinese-text"
          />
          <p className="text-xs text-amber-600 mt-1 text-right">
            {notes.length} 字 · 自动保存
          </p>
        </>
      )}
    </div>
  );
}