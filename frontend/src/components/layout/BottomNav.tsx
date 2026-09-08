import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlaySquare,
  BookOpen,
  Award,
  PlusCircle,
  Users,
  User,
  CheckSquare
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { watchedLearnReelIds, currentUser, isViewAsLearner } = useApp();

  const currentRole = (currentUser?.role || '').toLowerCase().replace('role_', '');

  // If Admin is in native Admin experience, bottom nav is not needed (sidebar/drawer handles admin navigation)
  if (currentRole === 'admin' && !isViewAsLearner) {
    return null;
  }

  const isMentor = currentRole === 'mentor' && !isViewAsLearner;

  if (isMentor) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors duration-150">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('mentor-dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={19} />
          <span className="text-[11px] font-medium leading-none">Dashboard</span>
        </button>

        {/* 2. Courses */}
        <button
          onClick={() => setActiveTab('mentor-courses')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-courses' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen size={19} />
          <span className="text-[11px] font-medium leading-none">Courses</span>
        </button>

        {/* 3. Create */}
        <button
          onClick={() => setActiveTab('mentor-create-course')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-create-course' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PlusCircle size={19} />
          <span className="text-[11px] font-medium leading-none">Create</span>
        </button>

        {/* 4. Students */}
        <button
          onClick={() => setActiveTab('mentor-students')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-students' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users size={19} />
          <span className="text-[11px] font-medium leading-none">Learners</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveTab('mentor-profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-profile' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <User size={19} />
          <span className="text-[11px] font-medium leading-none">Profile</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors duration-150">
      {/* 1. Home */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'home' || activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <LayoutDashboard size={19} />
        <span className="text-[11px] font-medium leading-none">Home</span>
      </button>

      {/* 2. Reels */}
      <button
        onClick={() => setActiveTab('learn')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'learn' || activeTab === 'reels' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <PlaySquare size={19} />
        <span className="text-[11px] font-medium leading-none">Reels</span>
      </button>

      {/* 3. Courses */}
      <button
        onClick={() => setActiveTab('courses')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'courses' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <BookOpen size={19} />
        <span className="text-[11px] font-medium leading-none">Courses</span>
      </button>

      {/* 4. Quizzes */}
      <button
        onClick={() => setActiveTab('assessments')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'assessments' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <CheckSquare size={19} />
        <span className="text-[11px] font-medium leading-none">Quizzes</span>
      </button>

      {/* 5. Achievements */}
      <button
        onClick={() => setActiveTab('rewards')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'rewards' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Award size={19} />
        <span className="text-[11px] font-medium leading-none">Achievements</span>
      </button>
    </nav>
  );
};
