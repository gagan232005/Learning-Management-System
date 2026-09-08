import React, { useState } from 'react';
import { Assignment, Course } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  X,
  CheckCircle2,
  Clock,
  Award,
  Send,
  AlertCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';

interface CourseAssignmentModalProps {
  assignment: Assignment;
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseAssignmentModal: React.FC<CourseAssignmentModalProps> = ({
  assignment,
  course,
  isOpen,
  onClose
}) => {
  const { currentUser, submitAssignment, showToast } = useApp();

  const userSubmission = (assignment.submissions || []).find(s => s.userId === currentUser.id);

  const [solutionContent, setSolutionContent] = useState(
    userSubmission ? userSubmission.content : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionContent.trim()) {
      showToast('Please enter your assignment solution or repository link before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = submitAssignment(assignment.id, solutionContent.trim());
    setIsSubmitting(false);

    if (result.success) {
      showToast('Assignment submitted successfully! Your mentor will review it shortly.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Return to Course"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[11px] font-bold border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                  <FileCheck2 size={12} /> Course Assignment
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">• {course.title}</span>
              </div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{assignment.title}</h1>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Associated Course</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1">{course.title}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Maximum Marks</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                <Award size={14} /> {assignment.maxMarks} Points
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Submission Status</span>
              <span className="text-xs font-bold mt-0.5 flex items-center gap-1">
                {userSubmission ? (
                  userSubmission.status === 'graded' ? (
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                      Graded ({userSubmission.marksAwarded}/{assignment.maxMarks})
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                      Submitted (Under Review)
                    </span>
                  )
                ) : (
                  <span className="text-blue-700 dark:text-blue-400 flex items-center gap-1">
                    <AlertCircle size={14} className="text-blue-600 dark:text-blue-400" />
                    Pending Submission
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Assignment Instructions / Problem Statement */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-teal-600 dark:text-teal-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Assignment Instructions & Requirements
              </h2>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {assignment.instructions}
            </p>
          </div>

          {/* Existing Graded Review Feedback */}
          {userSubmission && userSubmission.status === 'graded' && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Mentor Evaluation & Feedback</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-xs">
                  Score: {userSubmission.marksAwarded} / {assignment.maxMarks}
                </span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 italic">
                "{userSubmission.feedback || 'Great job demonstrating the core architectural concepts covered in the course reels!'}"
              </p>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Your Solution / Implementation Notes / Repository Link</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">Supports text, code snippets, and URL links</span>
              </label>
              <textarea
                rows={6}
                value={solutionContent}
                onChange={e => setSolutionContent(e.target.value)}
                placeholder="Example: https://github.com/myusername/project-repo&#10;&#10;Key Architectural Decisions:&#10;1. Implemented structured concurrency scopes using Java 21...&#10;2. Verified 60fps framerate without layout thrashing..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3.5 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {userSubmission
                  ? `Last submitted: ${new Date(userSubmission.submittedAt).toLocaleDateString()}`
                  : 'Submit after completing all 5 course reels.'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Return to Course
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{userSubmission ? 'Update & Resubmit' : 'Submit Assignment'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
