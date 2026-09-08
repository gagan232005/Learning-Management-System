import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Download,
  X,
  ChevronRight,
  RotateCw,
  Plus,
  UserPlus,
  Mail,
  Lock,
  Calendar,
  Sparkles
} from 'lucide-react';

interface LearnersManagementProps {
  onViewLearner: (userId: string) => void;
  onViewMentor: (userId: string) => void;
}

export const LearnersManagement: React.FC<LearnersManagementProps> = ({
  onViewLearner
}) => {
  const { users, toggleUserStatus, showToast, refreshUsers, registerLearnerByAdmin } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quiz' | 'hours' | 'courses' | 'recent'>('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add Learner Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  // Auto-sync roster on mount
  useEffect(() => {
    refreshUsers();
  }, []);

  // Filter only learners
  const learners = useMemo(() => {
    return users.filter(
      u => u.role === 'student' || u.role === 'learner' || u.role === 'ROLE_LEARNER'
    );
  }, [users]);

  // Filtered & sorted learners
  const filteredLearners = useMemo(() => {
    return learners
      .filter(learner => {
        const matchesSearch =
          learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          learner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (learner.assignedMentorName && learner.assignedMentorName.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all' || learner.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'quiz') return (b.quizAverage || 0) - (a.quizAverage || 0);
        if (sortBy === 'hours') return (b.totalLearningHours || 0) - (a.totalLearningHours || 0);
        if (sortBy === 'courses') return (b.enrolledCourseIds?.length || 0) - (a.enrolledCourseIds?.length || 0);
        if (sortBy === 'recent') {
          const dateA = a.registeredAt ? new Date(a.registeredAt).getTime() : 0;
          const dateB = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
          return dateB - dateA;
        }
        return a.name.localeCompare(b.name);
      });
  }, [learners, searchQuery, statusFilter, sortBy]);

  // Aggregate Metrics
  const totalLearners = learners.length;
  const activeLearners = learners.filter(l => l.status === 'active').length;
  const avgQuizAccuracy =
    totalLearners > 0
      ? Math.round(learners.reduce((sum, l) => sum + (l.quizAverage ?? 0), 0) / totalLearners)
      : 0;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUsers();
      showToast('Learners roster refreshed and synchronized.', 'info');
    } catch {
      showToast('Roster updated from local storage.', 'info');
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleCreateLearner = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newName.trim() || !newEmail.trim()) {
      setAddError('Full name and email are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await registerLearnerByAdmin({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword
      });
      setIsAddModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('password123');
    } catch (err: any) {
      setAddError(err.message || 'Failed to create learner account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Learner Name,Email,Status,Assigned Mentor,Enrolled Courses,Quiz Accuracy %,Study Hours,Badges Earned,Joined Date']
        .concat(
          filteredLearners.map(
            l =>
              `"${l.name}","${l.email}","${l.status}","${l.assignedMentorName || 'None'}",${l.enrolledCourseIds?.length || 0},${l.quizAverage ?? 0}%,${l.totalLearningHours || 0},${l.badges?.length || 0},"${l.registeredAt || 'N/A'}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `learners_roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Learners roster exported successfully.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Page Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Student Body</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced Roster
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">Learners Directory</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Inspect learner milestones, monitor quiz assessment telemetry, and manage student accounts in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-60"
            title="Force refresh roster from database"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Roster'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <UserPlus size={15} />
            <span>+ Add Learner</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Total Registered Learners</span>
          <strong className="text-2xl font-bold text-slate-900 dark:text-white font-mono block mt-1">{totalLearners}</strong>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">{activeLearners} Active Students</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Average Quiz Accuracy</span>
          <strong className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono block mt-1">{avgQuizAccuracy}%</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Across all reels & milestone quizzes</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Learning Activity</span>
          <strong className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono block mt-1">100%</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Platform operational</span>
        </div>
      </div>

      {/* Filter, Search, and Sort Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search learners by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All ({learners.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            Active ({activeLearners})
          </button>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="recent">Sort: Newest First</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="quiz">Sort: Highest Quiz %</option>
            <option value="courses">Sort: Most Courses</option>
            <option value="hours">Sort: Study Hours</option>
          </select>
        </div>
      </div>

      {/* Learners Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Learner</th>
                <th className="p-4">Status</th>
                <th className="p-4">Enrolled Courses</th>
                <th className="p-4">Quiz Score</th>
                <th className="p-4">Badges</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLearners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No learners match the search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLearners.map(learner => {
                  const formattedDate = learner.registeredAt
                    ? new Date(learner.registeredAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Active';

                  return (
                    <tr key={learner.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {learner.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="text-slate-900 dark:text-white font-bold block">{learner.name}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">{learner.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleUserStatus(learner.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border cursor-pointer transition-all ${
                            learner.status === 'active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                          }`}
                        >
                          {learner.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{learner.enrolledCourseIds?.length || 0} Courses</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{learner.quizAverage ?? 0}%</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-amber-600 dark:text-amber-400">{learner.badges?.length || 0} Badges</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {formattedDate}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onViewLearner(learner.id)}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Add Learner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Register New Learner</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admin Account Provisioning</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateLearner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Yashwanth Siri"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="learner@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Learner can change this upon signing in.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
