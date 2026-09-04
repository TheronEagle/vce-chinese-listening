import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Play, ArrowLeft } from 'lucide-react';
import { SAMPLE_EXERCISES } from '../data/sample-exercises';
import { VCE_CATEGORIES, DIFFICULTIES, getCategoryEmoji, getCategoryLabel } from '../data/topics';
import type { VCECategory, Difficulty } from '../types';

export function CustomPracticePage() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<VCECategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  const filtered = useMemo(() => {
    return SAMPLE_EXERCISES.filter(ex => {
      if (selectedTopic !== 'all' && ex.script.topic !== selectedTopic) return false;
      if (selectedDifficulty !== 'all' && ex.script.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [selectedTopic, selectedDifficulty]);

  const topicsWithExercises = useMemo(() => {
    const topics = new Set(SAMPLE_EXERCISES.map(e => e.script.topic));
    return VCE_CATEGORIES.filter(c => topics.has(c.id));
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Filter size={20} className="text-blue-600" />
          自定义练习 Custom Practice
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">筛选 Filters</h2>

        {/* Topic filter */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">主题 Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value as VCECategory | 'all')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部主题 All Topics</option>
            {topicsWithExercises.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.nameCn} — {c.name}</option>
            ))}
          </select>
        </div>

        {/* Difficulty filter */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">难度 Difficulty</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                selectedDifficulty === 'all'
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              全部
            </button>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                  selectedDifficulty === d.id
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-3">
        找到 {filtered.length} 个练习 Found {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Exercise list */}
      <div className="space-y-2">
        {filtered.map(ex => (
          <button
            key={ex.id}
            onClick={() => navigate(`/practice?exercise=${ex.id}`)}
            className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium chinese-text">{ex.script.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {getCategoryEmoji(ex.script.topic)} {getCategoryLabel(ex.script.topic)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ex.questions.length} 题 · {ex.questions.reduce((s, q) => s + q.marks, 0)} 分
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  ex.script.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  ex.script.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {ex.script.difficulty}
                </span>
                <Play size={16} className="text-blue-400" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Filter size={48} className="mx-auto mb-3 opacity-30" />
          <p>没有找到匹配的练习</p>
          <p className="text-sm">No exercises match your filters.</p>
        </div>
      )}
    </div>
  );
}
