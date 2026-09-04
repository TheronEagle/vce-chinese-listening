import { VCECategory, Difficulty, QuestionType, AudioSpeed } from '../types';

export const VCE_CATEGORIES: { id: VCECategory; name: string; nameCn: string; emoji: string }[] = [
  { id: 'personal_life', name: 'Personal Life', nameCn: '个人生活', emoji: '👤' },
  { id: 'family', name: 'Family', nameCn: '家庭', emoji: '👨‍👩‍👧‍👦' },
  { id: 'school', name: 'School', nameCn: '学校', emoji: '🏫' },
  { id: 'festivals', name: 'Festivals', nameCn: '节日', emoji: '🎉' },
  { id: 'lifestyle', name: 'Lifestyle', nameCn: '生活方式', emoji: '🌿' },
  { id: 'travel', name: 'Travel', nameCn: '旅游', emoji: '✈️' },
  { id: 'food', name: 'Food', nameCn: '饮食', emoji: '🍜' },
  { id: 'leisure', name: 'Leisure', nameCn: '休闲', emoji: '🎮' },
  { id: 'employment', name: 'Employment', nameCn: '就业', emoji: '💼' },
  { id: 'future_aspirations', name: 'Future Aspirations', nameCn: '未来理想', emoji: '🌟' },
  { id: 'study', name: 'Study', nameCn: '学习', emoji: '📚' },
  { id: 'study_abroad', name: 'Study Abroad', nameCn: '留学', emoji: '🎓' },
  { id: 'chinese_culture', name: 'Chinese Culture', nameCn: '中华文化', emoji: '🏮' },
  { id: 'chinese_society', name: 'Chinese Society', nameCn: '中国社会', emoji: '🇨🇳' },
  { id: 'chinese_philosophies', name: 'Chinese Philosophies', nameCn: '中国哲学', emoji: '☯️' },
  { id: 'myths_legends', name: 'Myths & Legends', nameCn: '神话传说', emoji: '🐉' },
  { id: 'contemporary_china', name: 'Contemporary China', nameCn: '当代中国', emoji: '🏙️' },
  { id: 'social_economic', name: 'Social & Economic Development', nameCn: '社会经济发展', emoji: '📈' },
];

export const DIFFICULTIES: { id: Difficulty; name: string; description: string }[] = [
  { id: 'beginner', name: 'Beginner', description: 'Simple vocabulary, slow pace, clear structure' },
  { id: 'intermediate', name: 'Intermediate', description: 'Moderate vocabulary, natural pace, some complexity' },
  { id: 'advanced', name: 'Advanced', description: 'Rich vocabulary, fast pace, nuanced content' },
];

export const QUESTION_TYPES: { id: QuestionType; name: string; nameCn: string }[] = [
  { id: 'multiple_choice', name: 'Multiple Choice', nameCn: '选择题' },
  { id: 'specific_information', name: 'Specific Information', nameCn: '具体信息' },
  { id: 'which_three', name: 'Which Three...', nameCn: '哪三个' },
  { id: 'why_reason', name: 'Why / Reason', nameCn: '原因' },
  { id: 'advantages', name: 'Advantages', nameCn: '优点' },
  { id: 'disadvantages', name: 'Disadvantages', nameCn: '缺点' },
  { id: 'main_idea', name: 'Main Idea', nameCn: '主旨大意' },
  { id: 'comparison', name: 'Comparison', nameCn: '比较' },
  { id: 'opinion_attitude', name: 'Opinion / Attitude', nameCn: '观点态度' },
  { id: 'cause_effect', name: 'Cause & Effect', nameCn: '因果关系' },
  { id: 'complex_4mark', name: 'Complex (4 marks)', nameCn: '综合题4分' },
  { id: 'complex_5mark', name: 'Complex (5 marks)', nameCn: '综合题5分' },
  { id: 'complex_6mark', name: 'Complex (6 marks)', nameCn: '综合题6分' },
];

export const AUDIO_SPEEDS: AudioSpeed[] = [0.75, 0.85, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];

export function getCategoryLabel(id: VCECategory): string {
  return VCE_CATEGORIES.find(c => c.id === id)?.name ?? id;
}

export function getCategoryCn(id: VCECategory): string {
  return VCE_CATEGORIES.find(c => c.id === id)?.nameCn ?? id;
}

export function getCategoryEmoji(id: VCECategory): string {
  return VCE_CATEGORIES.find(c => c.id === id)?.emoji ?? '📖';
}
