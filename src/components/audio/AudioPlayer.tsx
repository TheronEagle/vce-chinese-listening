import { useState, useCallback, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { AudioSpeed, DialogueLine } from '../../types';
import { playLine, playFullDialogue, stopAudio } from '../../services/audio';
import { AUDIO_SPEEDS } from '../../data/topics';

interface AudioPlayerProps {
  exerciseId: string;
  lines: DialogueLine[];
  speed: AudioSpeed;
  onSpeedChange: (speed: AudioSpeed) => void;
  onLineChange?: (index: number) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export function AudioPlayer({
  exerciseId,
  lines,
  speed,
  onSpeedChange,
  onLineChange,
  onComplete,
  disabled = false,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);
  const [playedOnce, setPlayedOnce] = useState(false);
  const playingRef = useRef(false);

  useEffect(() => {
    return () => { stopAudio(); };
  }, []);

  const handlePlayAll = useCallback(() => {
    if (playing) {
      stopAudio();
      setPlaying(false);
      playingRef.current = false;
      return;
    }

    setPlaying(true);
    playingRef.current = true;
    playFullDialogue(
      exerciseId,
      lines,
      speed,
      (idx) => {
        setLineIndex(idx);
        onLineChange?.(idx);
      },
      () => {
        setPlaying(false);
        playingRef.current = false;
        setPlayedOnce(true);
        onComplete?.();
      }
    );
  }, [playing, exerciseId, lines, speed, onLineChange, onComplete]);

  const handlePlayLine = useCallback((idx: number) => {
    stopAudio();
    setLineIndex(idx);
    onLineChange?.(idx);
    playLine(exerciseId, idx, lines[idx], speed);
  }, [exerciseId, lines, speed, onLineChange]);

  const handleStop = useCallback(() => {
    stopAudio();
    setPlaying(false);
    playingRef.current = false;
    setLineIndex(-1);
  }, []);

  const handleReplay = useCallback(() => {
    stopAudio();
    setPlaying(false);
    setLineIndex(-1);
    setPlayedOnce(false);
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

          {playing && (
            <button
              onClick={handleStop}
              className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
            </button>
          )}

          {playedOnce && !playing && (
            <button
              onClick={handleReplay}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Replay"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
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
              <option key={s} value={s}>{s}x {s === 0.75 ? '(Slow)' : s === 1.0 ? '(Normal)' : s >= 1.5 ? '(Fast)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status */}
      {playing && lineIndex >= 0 && (
        <div className="mb-3 px-3 py-2 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            🎧 正在播放 Playing: 第{lineIndex + 1}句 / {lines.length}句
          </p>
        </div>
      )}

      {!playing && playedOnce && (
        <div className="mb-3 px-3 py-2 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ 播放完成 Playback complete — 现在可以开始做题了
          </p>
        </div>
      )}

      {/* Line-by-line playback (collapsed by default, expandable) */}
      <details className="mt-2">
        <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 select-none">
          逐句播放 Play by line ({lines.length}句)
        </summary>
        <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
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
      </details>
    </div>
  );
}
