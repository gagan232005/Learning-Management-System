import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseCreator } from './CourseCreator';
import {
  DollarSign,
  BookOpen,
  Users,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ArrowRight,
  Sparkles,
  Bell,
  User,
  GraduationCap
} from 'lucide-react';

interface MentorDashboardProps {
  onNavigateToCourses?: () => void;
  onNavigateToCreateCourse?: () => void;
  onNavigateToStudents?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToProfile?: () => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  onNavigateToCourses,
  onNavigateToCreateCourse,
  onNavigateToStudents,
  onNavigateToNotifications,
  onNavigateToProfile
}) => {
  const { currentUser, courses, enrolledStudents, approvalQueue, notifications, showToast } = useApp();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Filter courses created by current mentor
  const normalizedRole = (currentUser.role || '').toLowerCase().replace('role_', '');
  const isAdmin = normalizedRole === 'admin';

  const myCourses = courses.filter(
    c => c.instructorId === currentUser.id || c.instructorName === currentUser.name || isAdmin
  );

  const totalCourses = myCourses.length;
  const publishedCoursesCount = myCourses.filter(c => c.status === 'published' || c.status === 'approved').length;
  const pendingCoursesCount = myCourses.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const changesRequestedCount = myCourses.filter(c => c.status === 'changes_requested' || c.status === 'rejected').length;
  const totalStudentsCount = myCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalEarnings = myCourses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            Published
          </span>
        );
      case 'submitted':
      case 'under_review':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold uppercase tracking-wider">
            Under Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[10px] font-bold uppercase tracking-wider">
            Changes Needed
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-bold uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider">
            Draft
          </span>
        );
    }
  };

  const handleCreateCourseClick = () => {
    if (onNavigateToCreateCourse) {
      onNavigateToCreateCourse();
    } else {
      setIsCreatorOpen(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24 animate-in fade-in duration-200">
      {/* Mentor Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-xs shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Mentor Overview</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                Verified Instructor
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">{currentUser.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md">{currentUser.bio || 'Tech educator and course author.'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onNavigateToProfile && (
            <button
              onClick={onNavigateToProfile}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all shadow-xs cursor-pointer"
            >
              <User size={15} />
              <span>Edit Profile</span>
            </button>
          )}

          <button
            onClick={handleCreateCourseClick}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div
          onClick={onNavigateToCourses}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Courses</span>
            <BookOpen size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <strong className="text-2xl font-bold text-slate-900 dark:text-white font-mono block mt-1">{totalCourses}</strong>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
            Manage Catalog →
          </span>
        </div>

        <div
          onClick={onNavigateToCourses}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Published</span>
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <strong className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono block mt-1">{publishedCoursesCount}</strong>
          <span className="text-[10px] text-slate-400 mt-1 block">Live in store</span>
        </div>

        <div
          onClick={onNavigateToCourses}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Pending Review</span>
            <Clock size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
          <strong className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono block mt-1">{pendingCoursesCount}</strong>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting admin</span>
        </div>

        <div
          onClick={onNavigateToStudents}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Students</span>
            <Users size={14} className="text-blue-600 dark:text-blue-400" />
          </div>
          <strong className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono block mt-1">{totalStudentsCount}</strong>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1 flex items-center gap-0.5">
            View Roster →
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Total Earnings</span>
            <DollarSign size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <strong className="text-2xl font-bold text-slate-900 dark:text-white font-mono block mt-1">
            ${totalEarnings.toLocaleString()}
          </strong>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">Gross sales</span>
        </div>
      </div>

      {/* Quick Access Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Mentor Quick Navigation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={onNavigateToCourses}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1">
                <span>My Courses Catalog</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Browse, edit curriculum, and check review status</p>
            </div>
          </div>

          <div
            onClick={handleCreateCourseClick}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1">
                <span>Create New Course</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Build modules, set pricing, and publish reels</p>
            </div>
          </div>

          <div
            onClick={onNavigateToStudents}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 flex items-center gap-1">
                <span>Learners & Roster</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Track student progress and review assignments</p>
            </div>
          </div>

          <div
            onClick={onNavigateToNotifications}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors relative">
              <Bell size={20} />
              {unreadNotifsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 flex items-center gap-1">
                <span>Alerts & Updates</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {unreadNotifsCount > 0 ? `${unreadNotifsCount} unread alerts` : 'All notifications caught up'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Creator Modal */}
      {isCreatorOpen && (
        <CourseCreator
          onClose={() => {
            setIsCreatorOpen(false);
          }}
        />
      )}
    </div>
  );
};
