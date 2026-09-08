import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MentorApplication } from '../../types';
import {
  ShieldCheck,
  Search,
  Eye,
  Power,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  DollarSign,
  Download,
  X,
  Plus,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Clock,
  Send,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface MentorsManagementProps {
  onViewMentor: (userId: string) => void;
  onNavigateToCourses?: () => void;
  onNavigateToApproval?: () => void;
}

export const MentorsManagement: React.FC<MentorsManagementProps> = ({
  onViewMentor,
  onNavigateToCourses,
  onNavigateToApproval
}) => {
  const {
    users,
    courses,
    toggleUserStatus,
    mentorApplications,
    approveMentorApplication,
    rejectMentorApplication,
    requestChangesMentorApplication,
    showToast
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'roster' | 'applications'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [appStatusFilter, setAppStatusFilter] = useState<'all' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected'>('all');

  // Selected Application for Review
  const [selectedApp, setSelectedApp] = useState<MentorApplication | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'request_changes' | 'reject' | null>(null);

  // Filter only mentors
  const mentors = useMemo(() => {
    return users.filter(
      u => u.role === 'mentor' || u.role === 'seller' || u.role === 'ROLE_MENTOR'
    );
  }, [users]);

  // Filtered mentors
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mentor.specialty && mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mentor.bio && mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || mentor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [mentors, searchQuery, statusFilter]);

  // Filtered Mentor Applications
  const filteredApplications = useMemo(() => {
    return mentorApplications.filter(app => {
      const matchesSearch =
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.expertise.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        appStatusFilter === 'all' || app.status === appStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [mentorApplications, searchQuery, appStatusFilter]);

  const handleApprove = (appId: string) => {
    approveMentorApplication(appId);
    showToast('Mentor application approved! Account promoted to verified mentor.', 'success');
  };

  const handleReject = (appId: string) => {
    if (!reviewFeedback.trim()) {
      showToast('Please provide a reason for rejecting this application.', 'error');
      return;
    }
    rejectMentorApplication(appId, reviewFeedback.trim());
    setSelectedApp(null);
    setReviewAction(null);
    showToast('Mentor application rejected.', 'info');
  };

  const handleRequestChanges = (appId: string) => {
    if (!reviewFeedback.trim()) {
      showToast('Please provide feedback notes for the applicant.', 'error');
      return;
    }
    requestChangesMentorApplication(appId, reviewFeedback.trim());
    setSelectedApp(null);
    setReviewAction(null);
    showToast('Changes requested from mentor applicant.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Faculty Governance</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
              Admin Protected
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">Mentor Faculty Administration</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Review mentor applications, promote eligible students to faculty, and oversee instructor course authorship.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold self-start md:self-auto">
          <button
            onClick={() => setActiveMainTab('roster')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeMainTab === 'roster' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Verified Faculty ({mentors.length})
          </button>
          <button
            onClick={() => setActiveMainTab('applications')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeMainTab === 'applications' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Applications ({mentorApplications.length})
          </button>
        </div>
      </div>

      {/* Roster View */}
      {activeMainTab === 'roster' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMentors.map(mentor => {
              const mentorCourses = courses.filter(c => c.instructorId === mentor.id);
              const totalStudentsTaught = mentorCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

              return (
                <div
                  key={mentor.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                      {mentor.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <strong className="text-sm font-bold text-slate-900 dark:text-white block">{mentor.name}</strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{mentor.email}</span>
                      <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-semibold">{mentor.specialty || 'Software Architecture'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Courses</span>
                      <strong className="font-bold text-slate-800 dark:text-slate-200">{mentorCourses.length}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Students</span>
                      <strong className="font-bold text-blue-600 dark:text-blue-400">{totalStudentsTaught}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => toggleUserStatus(mentor.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        mentor.status === 'active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {mentor.status === 'active' ? 'Active' : 'Suspended'}
                    </button>

                    <button
                      onClick={() => onViewMentor(mentor.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Faculty</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Applications View */}
      {activeMainTab === 'applications' && (
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
              No mentor applications found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map(app => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
                        {app.status}
                      </span>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white">{app.applicantName}</strong>
                      <span className="text-xs text-slate-400">({app.applicantEmail})</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Expertise: {app.expertise} • {app.experienceYears || 3} years exp • Score: {app.averageScore || 85}%
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === 'submitted' || app.status === 'under_review' ? (
                      <>
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Approve Mentor
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewAction('request_changes');
                            setReviewFeedback('Please supply your public GitHub repository portfolio.');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 cursor-pointer"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewAction('reject');
                            setReviewFeedback('Does not meet current curriculum prerequisites.');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800 cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Status: {app.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Feedback Modal */}
      {selectedApp && reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {reviewAction === 'request_changes' ? 'Request Changes from Applicant' : 'Reject Mentor Application'}
              </h3>
              <button
                onClick={() => { setSelectedApp(null); setReviewAction(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400">
              <p>Applicant: <strong className="text-slate-900 dark:text-white">{selectedApp.applicantName}</strong> ({selectedApp.applicantEmail})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {reviewAction === 'request_changes' ? 'Feedback / Required Improvements *' : 'Rejection Reason *'}
              </label>
              <textarea
                required
                rows={4}
                value={reviewFeedback}
                onChange={e => setReviewFeedback(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => { setSelectedApp(null); setReviewAction(null); }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              {reviewAction === 'request_changes' ? (
                <button
                  onClick={() => handleRequestChanges(selectedApp.id)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Send Changes Request
                </button>
              ) : (
                <button
                  onClick={() => handleReject(selectedApp.id)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm Rejection
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
