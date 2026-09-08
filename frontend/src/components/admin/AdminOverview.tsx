import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  BookOpen,
  FileCheck2,
  HelpCircle,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenCreateContent: (type?: 'course' | 'quiz' | 'assignment') => void;
  onViewLearner: (userId: string) => void;
  onViewMentor: (userId: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigateTab,
  onOpenCreateContent,
  onViewLearner,
  onViewMentor,
}) => {
  const {
    approvalQueue,
    users,
    courses,
    quizzes,
    assignments,
    approveContent,
    requestChangesContent,
    showToast
  } = useApp();

  const learners = users.filter(u => u.role === 'student' || u.role === 'learner' || u.role === 'ROLE_LEARNER');
  const mentors = users.filter(u => u.role === 'mentor' || u.role === 'seller' || u.role === 'ROLE_MENTOR');

  const pendingApprovals = approvalQueue.filter(item => item.status === 'submitted' || item.status === 'under_review');
  const totalMarketplaceRevenue = courses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);

  const statCards = [
    {
      title: 'Total Users',
      value: users.length,
      subtitle: `${learners.length} Learners • ${mentors.length} Mentors`,
      icon: <Users size={18} className="text-blue-600 dark:text-blue-400" />,
      onClick: () => onNavigateTab('learners')
    },
    {
      title: 'Active Faculty',
      value: mentors.length,
      subtitle: '100% Verified Mentors',
      icon: <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />,
      onClick: () => onNavigateTab('mentors')
    },
    {
      title: 'Courses Catalog',
      value: courses.length,
      subtitle: `${courses.filter(c => c.status === 'published' || c.status === 'approved').length} Published`,
      icon: <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />,
      onClick: () => onNavigateTab('content-courses')
    },
    {
      title: 'Active Quizzes',
      value: quizzes.length,
      subtitle: 'Knowledge Checkpoints',
      icon: <HelpCircle size={18} className="text-cyan-600 dark:text-cyan-400" />,
      onClick: () => onNavigateTab('content-quizzes')
    },
    {
      title: 'Course Assignments',
      value: assignments.length,
      subtitle: 'Hands-on Projects',
      icon: <FileCheck2 size={18} className="text-teal-600 dark:text-teal-400" />,
      onClick: () => onNavigateTab('content-assignments')
    },
    {
      title: 'Gross Platform Sales',
      value: `$${totalMarketplaceRevenue.toLocaleString()}`,
      subtitle: 'Course Volume',
      icon: <DollarSign size={18} className="text-purple-600 dark:text-purple-400" />,
      onClick: () => onNavigateTab('analytics')
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <ShieldCheck size={13} /> Platform Executive Overview
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">• Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display mt-2">
            Enterprise LMS Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time platform metrics, faculty governance, curriculum quality assurance, and user operations.
          </p>
        </div>

        {/* Quick Create Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenCreateContent('course')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>New Course</span>
          </button>
          <button
            onClick={() => onOpenCreateContent('quiz')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>New Quiz</span>
          </button>
          <button
            onClick={() => onOpenCreateContent('assignment')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.onClick}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{card.title}</span>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                {card.icon}
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {card.value}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">
              {card.subtitle}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Navigation Hub */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Management Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab('learners')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 flex items-center gap-1">
                <span>Learner Management</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Directory, quiz accuracy, and telemetry</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('mentors')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1">
                <span>Mentor Dashboard</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Faculty directory, ratings, and authorship</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('content-courses')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 flex items-center gap-1">
                <span>Content & Curriculum</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Courses, module quizzes, and assignments</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('approval')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors relative">
              <FileCheck2 size={20} />
              {pendingApprovals.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingApprovals.length}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center gap-1">
                <span>Quality Assurance Gateway</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Review faculty submissions before publishing</p>
            </div>
          </div>
        </div>
      </div>

      {/* PENDING APPROVALS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Pending QA Review Submissions ({pendingApprovals.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curriculum items submitted by mentors requiring administrator sign-off.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('approval')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Queue</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Quality Assurance Queue is Clear</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All submitted courses, quizzes, and assignments have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingApprovals.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                      {item.contentType}
                    </span>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Author: {item.creatorName} • Submitted: {new Date(item.submissionDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      approveContent(item.id);
                      showToast(`Approved "${item.title}"!`, 'success');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 size={12} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      requestChangesContent(item.id, 'Please review the audio quality and reel topics.');
                      showToast(`Requested changes for "${item.title}".`, 'info');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Request Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
