import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlaySquare,
  BookOpen,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Award,
  FileCheck2,
  Lock,
  Unlock,
  CheckSquare,
  Sparkles,
  Zap,
  Bot,
  Trophy
} from 'lucide-react';
import { AiTutorDrawer } from '../ai/AiTutorDrawer';
import { LeaderboardModal } from '../rewards/LeaderboardModal';
import { CertificateModal } from '../rewards/CertificateModal';

interface StudentDashboardProps {
  onNavigateToReels: () => void;
  onNavigateToCourses: () => void;
  onNavigateToRewards: () => void;
  onNavigateToAssessments?: () => void;
  onNavigateToProfile?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateToReels,
  onNavigateToCourses,
  onNavigateToRewards,
  onNavigateToAssessments,
  onNavigateToProfile,
}) => {
  const {
    currentUser,
    courses,
    openAssessment,
    watchedLearnReelIds,
    isAssessmentUnlocked,
    assessmentHistory,
    completedCourseReels,
    badges,
    assignments
  } = useApp();

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const completedLearnCount = watchedLearnReelIds.length;
  const currentCourse = courses[0];
  const courseCompletedReels = currentCourse ? (completedCourseReels[currentCourse.id] || []) : [];
  const courseProgressPercent = Math.round((courseCompletedReels.length / 5) * 100);
  const isCourseFinished = courseCompletedReels.length >= 5;

  const currentAssignment = assignments[0];
  const isAssignmentUnlocked = isCourseFinished;

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. WELCOME HEADER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div
            onClick={onNavigateToProfile}
            className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
            title="View Profile"
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">Learner Hub</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Active Student
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg">
              Here is your active learning progress, next milestones, and upcoming technical assessments.
            </p>
          </div>
        </div>

        {/* High-Level Milestone Counts */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
          <div className="p-3 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white block">{completedLearnCount}/5</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Reels</span>
          </div>
          <div className="p-3 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 block">{courseProgressPercent}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Course</span>
          </div>
          <div className="p-3 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 block">{badges.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Badges</span>
          </div>
        </div>
      </div>

      {/* 2. QUICK INTERACTIVE LEARNING WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* AI Tutor Button */}
        <button
          onClick={() => setIsAiOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-slate-900 border border-blue-500/30 text-white text-left hover:border-blue-400 transition-all shadow-md group cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
              <Bot size={22} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-display">LMS AI Companion</h4>
              <p className="text-[10px] text-blue-200/70 mt-0.5">Ask questions, explain code & practice quizzes</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={() => setIsLeaderboardOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950/80 to-slate-900 border border-amber-500/30 text-white text-left hover:border-amber-400 transition-all shadow-md group cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
              <Trophy size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-display">Leaderboard & XP Ranks</h4>
              <p className="text-[10px] text-amber-200/70 mt-0.5">View Weekly Ranks & Level Status</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-amber-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. "WHAT SHOULD I DO NEXT?" HERO ACTION CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={12} className="text-amber-300" />
            <span>Recommended Next Action</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black font-display">
            {!isAssessmentUnlocked
              ? `Watch Educational Reel ${completedLearnCount + 1} of 5`
              : !isCourseFinished
              ? `Continue ${currentCourse?.title || 'Course'}`
              : `Submit Your Capstone Assignment & Claim Certificate`}
          </h2>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            {!isAssessmentUnlocked
              ? `You have completed ${completedLearnCount} out of 5 short-video reels. Complete the remaining ${5 - completedLearnCount} reels to unlock your assessment.`
              : !isCourseFinished
              ? `Your assessment is unlocked! Continue your enrolled masterclass course to finish all 5 reels and unlock the final assignment.`
              : `You have completed all course reels! Submit your benchmark capstone assignment to qualify for verified certificate generation.`}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {!isAssessmentUnlocked ? (
            <button
              onClick={onNavigateToReels}
              className="px-5 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <PlaySquare size={16} className="text-blue-600" />
              <span>Continue Learning (Reels)</span>
              <ArrowRight size={14} />
            </button>
          ) : isAssessmentUnlocked && assessmentHistory.length === 0 ? (
            <button
              onClick={openAssessment}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Zap size={16} />
              <span>Start Assessment</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={onNavigateToCourses}
              className="px-5 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <BookOpen size={16} className="text-blue-600" />
              <span>Continue Course</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 4. CORE TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE COURSE & ASSIGNMENT (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Current Enrolled Course */}
          {currentCourse && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Current Enrolled Masterclass</h2>
                </div>
                <button
                  onClick={onNavigateToCourses}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Course Details</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={currentCourse.thumbnailUrl}
                    alt={currentCourse.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                      {currentCourse.category} • 5 Vertical Reels
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">{currentCourse.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Instructor: {currentCourse.instructorName}</p>
                  </div>
                </div>

                <div className="sm:text-right space-y-1.5 shrink-0">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {courseCompletedReels.length} / 5 Reels ({courseProgressPercent}%)
                  </div>
                  <button
                    onClick={onNavigateToCourses}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                  >
                    Continue Course
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Reel Progress</span>
                  <span>{courseCompletedReels.length} of 5 Completed</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                    style={{ width: `${courseProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upcoming / Connected Course Assignment */}
          {currentAssignment && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={18} className="text-teal-600 dark:text-teal-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Connected Course Assignment</h2>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isAssignmentUnlocked
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {isAssignmentUnlocked ? <Unlock size={11} /> : <Lock size={11} />}
                  <span>{isAssignmentUnlocked ? 'Unlocked' : 'Locked'}</span>
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {currentAssignment.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {currentAssignment.instructions}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAssignmentUnlocked
                    ? 'All 5 course reels watched. Ready for submission.'
                    : 'Complete all 5 course reels to unlock assignment submission.'}
                </span>

                <button
                  onClick={onNavigateToCourses}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isAssignmentUnlocked
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isAssignmentUnlocked ? 'Start Assignment' : 'View Assignment'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ASSESSMENT STATUS, BADGES & CERTIFICATES (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assessment Status Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Assessment Status</h2>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAssessmentUnlocked ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {isAssessmentUnlocked ? 'READY' : 'LOCKED'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAssessmentUnlocked
                ? 'Automated assessment is unlocked! Test your knowledge across the 5 vertical reels.'
                : `Watch all 5 Learn reels to unlock the automated assessment. Currently: ${completedLearnCount}/5.`}
            </p>

            <div className="pt-2">
              {isAssessmentUnlocked ? (
                <button
                  onClick={openAssessment}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Zap size={14} />
                  <span>Start Assessment</span>
                </button>
              ) : (
                <button
                  onClick={onNavigateToReels}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <PlaySquare size={14} />
                  <span>Watch Learn Reels ({completedLearnCount}/5)</span>
                </button>
              )}
            </div>
          </div>

          {/* Badges & Certificates Summary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Achievements</h2>
              </div>
              <button
                onClick={onNavigateToRewards}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={onNavigateToRewards}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <Award size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{badges.length}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Badges</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Milestone achievements</p>
              </div>

              <div
                onClick={() => setIsCertificateOpen(true)}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{isCourseFinished ? 1 : 0}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display">Certificates</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Verified credentials</p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onNavigateToRewards}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Badge Gallery & Certificates</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Modals & Drawers */}
      <AiTutorDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        contextTopic={currentCourse?.title || 'Java Core & Virtual Threads'}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        courseTitle={currentCourse?.title}
      />
    </div>
  );
};
