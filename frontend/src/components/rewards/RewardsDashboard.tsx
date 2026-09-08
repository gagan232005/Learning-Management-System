import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  BookOpen,
  Calendar
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';

interface RewardsDashboardProps {
  onNavigateToCourses: () => void;
}

export const RewardsDashboard: React.FC<RewardsDashboardProps> = ({ onNavigateToCourses }) => {
  const { currentUser, badges, badgeDefinitions, courses, completedCourseReels, assessmentHistory } = useApp();
  const [activeTab, setActiveTab] = useState<'badges' | 'certificates'>('badges');
  const [selectedCertTitle, setSelectedCertTitle] = useState<string | null>(null);

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Active course certificate status
  const mainCourse = courses[0];
  const isCourseCompleted = mainCourse && (completedCourseReels[mainCourse.id]?.length || 0) >= 5;
  const isCertificateEarned = isCourseCompleted || currentUser.completedCourseIds?.includes(mainCourse?.id || '');

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                Achievements & Credentials
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                Verified Credentials
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md">
              Earn verified certificates and milestone badges by mastering courses, submitting assignments, and passing technical assessments.
            </p>
          </div>
        </div>

        {/* Quick Summary Counts */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[95px]">
            <span className="text-base font-bold text-blue-600 dark:text-blue-400 block">{badges.length} / {badgeDefinitions.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Badges</span>
          </div>
          <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[95px]">
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 block">{isCertificateEarned ? '1' : '0'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Certificates</span>
          </div>
        </div>
      </div>

      {/* Rewards Sub-Navigation: Badges & Certificates ONLY */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Award size={16} />
          <span>Badges ({badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Certificates ({isCertificateEarned ? '1' : '0'})</span>
        </button>
      </div>

      {/* TAB 1: BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeDefinitions.map(def => {
              const userBadge = badges.find(b => b.title === def.title || b.id === def.id);
              const isEarned = !!userBadge;

              return (
                <div
                  key={def.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isEarned
                      ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 shadow-xs'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
                        isEarned ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-slate-200 dark:bg-slate-700 grayscale'
                      }`}>
                        {def.icon || '🏆'}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isEarned
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {isEarned ? 'Earned' : 'Locked'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{def.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{def.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Milestone Credential</span>
                    {isEarned && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {isCertificateEarned && mainCourse ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">
                    Certificate ID: LMS-JAVA-2026-001
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display mt-0.5">
                    Certificate of Competence & Completion
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                  Verified & Signed
                </span>
              </div>

              {/* Certificate Preview Frame */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950/30 border-2 border-dashed border-blue-200 dark:border-blue-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold block">
                    LMS Platform Credential Authority
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display mt-1">
                    {mainCourse.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Awarded to <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> for completing all curriculum reels and passing evaluation.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>Issued: {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                  </span>
                  <span>•</span>
                  <span>Faculty Lead: {mainCourse.instructorName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedCertTitle(mainCourse.title)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Download size={14} />
                  <span>View / Print Certificate</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Lock size={24} />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Certificates Unlocked Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Complete all 5 masterclass course reels and pass the evaluation quiz to generate your official, verifiable certificate.
                </p>
              </div>
              <button
                onClick={onNavigateToCourses}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen size={14} />
                <span>Go to Courses Catalog</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertTitle && (
        <CertificateModal
          courseTitle={selectedCertTitle}
          onClose={() => setSelectedCertTitle(null)}
        />
      )}
    </div>
  );
};
