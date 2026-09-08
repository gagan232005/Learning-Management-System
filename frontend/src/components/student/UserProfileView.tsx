import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  BookOpen,
  Award,
  CheckSquare,
  ShieldCheck,
  Settings,
  Lock,
  MessageSquare,
  LogOut,
  UserCheck,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    courses,
    assessmentHistory,
    reelsWatchedCount,
    isUserEligibleForMentor,
    mentorApplications,
    submitMentorApplication,
    resubmitMentorApplication,
    submitPlatformFeedback,
    adminSettings,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'courses' | 'eligibility' | 'settings' | 'privacy' | 'feedback'>('profile');

  // Mentor Application Form State
  const [appExpertise, setAppExpertise] = useState('Full Stack Software Engineering & Java');
  const [appSkills, setAppSkills] = useState('Java, Spring Boot, React, TypeScript, System Design');
  const [appExperience, setAppExperience] = useState('4');
  const [appBio, setAppBio] = useState('Passionate educator dedicated to creating intuitive, industry-grade learning reels and masterclass courses.');
  const [appPortfolio, setAppPortfolio] = useState('https://github.com/learner-portfolio');

  // Platform Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Learning Experience');
  const [feedbackComment, setFeedbackComment] = useState('');

  const enrolledCourses = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const reelsCompleted = currentUser.reelsWatchedTotal || reelsWatchedCount || 3;
  const userAssessments = assessmentHistory.filter(h => h.userId === currentUser.id);
  const assessmentsCompleted = userAssessments.length;
  const averageScore = userAssessments.length > 0
    ? Math.round(userAssessments.reduce((acc, curr) => acc + curr.scorePercentage, 0) / userAssessments.length)
    : 85;

  const eligibility = isUserEligibleForMentor(currentUser.id);
  const existingApp = mentorApplications.find(a => a.userId === currentUser.id);

  const handleSubmitApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appExpertise.trim() || !appSkills.trim() || !appBio.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const skillsArray = appSkills.split(',').map(s => s.trim()).filter(Boolean);

    if (existingApp && existingApp.status === 'changes_requested') {
      resubmitMentorApplication(existingApp.id, {
        expertise: appExpertise.trim(),
        skills: skillsArray,
        experienceYears: Number(appExperience) || 3,
        bio: appBio.trim(),
        portfolioUrl: appPortfolio.trim()
      });
    } else {
      submitMentorApplication({
        userId: currentUser.id,
        applicantName: currentUser.name,
        applicantEmail: currentUser.email,
        expertise: appExpertise.trim(),
        skills: skillsArray,
        experienceYears: Number(appExperience) || 3,
        bio: appBio.trim(),
        portfolioUrl: appPortfolio.trim(),
        assessmentsCompleted: assessmentsCompleted,
        averageScore: averageScore
      });
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      showToast('Please enter your feedback comment.', 'error');
      return;
    }
    submitPlatformFeedback({
      rating: feedbackRating,
      category: feedbackCategory,
      comment: feedbackComment
    });
    setFeedbackComment('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-xs shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{currentUser.name}</h1>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                currentUser.role === 'mentor'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}>
                {currentUser.role === 'mentor' ? 'Verified Mentor' : 'Learner'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentUser.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[85px]">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Courses</span>
            <strong className="text-blue-600 dark:text-blue-400 font-bold text-base">{enrolledCourses.length}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[85px]">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Badges</span>
            <strong className="text-amber-600 dark:text-amber-400 font-bold text-base">{currentUser.badges?.length || 0}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center min-w-[85px]">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Avg Score</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-base">{averageScore}%</strong>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Sidebar Menu */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User size={15} />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'progress' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp size={15} />
            <span>Learning Statistics</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen size={15} />
            <span>My Enrolled Courses</span>
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'eligibility' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck size={15} />
              <span>Mentor Eligibility</span>
            </div>
            {eligibility.isEligible && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings size={15} />
            <span>Account Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'privacy' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock size={15} />
            <span>Privacy Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'feedback' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare size={15} />
            <span>Platform Feedback</span>
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          {/* 1. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Personal Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser.name}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 dark:text-slate-400 block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={currentUser.email}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-500 dark:text-slate-400 block font-semibold mb-1">Bio / Headline</label>
                  <textarea
                    rows={3}
                    readOnly
                    value={currentUser.bio || 'Active lifelong learner and software engineering student.'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. PROGRESS TAB */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Learning Telemetry</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-1">
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase">Reels Watched</span>
                  <strong className="text-xl font-bold text-blue-900 dark:text-blue-100 block">{reelsCompleted}</strong>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase">Quizzes Passed</span>
                  <strong className="text-xl font-bold text-emerald-900 dark:text-emerald-100 block">{assessmentsCompleted}</strong>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-1">
                  <span className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase">Average Score</span>
                  <strong className="text-xl font-bold text-amber-900 dark:text-amber-100 block">{averageScore}%</strong>
                </div>
              </div>
            </div>
          )}

          {/* 3. COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Enrolled Courses</h2>
              {enrolledCourses.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">No enrolled courses yet.</p>
              ) : (
                enrolledCourses.map(c => (
                  <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={c.thumbnailUrl} alt={c.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{c.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.instructorName} • {c.level}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      Enrolled
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. ELIGIBILITY TAB */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Mentor Promotion Eligibility</h2>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Criteria Met</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${eligibility.isEligible ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'}`}>
                    {eligibility.isEligible ? 'Eligible' : 'In Progress'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Learners who have watched all 6 foundational reels and passed quizzes with an 80%+ average qualify to apply for faculty promotion.
                </p>
              </div>

              {eligibility.isEligible && !existingApp && (
                <form onSubmit={handleSubmitApp} className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Submit Mentor Application</h3>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Domain Expertise</label>
                    <input
                      type="text"
                      required
                      value={appExpertise}
                      onChange={e => setAppExpertise(e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Teaching Bio</label>
                    <textarea
                      rows={2}
                      required
                      value={appBio}
                      onChange={e => setAppBio(e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Submit Application for Admin Review
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 5. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Account Settings</h2>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Email Notifications</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Account Status</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">{currentUser.status || 'Active'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Privacy & Compliance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your learning analytics and assignment submissions are encrypted and strictly confidential. Only authorized course mentors and administrators have grading review access.
              </p>
            </div>
          )}

          {/* 7. FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Submit Platform Feedback</h2>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Rating</label>
                <select
                  value={feedbackRating}
                  onChange={e => setFeedbackRating(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Outstanding</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Good</option>
                  <option value={3}>⭐⭐⭐ 3 - Average</option>
                  <option value={2}>⭐⭐ 2 - Needs Improvement</option>
                  <option value={1}>⭐ 1 - Poor</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Comments</label>
                <textarea
                  rows={3}
                  required
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  placeholder="Share your thoughts about course quality, quizzes, or reels..."
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Send Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
