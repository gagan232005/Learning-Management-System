import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformTimeFilter } from '../../types';
import {
  BarChart3,
  Users,
  BookOpen,
  Clock,
  DollarSign
} from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const { timeFilter, setTimeFilter, courses, users } = useApp();

  const filterMultiplier: Record<PlatformTimeFilter, number> = {
    '7d': 0.25,
    '30d': 1.0,
    '3m': 2.8,
    '6m': 5.5,
    '1y': 10.2
  };

  const currentMult = filterMultiplier[timeFilter] || 1.0;
  const scaledHours = Math.round(18450 * currentMult);
  const scaledAssessments = Math.round(36900 * currentMult);
  const scaledRevenue = Math.round(28450 * currentMult);

  const timeFilterLabels: { id: PlatformTimeFilter; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Header with Time Filters */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <BarChart3 size={13} /> Platform Intelligence
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">• Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display mt-2">
            Analytics & Performance Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Systemic metrics across all learners, faculty mentors, courses, and quiz assessments.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start md:self-center">
          {timeFilterLabels.map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeFilter(tf.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeFilter === tf.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Total Learning Hours</span>
            <Clock size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{scaledHours.toLocaleString()} hrs</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ 24% vs previous period</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Active Enrollments</span>
            <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{courses.length * 142}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ 18% course uptake</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Assessments Completed</span>
            <Users size={16} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{scaledAssessments.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">88.4% average pass rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Marketplace Volume</span>
            <DollarSign size={16} className="text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">${scaledRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Course revenues</span>
        </div>
      </div>
    </div>
  );
};
