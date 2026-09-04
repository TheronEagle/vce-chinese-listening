import { DialogueLine, AudioSpeed } from '../types';

/**
 * Audio service using Web Speech API (free, no external dependencies).
 * Generates speech for Chinese dialogue with male/female voice distinction.
 */

let voicesLoaded = false;
let availableVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      availableVoices = voices;
      voicesLoaded = true;
      resolve(voices);
    }
    speechSynthesis.onvoiceschanged = () => {
      availableVoices = speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(availableVoices);
    };
  });
}

export async function initAudio(): Promise<void> {
  await loadVoices();
}

function getChineseVoice(speaker: 'A' | 'B' | 'narrator'): SpeechSynthesisVoice | null {
  const chineseVoices = availableVoices.filter(v =>
    v.lang.startsWith('zh') || v.lang.includes('CN') || v.lang.includes('Hans')
  );

  if (chineseVoices.length === 0) {
    // Fallback: any voice
    return availableVoices[0] || null;
  }

  // Try to assign male/female
  // Speaker A (often female in dialogues) = first voice
  // Speaker B (often male) = second voice
  if (speaker === 'A') return chineseVoices[0];
  if (speaker === 'B') return chineseVoices[1] || chineseVoices[0];
  return chineseVoices[0];
}

export function speakLine(
  line: DialogueLine,
  speed: AudioSpeed = 1.0,
  onEnd?: () => void
): void {
  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(line.chinese);
  utterance.lang = 'zh-CN';
  utterance.rate = speed;
  utterance.pitch = line.speaker === 'A' ? 1.1 : 0.9; // Slight pitch difference
  utterance.volume = 1;

  const voice = getChineseVoice(line.speaker);
  if (voice) utterance.voice = voice;

  if (onEnd) utterance.onend = onEnd;

  speechSynthesis.speak(utterance);
}

export function speakDialogue(
  lines: DialogueLine[],
  speed: AudioSpeed = 1.0,
  onLineChange?: (index: number) => void,
  onComplete?: () => void
): void {
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
      // Small pause between speakers
      setTimeout(speakNext, 300);
    };

    speechSynthesis.speak(utterance);
  }

  speakNext();
}

export function stopSpeech(): void {
  speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking;
}
