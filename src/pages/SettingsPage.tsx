import { useState } from 'react';
import { Settings, Trash2, Volume2, Info } from 'lucide-react';
import { useStatsStore } from '../stores/statsStore';
import { AudioSpeed } from '../types';
import { AUDIO_SPEEDS } from '../data/topics';

export function SettingsPage() {
  const resetStats = useStatsStore(s => s.resetStats);
  const stats = useStatsStore(s => s.stats);
  const [showConfirm, setShowConfirm] = useState(false);
  const [defaultSpeed, setDefaultSpeed] = useState<AudioSpeed>(1.0);

  const handleReset = () => {
    resetStats();
    setShowConfirm(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings size={24} className="text-blue-600" />
        设置 Settings
      </h1>

      {/* Default speed */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 size={18} className="text-gray-500" />
          <h2 className="font-medium">默认语速 Default Speed</h2>
        </div>
        <select
          value={defaultSpeed}
          onChange={(e) => setDefaultSpeed(Number(e.target.value) as AudioSpeed)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {AUDIO_SPEEDS.map(s => (
            <option key={s} value={s}>{s}x {s === 0.75 ? '(Slow)' : s === 1.0 ? '(Normal)' : s >= 1.5 ? '(Fast)' : ''}</option>
          ))}
        </select>
      </section>

      {/* About */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Info size={18} className="text-gray-500" />
          <h2 className="font-medium">关于 About</h2>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          VCE 中文听力练习 — 专为VCE中文学生设计的自适应听力练习应用。
        </p>
        <p className="text-sm text-gray-600">
          VCE Chinese Listening Practice — An adaptive listening practice app designed for VCE Chinese students.
        </p>
        <p className="text-xs text-gray-400 mt-3">Version 0.1.0</p>
      </section>

      {/* Data management */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={18} className="text-gray-500" />
          <h2 className="font-medium">数据管理 Data Management</h2>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          总练习次数：{stats.totalExercises} · 总题数：{stats.totalQuestions}
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            重置所有数据 Reset All Data
          </button>
        ) : (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 font-medium mb-2">
              确定要重置所有学习数据吗？此操作不可撤销。
            </p>
            <p className="text-xs text-red-600 mb-3">
              Are you sure? This will delete all your progress and cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                确认重置 Confirm Reset
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                取消 Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
