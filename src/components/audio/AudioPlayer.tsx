import { useState, useCallback, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { AudioSpeed, DialogueLine } from '../../types';
import { speakLine, speakDialogue, stopSpeech } from '../../services/audio';
import { AUDIO_SPEEDS } from '../../data/topics';

interface AudioPlayerProps {
  lines: DialogueLine[];
  speed: AudioSpeed;
  onSpeedChange: (speed: AudioSpeed) => void;
  onLineChange?: (index: number) => void;
  onComplete?: () => void;
  currentLineIndex?: number;
  disabled?: boolean;
}

export function AudioPlayer({
  lines,
  speed,
  onSpeedChange,
  onLineChange,
  onComplete,
  currentLineIndex = -1,
  disabled = false,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);
  const playingRef = useRef(false);

  useEffect(() => {
    return () => { stopSpeech(); };
  }, []);

  const handlePlayAll = useCallback(() => {
    if (playing) {
      stopSpeech();
      setPlaying(false);
      playingRef.current = false;
      return;
    }

    setPlaying(true);
    playingRef.current = true;
    speakDialogue(
      lines,
      speed,
      (idx) => {
        setLineIndex(idx);
        onLineChange?.(idx);
      },
      () => {
        setPlaying(false);
        playingRef.current = false;
        onComplete?.();
      }
    );
  }, [playing, lines, speed, onLineChange, onComplete]);

  const handlePlayLine = useCallback((idx: number) => {
    stopSpeech();
    setLineIndex(idx);
    onLineChange?.(idx);
    speakLine(lines[idx], speed);
  }, [lines, speed, onLineChange]);

  const handleStop = useCallback(() => {
    stopSpeech();
    setPlaying(false);
    playingRef.current = false;
    setLineIndex(-1);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Main controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayAll}
            disabled={disabled}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            onClick={handleStop}
            className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <SkipBack size={16} />
          </button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-gray-400" />
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value) as AudioSpeed)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AUDIO_SPEEDS.map(s => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>
        </div>
      </div>

      {/* Line-by-line playback */}
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {lines.map((line, idx) => (
          <button
            key={idx}
            onClick={() => handlePlayLine(idx)}
            disabled={disabled}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              lineIndex === idx
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50 border border-transparent'
            } disabled:opacity-50`}
          >
            <span className={`font-medium mr-2 ${
              line.speaker === 'A' ? 'text-pink-600' : 'text-blue-600'
            }`}>
              {line.speakerName || `${line.speaker}：`}
            </span>
            <span className="chinese-text">{line.chinese}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
