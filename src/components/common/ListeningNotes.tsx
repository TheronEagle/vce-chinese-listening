import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface ListeningNotesProps {
  exerciseId: string;
  visible?: boolean;
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

export function ListeningNotes({ exerciseId, visible = true }: ListeningNotesProps) {
  const [notes, setNotes] = useState(() => loadNotes(exerciseId));
  const [expanded, setExpanded] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setNotes(loadNotes(exerciseId));
  }, [exerciseId]);

  const handleChange = (value: string) => {
    setNotes(value);
    // Debounced save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveNotes(exerciseId, value);
    }, 500);
  };

  const handleClear = () => {
    setNotes('');
    saveNotes(exerciseId, '');
    textareaRef.current?.focus();
  };

  if (!visible) return null;

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M14 3v6h6"/></svg>
          📝 听力笔记 Listening Notes
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {notes && expanded && (
          <button
            onClick={handleClear}
            className="text-xs text-amber-600 hover:text-red-600 flex items-center gap-1"
          >
            <Trash2 size={12} />
            清除
          </button>
        )}
      </div>

      {expanded && (
        <>
          <p className="text-xs text-amber-600 mb-2">
            边听边记关键词，帮助你回答问题。Write key words while listening.
          </p>
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="在这里记笔记... Take notes here..."
            className="w-full h-28 p-3 text-sm border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none chinese-text"
          />
          <p className="text-xs text-amber-500 mt-1 text-right">
            {notes.length} 字
          </p>
        </>
      )}
    </div>
  );
}
