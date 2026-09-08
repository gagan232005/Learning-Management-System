import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationCenter } from './NotificationCenter';
import { NotificationBannerBar } from './NotificationBannerBar';
import {
  Bell,
  CheckCircle,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  PlaySquare,
  BookOpen,
  BarChart2,
  Eye,
  ArrowLeft,
  Users,
  MessageSquare,
  PlusCircle,
  CheckSquare,
  Lock,
  Award,
  Zap,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'desktop' | 'mobile-sim' | 'tablet-sim';
  setViewMode: (mode: 'desktop' | 'mobile-sim' | 'tablet-sim') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, viewMode, setViewMode }) => {
  const {
    currentUser,
    logoutUser,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    watchedLearnReelIds,
    isAssessmentUnlocked,
    adminSettings,
    openAssessment,
    isViewAsLearner,
    setViewAsLearner,
    isViewAsMentor,
    setViewAsMentor,
    canAccessAdminPortal
  } = useApp();

  const { theme, toggleTheme } = useTheme();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentRole = currentUser.role.toLowerCase().replace('role_', '');
  const isLearner = currentRole === 'student' || currentRole === 'learner';
  const isMentor = currentRole === 'mentor';
  const isAdmin = currentRole === 'admin';

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const learnReelCount = watchedLearnReelIds.length;

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
      isActive
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-150">
      {/* Top Notification Announcement Bar */}
      <NotificationBannerBar onOpenCenter={() => setIsNotifOpen(true)} onNavigateTab={setActiveTab} />

      {/* "View as Learner" Alert Banner for Admin */}
      {isViewAsLearner && canAccessAdminPortal() && (
        <div className="w-full bg-blue-50 dark:bg-blue-950/50 px-4 py-2 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>
              <strong className="font-bold">Viewing as Learner Mode</strong> — Previewing User interface.
            </span>
          </div>
          <button
            onClick={() => setViewAsLearner(false)}
            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Return to Admin Portal</span>
          </button>
        </div>
      )}

      {/* "View as Mentor" Alert Banner for Admin */}
      {isViewAsMentor && canAccessAdminPortal() && (
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/50 px-4 py-2 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 border-b border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2">
            <UserCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong className="font-bold">Viewing as Mentor Mode</strong> — Previewing Instructor interface.
            </span>
          </div>
          <button
            onClick={() => setViewAsMentor(false)}
            className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Return to Admin Portal</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        {/* Left Section: Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              if (isAdmin && !isViewAsLearner && !isViewAsMentor) {
                setActiveTab('admin-dashboard');
              } else if (isMentor) {
                setActiveTab('mentor-dashboard');
              } else {
                setActiveTab('home');
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <span className="text-white font-black text-base font-display">L</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-slate-900 dark:text-white font-display">LMS</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {isAdmin ? 'ADMIN' : isMentor ? 'MENTOR' : 'LEARNER'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Navigation Links by Role */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* 1. LEARNER ROLE NAV */}
          {(isLearner || isViewAsLearner) && (
            <>
              <button onClick={() => setActiveTab('home')} className={getTabClass('home')}>
                <LayoutDashboard size={14} />
                <span>Home</span>
              </button>
              <button onClick={() => setActiveTab('learn')} className={getTabClass('learn')}>
                <PlaySquare size={14} />
                <span>Reels</span>
              </button>
              <button onClick={() => setActiveTab('courses')} className={getTabClass('courses')}>
                <BookOpen size={14} />
                <span>Courses</span>
              </button>
              <button onClick={() => setActiveTab('assessments')} className={getTabClass('assessments')}>
                <CheckSquare size={14} />
                <span>Quizzes</span>
              </button>
              <button onClick={() => setActiveTab('rewards')} className={getTabClass('rewards')}>
                <Award size={14} />
                <span>Achievements</span>
              </button>
            </>
          )}

          {/* 2. MENTOR ROLE NAV */}
          {(isMentor || isViewAsMentor) && !isViewAsLearner && (
            <>
              <button onClick={() => setActiveTab('mentor-dashboard')} className={getTabClass('mentor-dashboard')}>
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </button>
              <button onClick={() => setActiveTab('mentor-courses')} className={getTabClass('mentor-courses')}>
                <BookOpen size={14} />
                <span>My Courses</span>
              </button>
              <button onClick={() => setActiveTab('mentor-create-course')} className={getTabClass('mentor-create-course')}>
                <PlusCircle size={14} />
                <span>Create Course</span>
              </button>
              <button onClick={() => setActiveTab('mentor-students')} className={getTabClass('mentor-students')}>
                <Users size={14} />
                <span>Learners</span>
              </button>
              <button onClick={() => setActiveTab('mentor-notifications')} className={getTabClass('mentor-notifications')}>
                <Bell size={14} />
                <span>Notifications</span>
              </button>
            </>
          )}

          {/* 3. ADMIN ROLE NAV */}
          {isAdmin && !isViewAsLearner && !isViewAsMentor && (
            <>
              <button onClick={() => setActiveTab('admin-dashboard')} className={getTabClass('admin-dashboard')}>
                <LayoutDashboard size={14} />
                <span>Console</span>
              </button>
              <button onClick={() => setActiveTab('admin-users')} className={getTabClass('admin-users')}>
                <Users size={14} />
                <span>Learners</span>
              </button>
              <button onClick={() => setActiveTab('admin-mentors')} className={getTabClass('admin-mentors')}>
                <UserCheck size={14} />
                <span>Mentors</span>
              </button>
              <button onClick={() => setActiveTab('admin-courses')} className={getTabClass('admin-courses')}>
                <BookOpen size={14} />
                <span>Courses</span>
              </button>
              <button onClick={() => setActiveTab('admin-approvals')} className={getTabClass('admin-approvals')}>
                <CheckCircle size={14} />
                <span>Approvals</span>
              </button>
              <button onClick={() => setActiveTab('admin-analytics')} className={getTabClass('admin-analytics')}>
                <BarChart2 size={14} />
                <span>Analytics</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Section: Theme Toggle, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Global Light/Dark Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-2xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
          </button>

          {/* Notifications Trigger & Center Modal */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-2xs group"
              title="Open Notification Center"
            >
              <Bell size={16} className="group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationCenter
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onNavigateTab={setActiveTab}
            />
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {initials}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white hidden sm:inline">{currentUser.name}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl p-2 z-50 border border-slate-200 dark:border-slate-800 animate-in fade-in">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{currentUser.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {isAdmin ? 'Administrator' : isMentor ? 'Verified Mentor' : 'Learner'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setActiveTab(isMentor ? 'mentor-profile' : 'profile');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
