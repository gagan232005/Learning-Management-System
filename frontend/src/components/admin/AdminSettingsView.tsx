import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  Save,
  Zap,
  Lock
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { adminSettings, updateAdminSettings, showToast } = useApp();

  const [threshold, setThreshold] = useState(adminSettings.passingScoreThreshold || 80);
  const [reelsCount, setReelsCount] = useState(adminSettings.reelsPerAssessment || 6);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      passingScoreThreshold: Number(threshold),
      reelsPerAssessment: Number(reelsCount)
    });
    showToast('Platform settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 max-w-4xl">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1">
              <Sliders size={13} /> System Configuration
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">• Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display mt-2">
            Platform Rules & Governance Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Configure passing score thresholds, assessment parameters, and platform-wide rules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Assessment Scoring Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs transition-colors">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Zap size={18} className="text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Assessment Evaluation Parameters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Controls passing thresholds and assessment triggers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                Passing Score Threshold ({threshold}%)
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Minimum accuracy required to earn certification and milestone badges.
              </span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                Foundational Reels Count ({reelsCount})
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={reelsCount}
                onChange={e => setReelsCount(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Number of foundational reels required to unlock the assessment.
              </span>
            </div>
          </div>
        </div>

        {/* Security & Access Guardrails Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs transition-colors">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Lock size={18} className="text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Security & RBAC Enforcement</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Production authentication and access controls</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Admin Route Security:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                JWT + Bcrypt Protected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Public Admin UI:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                Hidden from public login
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Database Engine:</span>
              <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">MongoDB Atlas + Mongoose</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Save size={14} />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
