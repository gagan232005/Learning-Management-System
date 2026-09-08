import React from 'react';
import { User, Course, ContentApprovalItem } from '../../types';
import {
  ShieldCheck,
  BookOpen,
  Users,
  Star,
  DollarSign,
  FileCheck2,
  Clock,
  X,
  TrendingUp,
  Award,
  CheckCircle2,
  Briefcase,
  Mail
} from 'lucide-react';

interface MentorInspectorModalProps {
  mentor: User | null;
  courses: Course[];
  reels?: any[];
  approvalQueue: ContentApprovalItem[];
  allUsers: User[];
  onClose: () => void;
}

export const MentorInspectorModal: React.FC<MentorInspectorModalProps> = ({
  mentor,
  courses,
  approvalQueue,
  allUsers,
  onClose
}) => {
  if (!mentor) return null;

  const initials = mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const createdCourses = courses.filter(c => c.instructorId === mentor.id);
  const pendingContent = approvalQueue.filter(
    a => a.creatorId === mentor.id && (a.status === 'submitted' || a.status === 'under_review')
  );

  // Assigned scholars
  const assignedLearners = allUsers.filter(
    u => (u.role === 'student' || u.role === 'learner') &&
         (mentor.assignedLearnerIds?.includes(u.id) || u.assignedMentorId === mentor.id)
  );

  const totalStudentsTaught = createdCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalRevenueGenerated = createdCourses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">
                  Verified Faculty Member
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    mentor.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {mentor.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 font-display">
                {mentor.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {mentor.email} • {mentor.specialty || 'Full-Stack Architecture & AI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Assigned Scholars</span>
              <p className="text-sm font-bold text-slate-900 font-mono">
                {assignedLearners.length} Learners
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Authored Courses</span>
              <p className="text-sm font-bold text-indigo-600 font-mono">
                {createdCourses.length} Courses
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Students Taught</span>
              <p className="text-sm font-bold text-blue-600 font-mono">
                {totalStudentsTaught}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Faculty Revenue</span>
              <p className="text-sm font-bold text-slate-900 font-mono">
                ${totalRevenueGenerated.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Biography */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 text-xs block">Instructor Bio & Credentials</span>
            <p className="text-slate-600 leading-relaxed">
              {mentor.bio || 'Senior Software Architect and verified tech educator with over 10 years of experience in enterprise systems.'}
            </p>
          </div>

          {/* Authored Courses */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-600" />
              <span>Authored Masterclasses ({createdCourses.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {createdCourses.map(course => (
                <div
                  key={course.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">{course.title}</strong>
                      <span className="text-[11px] text-slate-500">{course.category} • ${course.price} • {course.studentsCount || 0} students</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
