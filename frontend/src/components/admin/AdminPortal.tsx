import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { LearnersManagement } from './LearnersManagement';
import { MentorsManagement } from './MentorsManagement';
import { ContentManagement } from './ContentManagement';
import { ContentApproval } from './ContentApproval';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminRewardsBadges } from './AdminRewardsBadges';
import { AdminSettingsView } from './AdminSettingsView';
import { CreateContentModal } from './CreateContentModal';
import { LearnerInspectorModal } from './LearnerInspectorModal';
import { MentorInspectorModal } from './MentorInspectorModal';
import { NotificationCenter } from '../layout/NotificationCenter';
import {
  ShieldCheck,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  HelpCircle,
  FileCheck2,
  BarChart3,
  Award,
  Sliders,
  Plus,
  Eye,
  LogOut,
  Menu,
  X,
  Bell,
  Film
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    users,
    courses,
    approvalQueue,
    notifications,
    setViewAsLearner,
    logoutUser
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('lms_admin_active_tab') || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('lms_admin_active_tab', activeTab);
  }, [activeTab]);

  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Modals state
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const [defaultContentType, setDefaultContentType] = useState<'course' | 'quiz' | 'assignment'>('course');
  const [inspectedLearnerId, setInspectedLearnerId] = useState<string | null>(null);
  const [inspectedMentorId, setInspectedMentorId] = useState<string | null>(null);

  const inspectedLearner = users.find(u => u.id === inspectedLearnerId) || null;
  const inspectedMentor = users.find(u => u.id === inspectedMentorId) || null;

  const pendingApprovalsCount = approvalQueue.filter(a => a.status === 'submitted' || a.status === 'under_review').length;

  const handleOpenCreateWithType = (type: 'course' | 'quiz' | 'assignment' = 'course') => {
    setDefaultContentType(type);
    setIsCreateContentOpen(true);
  };

  // Breadcrumbs text helper
  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'learners':
        return 'Users / Learners Directory';
      case 'mentors':
        return 'Users / Mentor Faculty';
      case 'content-courses':
        return 'Content / Courses';
      case 'content-reels':
        return 'Content / Educational Reels';
      case 'content-quizzes':
        return 'Content / Quizzes';
      case 'content-assignments':
        return 'Content / Assignments';
      case 'approval':
        return 'Quality Assurance & Approval Queue';
      case 'analytics':
        return 'Platform Analytics & Telemetry';
      case 'rewards':
        return 'Badges & Credentials';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminOverview
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'course')}
            onViewLearner={id => setInspectedLearnerId(id)}
            onViewMentor={id => setInspectedMentorId(id)}
          />
        );
      case 'learners':
        return (
          <LearnersManagement
            onViewLearner={id => setInspectedLearnerId(id)}
            onViewMentor={id => setInspectedMentorId(id)}
          />
        );
      case 'mentors':
        return (
          <MentorsManagement
            onViewMentor={id => setInspectedMentorId(id)}
            onNavigateToCourses={() => setActiveTab('content-courses')}
            onNavigateToApproval={() => setActiveTab('approval')}
          />
        );
      case 'content-courses':
        return (
          <ContentManagement
            initialSubTab="courses"
            onSubTabChange={subTab => setActiveTab(`content-${subTab}`)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'course')}
          />
        );
      case 'content-reels':
        return (
          <ContentManagement
            initialSubTab="reels"
            onSubTabChange={subTab => setActiveTab(`content-${subTab}`)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'course')}
          />
        );
      case 'content-quizzes':
        return (
          <ContentManagement
            initialSubTab="quizzes"
            onSubTabChange={subTab => setActiveTab(`content-${subTab}`)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'quiz')}
          />
        );
      case 'content-assignments':
        return (
          <ContentManagement
            initialSubTab="assignments"
            onSubTabChange={subTab => setActiveTab(`content-${subTab}`)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'assignment')}
          />
        );
      case 'approval':
        return <ContentApproval />;
      case 'analytics':
        return <AdminAnalyticsView />;
      case 'rewards':
        return <AdminRewardsBadges />;
      case 'settings':
        return <AdminSettingsView />;
      default:
        return (
          <AdminOverview
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'course')}
            onViewLearner={id => setInspectedLearnerId(id)}
            onViewMentor={id => setInspectedMentorId(id)}
          />
        );
    }
  };

  const navItemClass = (id: string) => {
    const isActive = activeTab === id;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
      isActive
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;
  };

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarMobileOpen && (
        <div
          onClick={() => setIsSidebarMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ADMIN SIDEBAR NAVIGATION */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] h-screen lg:h-[calc(100vh-65px)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:z-10 flex flex-col justify-between p-4 overflow-y-auto custom-scrollbar transition-all duration-300 ${
          isSidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Top Brand & Portal Title */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
                LMS
              </div>
              <div>
                <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-900 dark:text-white font-display">
                  Admin Console
                </h2>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Governance</span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tree */}
          <nav className="space-y-4 text-xs">
            {/* 1. Dashboard */}
            <div>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </div>
              </button>
            </div>

            {/* 2. USERS (Learners & Mentors) */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3.5 block">
                Users
              </span>
              <button
                onClick={() => {
                  setActiveTab('learners');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('learners')}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Learners</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('mentors');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('mentors')}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Mentors</span>
                </div>
              </button>
            </div>

            {/* 3. CONTENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3.5 block">
                Content
              </span>
              <button
                onClick={() => {
                  setActiveTab('content-courses');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('content-courses')}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Courses</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('content-reels');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('content-reels')}
              >
                <div className="flex items-center gap-2.5">
                  <Film size={16} className="text-red-500" />
                  <span>Educational Reels</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('content-quizzes');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('content-quizzes')}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle size={16} className="text-cyan-600 dark:text-cyan-400" />
                  <span>Quizzes</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('content-assignments');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('content-assignments')}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 size={16} className="text-teal-600 dark:text-teal-400" />
                  <span>Assignments</span>
                </div>
              </button>
            </div>

            {/* 4. OPERATIONS */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3.5 block">
                Operations
              </span>
              <button
                onClick={() => {
                  setActiveTab('approval');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('approval')}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 size={16} className="text-amber-600 dark:text-amber-400" />
                  <span>Approvals</span>
                </div>
                {pendingApprovalsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold text-[10px]">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            </div>

            {/* 5. INSIGHTS */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3.5 block">
                Insights
              </span>
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('analytics')}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Analytics</span>
                </div>
              </button>
            </div>

            {/* 6. ENGAGEMENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3.5 block">
                Engagement
              </span>
              <button
                onClick={() => {
                  setActiveTab('rewards');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('rewards')}
              >
                <div className="flex items-center gap-2.5">
                  <Award size={16} className="text-amber-600 dark:text-amber-400" />
                  <span>Badges & Credentials</span>
                </div>
              </button>
            </div>

            {/* 7. SYSTEM */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3.5 block">
                System
              </span>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsSidebarMobileOpen(false);
                }}
                className={navItemClass('settings')}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders size={16} className="text-slate-600 dark:text-slate-400" />
                  <span>Settings</span>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* View As Learner Action Button */}
          <button
            onClick={() => setViewAsLearner(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <Eye size={14} />
            <span>View as Learner</span>
          </button>

          {/* Active Admin Profile Box */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">ROLE_ADMIN</span>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Sticky Header */}
        <header className="sticky top-[65px] z-20 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400 dark:text-slate-500">Admin Console</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <strong className="text-slate-900 dark:text-white font-bold">{getBreadcrumbTitle()}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-2xs group"
                title="Admin Notification Center"
              >
                <Bell size={17} className="group-hover:rotate-12 transition-transform" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              <NotificationCenter
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                onNavigateTab={(tab) => {
                  if (tab === 'approval' || tab === 'admin-approval') {
                    setActiveTab('approval');
                  } else if (tab === 'rewards' || tab === 'admin-rewards') {
                    setActiveTab('rewards');
                  } else if (tab === 'courses' || tab === 'admin-courses') {
                    setActiveTab('content-courses');
                  } else if (tab === 'mentor-students' || tab === 'mentors') {
                    setActiveTab('mentors');
                  } else {
                    setActiveTab('dashboard');
                  }
                }}
              />
            </div>

            <button
              onClick={() => handleOpenCreateWithType('course')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Create Content</span>
            </button>

            <button
              onClick={() => setViewAsLearner(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Eye size={13} />
              <span>View as Learner</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Create Content Modal */}
      {isCreateContentOpen && (
        <CreateContentModal
          onClose={() => setIsCreateContentOpen(false)}
          defaultContentType={defaultContentType}
        />
      )}

      {/* Learner Inspector Modal */}
      {inspectedLearnerId && (
        <LearnerInspectorModal
          learner={inspectedLearner}
          courses={courses}
          onClose={() => setInspectedLearnerId(null)}
        />
      )}

      {/* Mentor Inspector Modal */}
      {inspectedMentorId && (
        <MentorInspectorModal
          mentor={inspectedMentor}
          courses={courses}
          approvalQueue={approvalQueue}
          allUsers={users}
          onClose={() => setInspectedMentorId(null)}
        />
      )}
    </div>
  );
};
