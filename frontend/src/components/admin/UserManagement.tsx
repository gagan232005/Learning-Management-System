import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Course } from '../../types';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Power,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  Flame
} from 'lucide-react';

interface UserManagementProps {
  initialTab?: 'learners' | 'mentors';
  onViewLearner: (userId: string) => void;
  onViewMentor: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  initialTab = 'learners',
  onViewLearner,
  onViewMentor,
}) => {
  const { users, toggleUserStatus, courses } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'learners' | 'mentors'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const learners = users.filter(u => u.role === 'student' || u.role === 'learner' || u.role === 'ROLE_LEARNER');
  const mentors = users.filter(u => u.role === 'mentor' || u.role === 'seller' || u.role === 'ROLE_MENTOR');

  const activeList = activeSubTab === 'learners' ? learners : mentors;

  const filteredUsers = activeList.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.specialty && user.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase border border-blue-500/30">
              Identity & Access Management
            </span>
            <span className="text-xs text-slate-400 font-mono">Role-Based Operations</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Platform User Management</h2>
          <p className="text-xs text-slate-400">Manage accounts, inspect learner dossiers, and review mentor portfolios.</p>
        </div>

        {/* Tab Toggle (Learners vs Mentors) */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/10 self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('learners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'learners'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap size={15} />
            <span>Learners ({learners.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mentors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'mentors'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Mentors ({mentors.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeSubTab} by name, email, specialty...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter size={13} />
            <span>Status:</span>
          </span>
          <div className="flex items-center gap-1">
            {(['all', 'active', 'inactive'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-800/50 border border-transparent'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table / Card Grid */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel bg-slate-900/40 border border-white/5 space-y-2">
            <Users size={32} className="mx-auto text-slate-500" />
            <p className="text-sm font-semibold text-slate-300">No {activeSubTab} match the current filter query.</p>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or status filter.</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const isLearner = activeSubTab === 'learners';

            return (
              <div
                key={user.id}
                className="p-4 sm:p-5 rounded-2xl glass-panel bg-slate-900/90 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                {/* User Identity Column */}
                <div className="flex items-center gap-3.5 min-w-[240px]">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md ${
                      isLearner
                        ? 'bg-gradient-to-tr from-blue-600 to-sky-500 text-white border border-blue-400/30'
                        : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white border border-emerald-400/30'
                    }`}
                  >
                    {initials}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{user.name}</h4>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          user.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {user.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                    <span className="text-[11px] text-slate-400 block">
                      {isLearner
                        ? `Mentor: ${user.assignedMentorName || 'Dr. Meera Iyer'}`
                        : `Specialty: ${user.specialty || 'Full-Stack Engineering'}`}
                    </span>
                  </div>
                </div>

                {/* Telemetry Stats Column */}
                {isLearner ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-800/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Enrolled Courses</span>
                      <strong className="text-white font-mono font-bold">{user.enrolledCourseIds?.length || 0} Courses</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Quiz Accuracy</span>
                      <strong className="text-emerald-400 font-mono font-bold">{user.quizAverage ?? 0}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Study Time</span>
                      <strong className="text-sky-400 font-mono font-bold">{user.totalLearningHours ?? 0} hrs</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Badges Earned</span>
                      <strong className="text-amber-400 font-mono font-bold">{user.badges?.length || 0} Badges</strong>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-800/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Assigned Scholars</span>
                      <strong className="text-white font-mono font-bold">
                        {user.assignedLearnerIds?.length || 2} Learners
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Authored Masterclasses</span>
                      <strong className="text-emerald-400 font-mono font-bold">
                        {courses.filter(c => c.instructorId === user.id).length} Courses
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Quality Rating</span>
                      <strong className="text-amber-400 font-mono font-bold">4.92 ★</strong>
                    </div>
                  </div>
                )}

                {/* Actions: View Inspector & Status Switcher */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => {
                      if (isLearner) onViewLearner(user.id);
                      else onViewMentor(user.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                      isLearner
                        ? 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30'
                        : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30'
                    }`}
                  >
                    <Eye size={14} />
                    <span>{isLearner ? 'View Learner' : 'View Mentor'}</span>
                  </button>

                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    title={user.status === 'active' ? 'Deactivate user account' : 'Activate user account'}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                      user.status === 'active'
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    <Power size={14} />
                    <span className="hidden sm:inline">{user.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
