import { DialogueLine, AudioSpeed } from '../types';

/**
 * Audio service using pre-generated edge-tts MP3 files.
 * Falls back to Web Speech API if audio files aren't available.
 */

// Cache for audio objects
const audioCache: Map<string, HTMLAudioElement> = new Map();
let currentAudio: HTMLAudioElement | null = null;

function getAudioPath(exerciseId: string, lineIdx: number): string {
  return `/audio/${exerciseId}/line-${String(lineIdx).padStart(2, '0')}.mp3`;
}

function getFullAudioPath(exerciseId: string): string {
  return `/audio/${exerciseId}/full.mp3`;
}

function getCachedAudio(src: string): HTMLAudioElement {
  let audio = audioCache.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = 'auto';
    audioCache.set(src, audio);
  }
  return audio;
}

export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  // Also stop Web Speech API as fallback
  try { speechSynthesis.cancel(); } catch {}
}

/**
 * Play a single dialogue line from pre-generated audio.
 * Falls back to Web Speech API if file not found.
 */
export function playLine(
  exerciseId: string,
  lineIdx: number,
  line: DialogueLine,
  speed: AudioSpeed = 1.0,
  onEnd?: () => void
): void {
  stopAudio();

  const src = getAudioPath(exerciseId, lineIdx);
  const audio = getCachedAudio(src);
  audio.playbackRate = speed;
  currentAudio = audio;

  const handleEnd = () => {
    audio.removeEventListener('ended', handleEnd);
    audio.removeEventListener('error', handleError);
    onEnd?.();
  };

  const handleError = () => {
    audio.removeEventListener('ended', handleEnd);
    audio.removeEventListener('error', handleError);
    // Fallback to Web Speech API
    fallbackSpeak(line, speed, onEnd);
  };

  audio.addEventListener('ended', handleEnd);
  audio.addEventListener('error', handleError);

  audio.currentTime = 0;
  audio.play().catch(handleError);
}

/**
 * Play the full dialogue from pre-generated audio.
 */
export function playFullDialogue(
  exerciseId: string,
  lines: DialogueLine[],
  speed: AudioSpeed = 1.0,
  onLineChange?: (index: number) => void,
  onComplete?: () => void
): void {
  stopAudio();

  const src = getFullAudioPath(exerciseId);
  const audio = getCachedAudio(src);
  audio.playbackRate = speed;
  currentAudio = audio;

  // Estimate line timing based on text length
  const totalDuration = audio.duration || 60;
  const totalChars = lines.reduce((sum, l) => sum + l.chinese.length, 0);
  let accumulated = 0;
  const lineTimings = lines.map((line, i) => {
    const start = accumulated;
    const duration = (line.chinese.length / totalChars) * totalDuration;
    accumulated += duration;
    return { index: i, start, end: accumulated };
  });

  let lastLineIdx = -1;
  const handleTimeUpdate = () => {
    const currentTime = audio.currentTime;
    for (const timing of lineTimings) {
      if (currentTime >= timing.start && currentTime < timing.end && timing.index !== lastLineIdx) {
        lastLineIdx = timing.index;
        onLineChange?.(timing.index);
        break;
      }
    }
  };

  const handleEnd = () => {
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('ended', handleEnd);
    audio.removeEventListener('error', handleError);
    onComplete?.();
  };

  const handleError = () => {
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('ended', handleEnd);
    audio.removeEventListener('error', handleError);
    // Fallback to Web Speech API for full dialogue
    fallbackSpeakDialogue(lines, speed, onLineChange, onComplete);
  };

  audio.addEventListener('timeupdate', handleTimeUpdate);
  audio.addEventListener('ended', handleEnd);
  audio.addEventListener('error', handleError);

  audio.currentTime = 0;
  audio.play().catch(handleError);
}

/**
 * Check if pre-generated audio exists for an exercise.
 *
 * BUG-002 fix: actually probe the audio files instead of returning a
 * hard-coded true. We do a HEAD request for the full audio file, which
 * is the cheapest check; if it 404s we fall back to the Web Speech API
 * for the entire exercise.
 *
 * The result is cached per exercise id for the lifetime of the page.
 */
const existenceCache: Map<string, Promise<boolean>> = new Map();

export function hasAudioFile(exerciseId: string): Promise<boolean> {
  const cached = existenceCache.get(exerciseId);
  if (cached) return cached;

  const probe = new Promise<boolean>((resolve) => {
    try {
      const audio = new Audio();
      audio.preload = 'metadata';
      let settled = false;
      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        audio.removeEventListener('loadedmetadata', onOk);
        audio.removeEventListener('error', onErr);
        resolve(ok);
      };
      const onOk = () => finish(true);
      const onErr = () => finish(false);
      audio.addEventListener('loadedmetadata', onOk);
      audio.addEventListener('error', onErr);
      audio.src = getFullAudioPath(exerciseId);
      // Timeout fallback — if the network is silent, treat as missing.
      setTimeout(() => finish(false), 4000);
    } catch {
      resolve(false);
    }
  });

  existenceCache.set(exerciseId, probe);
  return probe;
}

// ========== Web Speech API Fallback ==========

let voicesLoaded = false;
let availableVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    try {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        availableVoices = voices;
        voicesLoaded = true;
        resolve(voices);
        return;
      }
      speechSynthesis.onvoiceschanged = () => {
        availableVoices = speechSynthesis.getVoices();
        voicesLoaded = true;
        resolve(availableVoices);
      };
    } catch {
      resolve([]);
    }
  });
}

export async function initAudio(): Promise<void> {
  await loadVoices();
}

function getChineseVoice(speaker: 'A' | 'B' | 'narrator'): SpeechSynthesisVoice | null {
  const chineseVoices = availableVoices.filter(v =>
    v.lang.startsWith('zh') || v.lang.includes('CN') || v.lang.includes('Hans')
  );
  if (chineseVoices.length === 0) return availableVoices[0] || null;
  if (speaker === 'A') return chineseVoices[0];
  if (speaker === 'B') return chineseVoices[1] || chineseVoices[0];
  return chineseVoices[0];
}

function fallbackSpeak(line: DialogueLine, speed: AudioSpeed, onEnd?: () => void): void {
  try {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(line.chinese);
    utterance.lang = 'zh-CN';
    utterance.rate = speed;
    utterance.pitch = line.speaker === 'A' ? 1.1 : 0.9;
    utterance.volume = 1;
    const voice = getChineseVoice(line.speaker);
    if (voice) utterance.voice = voice;
    if (onEnd) utterance.onend = onEnd;
    speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}

function fallbackSpeakDialogue(
  lines: DialogueLine[],
  speed: AudioSpeed,
  onLineChange?: (index: number) => void,
  onComplete?: () => void
): void {
  try {
    speechSynthesis.cancel();
    let currentIndex = 0;

    function speakNext() {
      if (currentIndex >= lines.length) {
        onComplete?.();
        return;
      }
      const line = lines[currentIndex];
      onLineChange?.(currentIndex);

      const utterance = new SpeechSynthesisUtterance(line.chinese);
      utterance.lang = 'zh-CN';
      utterance.rate = speed;
      utterance.pitch = line.speaker === 'A' ? 1.1 : 0.9;
      const voice = getChineseVoice(line.speaker);
      if (voice) utterance.voice = voice;
      utterance.onend = () => {
        currentIndex++;
        setTimeout(speakNext, 300);
      };
      speechSynthesis.speak(utterance);
    }
    speakNext();
  } catch {
    onComplete?.();
  }
}
