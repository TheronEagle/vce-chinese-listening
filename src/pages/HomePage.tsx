import { Link } from 'react-router-dom';
import { Headphones, BarChart3, Zap, BookOpen, Target, Flame } from 'lucide-react';
import { useStatsStore } from '../stores/statsStore';
import { SAMPLE_EXERCISES } from '../data/sample-exercises';
import { getCategoryEmoji, getCategoryLabel } from '../data/topics';
import { generateRecommendations } from '../services/adaptive';

export function HomePage() {
  const stats = useStatsStore(s => s.stats);
  const getWeakTopics = useStatsStore(s => s.getWeakTopics);

  const recommendations = generateRecommendations(stats);
  const weakTopics = getWeakTopics();

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          🎧 VCE 中文听力
        </h1>
        <p className="text-gray-500 mt-1">VCE Chinese Listening Practice</p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          icon={<Flame size={20} className="text-orange-500" />}
          value={stats.currentStreak}
          label="连续天数 Streak"
        />
        <StatCard
          icon={<Target size={20} className="text-blue-500" />}
          value={`${Math.round(stats.overallAccuracy)}%`}
          label="正确率 Accuracy"
        />
        <StatCard
          icon={<BookOpen size={20} className="text-green-500" />}
          value={stats.totalExercises}
          label="练习次数 Exercises"
        />
      </div>

      {/* Daily Listening CTA */}
      <Link
        to="/practice?mode=daily"
        className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5 mb-6 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Headphones size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold">每日听力 Daily Listening</h2>
            <p className="text-blue-100 text-sm mt-0.5">今天来练习吧！Start your daily practice</p>
          </div>
        </div>
      </Link>

      {/* Adaptive recommendation */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            🎯 推荐练习 Recommended
          </h3>
          <div className="space-y-2">
            {recommendations.slice(0, 2).map((rec, idx) => (
              <Link
                key={idx}
                to={`/practice?exercise=${SAMPLE_EXERCISES.find(e => e.script.topic === rec.topic)?.id ?? 'ex-001'}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryEmoji(rec.topic)}</span>
                  <div className="flex-1">
                    <p className="font-medium chinese-text">{getCategoryLabel(rec.topic)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{rec.reason}</p>
                  </div>
                  <Zap size={16} className="text-yellow-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Weak topics alert */}
      {weakTopics.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="text-sm font-semibold text-amber-700 mb-2">
            ⚠️ 需要加强 Needs Improvement
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakTopics.slice(0, 5).map(topic => (
              <span
                key={topic}
                className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full"
              >
                {getCategoryEmoji(topic)} {getCategoryLabel(topic)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Exercise library */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            📚 练习库 Exercise Library
          </h3>
          <Link to="/practice/custom" className="text-sm text-blue-600 font-medium">
            查看全部 View All →
          </Link>
        </div>
        <div className="space-y-2">
          {SAMPLE_EXERCISES.map(ex => (
            <Link
              key={ex.id}
              to={`/practice?exercise=${ex.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium chinese-text">{ex.script.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {getCategoryEmoji(ex.script.topic)} {getCategoryLabel(ex.script.topic)} · {ex.script.difficulty} · {ex.questions.length} questions
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                  {ex.script.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation shortcuts */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          to="/stats"
          className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-blue-200 transition-colors"
        >
          <BarChart3 size={24} className="mx-auto text-blue-600 mb-1" />
          <p className="text-sm font-medium">学习统计 Stats</p>
        </Link>
        <Link
          to="/practice?mode=custom"
          className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-blue-200 transition-colors"
        >
          <Zap size={24} className="mx-auto text-yellow-500 mb-1" />
          <p className="text-sm font-medium">自定义练习 Custom</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
