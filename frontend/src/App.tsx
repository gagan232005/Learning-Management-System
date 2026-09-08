import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/layout/ToastContainer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { UserProfileView } from './components/student/UserProfileView';
import { ReelsFeed } from './components/reels/ReelsFeed';
import { CourseBrowse } from './components/courses/CourseBrowse';
import { AssessmentsView } from './components/assessment/AssessmentsView';
import { RewardsDashboard } from './components/rewards/RewardsDashboard';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import { MentorCoursesView } from './components/mentor/MentorCoursesView';
import { MentorCreateCourseView } from './components/mentor/MentorCreateCourseView';
import { MentorStudentsView } from './components/mentor/MentorStudentsView';
import { MentorNotificationsView } from './components/mentor/MentorNotificationsView';
import { MentorProfileView } from './components/mentor/MentorProfileView';
import { AdminPortal } from './components/admin/AdminPortal';
import { AssessmentModal } from './components/assessment/AssessmentModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingGate } from './components/auth/LandingGate';

const MainContent: React.FC = () => {
  const { currentUser, isViewAsLearner, isViewAsMentor, isAuthenticated, canAccessAdminPortal } = useApp();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile-sim' | 'tablet-sim'>('desktop');

  // Sync default tab when user role changes and enforce RBAC
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // RBAC: Block non-mentors from mentor tabs
    const isMentorRole = currentUser.role === 'mentor' || currentUser.role === 'ROLE_MENTOR';
    if (activeTab.startsWith('mentor-') && !isMentorRole && !canAccessAdminPortal()) {
      setActiveTab('home');
      return;
    }

    if (canAccessAdminPortal() && isViewAsMentor) {
      setActiveTab('mentor-dashboard');
    } else if (isMentorRole) {
      if (!activeTab.startsWith('mentor-') && activeTab !== 'profile') {
        setActiveTab('mentor-dashboard');
      }
    } else if (canAccessAdminPortal() && !isViewAsLearner) {
      setActiveTab('admin-dashboard');
    } else {
      if (activeTab.startsWith('mentor-') || activeTab === 'admin-dashboard') {
        setActiveTab('home');
      }
    }
  }, [currentUser.role, isViewAsLearner, isViewAsMentor, isAuthenticated, activeTab]);

  // Require login/signup before any dashboard is reachable
  if (!isAuthenticated) {
    return (
      <>
        <LandingGate />
        <AuthModal />
        <ToastContainer />
      </>
    );
  }

  // If Admin is logged in and not explicitly viewing as learner/mentor, render Admin Portal
  if (canAccessAdminPortal() && !isViewAsLearner && !isViewAsMentor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
        <AdminPortal />
        <AssessmentModal />
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  // Learner & Mentor View Router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return (
          <StudentDashboard
            onNavigateToReels={() => setActiveTab('learn')}
            onNavigateToCourses={() => setActiveTab('courses')}
            onNavigateToRewards={() => setActiveTab('rewards')}
            onNavigateToAssessments={() => setActiveTab('assessments')}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        );
      case 'learn':
      case 'reels':
        return <ReelsFeed viewMode={viewMode} />;
      case 'courses':
        return <CourseBrowse />;
      case 'assessments':
        return <AssessmentsView setActiveTab={setActiveTab} />;
      case 'rewards':
        return <RewardsDashboard onNavigateToCourses={() => setActiveTab('courses')} />;
      case 'profile':
        return <UserProfileView />;
      case 'mentor-dashboard':
        return (
          <MentorDashboard
            onNavigateToCourses={() => setActiveTab('mentor-courses')}
            onNavigateToCreateCourse={() => setActiveTab('mentor-create-course')}
            onNavigateToStudents={() => setActiveTab('mentor-students')}
            onNavigateToNotifications={() => setActiveTab('mentor-notifications')}
            onNavigateToProfile={() => setActiveTab('mentor-profile')}
          />
        );
      case 'mentor-courses':
        return (
          <MentorCoursesView
            onNavigateToCreateCourse={() => setActiveTab('mentor-create-course')}
          />
        );
      case 'mentor-create-course':
        return (
          <MentorCreateCourseView
            onCourseCreated={() => setActiveTab('mentor-courses')}
          />
        );
      case 'mentor-students':
        return <MentorStudentsView />;
      case 'mentor-notifications':
        return (
          <MentorNotificationsView
            onNavigateToCourses={() => setActiveTab('mentor-courses')}
            onNavigateToStudents={() => setActiveTab('mentor-students')}
          />
        );
      case 'mentor-profile':
        return <MentorProfileView />;
      default:
        return (
          <StudentDashboard
            onNavigateToReels={() => setActiveTab('learn')}
            onNavigateToCourses={() => setActiveTab('courses')}
            onNavigateToRewards={() => setActiveTab('rewards')}
            onNavigateToAssessments={() => setActiveTab('assessments')}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Top Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-150">
        {renderActiveView()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Automated Assessment Modal */}
      <AssessmentModal />

      {/* Multi-Role Authentication Modal */}
      <AuthModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

