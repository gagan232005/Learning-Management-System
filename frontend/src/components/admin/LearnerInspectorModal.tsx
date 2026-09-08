import React from 'react';
import { User, Course } from '../../types';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  Clock,
  TrendingUp,
  X,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Mail,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LearnerInspectorModalProps {
  learner: User | null;
  courses: Course[];
  onClose: () => void;
}

export const LearnerInspectorModal: React.FC<LearnerInspectorModalProps> = ({
  learner,
  courses,
  onClose
}) => {
  if (!learner) return null;

  const initials = learner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const enrolledCourses = courses.filter(c => (learner.enrolledCourseIds || []).includes(c.id));
  const completedCourses = courses.filter(c => (learner.completedCourseIds || []).includes(c.id));

  const formattedJoinDate = learner.registeredAt
    ? new Date(learner.registeredAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-700 dark:text-blue-400">
                  Learner Dossier & Telemetry
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    learner.status === 'active'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {learner.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                {learner.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{learner.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700 dark:text-slate-300">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Assigned Mentor</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {learner.assignedMentorName || 'Unassigned'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Learning Hours</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {learner.totalLearningHours ?? 0} hrs
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Quiz Avg Accuracy</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {learner.quizAverage ?? 0}%
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Joined Date</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Calendar size={13} className="text-slate-400" />
                {formattedJoinDate}
              </p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Enrolled Curriculum ({enrolledCourses.length})</span>
            </h3>

            {enrolledCourses.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-400 text-center">
                No courses enrolled yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enrolledCourses.map(course => {
                  const isCompleted = (learner.completedCourseIds || []).includes(course.id);
                  return (
                    <div
                      key={course.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-bold text-xs">{course.title}</strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{course.category} • ${course.price}</span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Badges Earned */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Award size={16} className="text-amber-600 dark:text-amber-400" />
              <span>Badges & Certifications ({learner.badges?.length || 0})</span>
            </h3>

            {(!learner.badges || learner.badges.length === 0) ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-400 text-center">
                No badges earned yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {learner.badges.map(badge => (
                  <div
                    key={badge.id}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Award size={14} className="text-amber-600 dark:text-amber-400" />
                    <span>{badge.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
