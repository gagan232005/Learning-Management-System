import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  BarChart2,
  Clock,
  Award,
  HelpCircle,
  BookOpen,
  PlaySquare,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const LearnerAnalyticsView: React.FC = () => {
  const { currentUser, courses } = useApp();

  const enrolledCourses = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyHours = currentUser.weeklyHours || [2.5, 3.8, 4.2, 1.9, 5.1, 6.0, 4.5];
  const maxHour = Math.max(...weeklyHours, 6);

  const subjectProficiencies = [
    { subject: 'Java & Spring Boot', score: 94, color: 'bg-blue-500' },
    { subject: 'Data Structures & Algorithms', score: 86, color: 'bg-emerald-500' },
    { subject: 'Relational DBMS & SQL', score: 88, color: 'bg-purple-500' },
    { subject: 'Computer Networks & TCP', score: 78, color: 'bg-amber-500' },
    { subject: 'Operating Systems Concurrency', score: 82, color: 'bg-cyan-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24 animate-in fade-in">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-950/70 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
            <BarChart2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">
                Personal Learning Analytics
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                INDIVIDUAL TELEMETRY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 font-display">
              {currentUser.name}'s Learning Performance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track your weekly study velocity, micro-assessment accuracy, subject proficiencies, and streak consistency.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-white/5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Study Time</span>
            <Clock size={16} className="text-sky-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{currentUser.totalLearningHours || 42.5} hrs</p>
          <span className="text-[10px] text-emerald-400">↑ 14% vs last week</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-white/5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quiz Accuracy</span>
            <HelpCircle size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{currentUser.quizAverage || 92}%</p>
          <span className="text-[10px] text-teal-400">Top 5% on platform</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-white/5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reels Watched</span>
            <PlaySquare size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{currentUser.reelsWatchedTotal || 65}</p>
          <span className="text-[10px] text-rose-400">{currentUser.streakDays} days active streak</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-white/5 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Badges Unlocked</span>
            <Award size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{currentUser.badges.length} Badges</p>
          <span className="text-[10px] text-amber-400">{currentUser.points} XP total</span>
        </div>
      </div>

      {/* Weekly Hours Bar Chart & Subject Proficiencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours */}
        <div className="p-6 rounded-3xl glass-panel bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock size={16} className="text-sky-400" />
              <span>Weekly Learning Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Past 7 Days</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2 bg-slate-800/40 rounded-2xl border border-white/5">
            {weeklyHours.map((h, i) => {
              const heightPercent = Math.round((h / maxHour) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div
                    className="w-full max-w-[32px] bg-gradient-to-t from-blue-600 to-sky-400 rounded-lg group-hover:brightness-125 transition-all relative"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none">
                      {h}h
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Proficiencies */}
        <div className="p-6 rounded-3xl glass-panel bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>Topic Competency Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Accuracy %</span>
          </div>

          <div className="space-y-3 pt-1">
            {subjectProficiencies.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.subject}</span>
                  <span className="font-mono font-bold text-white">{item.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
