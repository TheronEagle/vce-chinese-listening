import { useStatsStore } from '../stores/statsStore';
import { getCategoryLabel, getCategoryEmoji, QUESTION_TYPES, DIFFICULTIES } from '../data/topics';
import { BarChart3, Target, Flame, BookOpen, TrendingUp, Clock } from 'lucide-react';

export function StatsPage() {
  const stats = useStatsStore(s => s.stats);

  // Topic stats (only those with data)
  const topicEntries = Object.values(stats.topicStats)
    .filter(t => t.exercisesCompleted > 0)
    .sort((a, b) => b.exercisesCompleted - a.exercisesCompleted);

  // Question type stats (only those with data)
  const qTypeEntries = Object.values(stats.questionTypeStats)
    .filter(q => q.questionsAnswered > 0)
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 size={24} className="text-blue-600" />
        学习统计 Statistics
      </h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatBox
          icon={<Target size={18} className="text-blue-500" />}
          value={`${Math.round(stats.overallAccuracy)}%`}
          label="总正确率 Accuracy"
        />
        <StatBox
          icon={<BookOpen size={18} className="text-green-500" />}
          value={stats.totalExercises}
          label="练习次数 Exercises"
        />
        <StatBox
          icon={<Flame size={18} className="text-orange-500" />}
          value={stats.currentStreak}
          label="当前连续 Streak"
        />
        <StatBox
          icon={<TrendingUp size={18} className="text-purple-500" />}
          value={`${stats.marksAwarded}/${stats.totalMarks}`}
          label="总得分 Total Marks"
        />
      </div>

      {/* Performance by topic */}
      {topicEntries.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            📊 按主题分 By Topic
          </h2>
          <div className="space-y-2">
            {topicEntries.map(t => (
              <div key={t.topic} className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium chinese-text">
                    {getCategoryEmoji(t.topic)} {getCategoryLabel(t.topic)}
                  </span>
                  <span className={`text-sm font-bold ${
                    t.accuracy >= 80 ? 'text-green-600' :
                    t.accuracy >= 60 ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {Math.round(t.accuracy)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      t.accuracy >= 80 ? 'bg-green-500' :
                      t.accuracy >= 60 ? 'bg-blue-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, t.accuracy)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {t.exercisesCompleted} 次练习 · {t.marksAwarded}/{t.totalMarks} 分
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Performance by question type */}
      {qTypeEntries.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            📝 按题型分 By Question Type
          </h2>
          <div className="space-y-2">
            {qTypeEntries.map(q => {
              const label = QUESTION_TYPES.find(t => t.id === q.type);
              return (
                <div key={q.type} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {label?.name ?? q.type}
                    </span>
                    <span className={`text-sm font-bold ${
                      q.accuracy >= 80 ? 'text-green-600' :
                      q.accuracy >= 60 ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {Math.round(q.accuracy)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        q.accuracy >= 80 ? 'bg-green-500' :
                        q.accuracy >= 60 ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, q.accuracy)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {q.questionsAnswered} 题
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Difficulty performance */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          📈 按难度分 By Difficulty
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map(d => {
            const data = stats.difficultyStats[d.id];
            return (
              <div key={d.id} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-xs font-medium text-gray-500 mb-1">{d.name}</p>
                <p className={`text-lg font-bold ${
                  data.accuracy >= 80 ? 'text-green-600' :
                  data.accuracy >= 60 ? 'text-blue-600' :
                  data.attempts > 0 ? 'text-red-600' : 'text-gray-300'
                }`}>
                  {data.attempts > 0 ? `${Math.round(data.accuracy)}%` : '—'}
                </p>
                <p className="text-xs text-gray-400">{data.attempts} 次</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Speed performance */}
      {Object.keys(stats.speedStats).length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            🎵 按速度分 By Speed
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.speedStats)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([speed, data]) => (
                <div key={speed} className="bg-white rounded-xl border border-gray-100 p-2.5 text-center min-w-[70px]">
                  <p className="text-xs font-medium text-gray-500">{speed}x</p>
                  <p className={`text-sm font-bold ${
                    data.accuracy >= 80 ? 'text-green-600' :
                    data.accuracy >= 60 ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {Math.round(data.accuracy)}%
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Recent sessions */}
      {stats.recentSessions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            <Clock size={14} className="inline mr-1" />
            最近练习 Recent Sessions
          </h2>
          <div className="space-y-2">
            {stats.recentSessions.slice(0, 10).map(s => {
              const pct = s.totalMarks > 0 ? Math.round((s.marksAwarded / s.totalMarks) * 100) : 0;
              return (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.exerciseId}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(s.completedAt || s.startedAt).toLocaleDateString()} · {s.audioSpeed}x
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {pct}%
                    </p>
                    <p className="text-xs text-gray-400">{s.marksAwarded}/{s.totalMarks}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {stats.totalExercises === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BarChart3 size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">还没有练习记录</p>
          <p className="text-sm">No practice records yet. Start practicing to see your stats!</p>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
