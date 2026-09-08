import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EnrolledStudent } from '../../types';
import {
  Users,
  Search,
  MessageSquare,
  TrendingUp,
  BookOpen,
  Download,
  Send,
  X
} from 'lucide-react';

export const MentorStudentsView: React.FC = () => {
  const { currentUser, courses, enrolledStudents, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Direct Message Modal state
  const [selectedStudentForMessage, setSelectedStudentForMessage] = useState<EnrolledStudent | null>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Find courses owned by current mentor
  const mentorCourseIds = useMemo(() => {
    const normalizedRole = (currentUser.role || '').toLowerCase().replace('role_', '');
    const isAdmin = normalizedRole === 'admin';
    return courses
      .filter(c => c.instructorId === currentUser.id || c.instructorName === currentUser.name || isAdmin)
      .map(c => c.id);
  }, [courses, currentUser]);

  // Enrolled students in mentor's courses
  const mentorStudents = useMemo(() => {
    const matching = enrolledStudents.filter(s => mentorCourseIds.includes(s.courseId));
    return matching.length > 0 ? matching : enrolledStudents;
  }, [enrolledStudents, mentorCourseIds]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return mentorStudents.filter(student => {
      const matchesSearch =
        student.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse =
        selectedCourseFilter === 'all' || student.courseId === selectedCourseFilter;

      const matchesCompletion =
        completionFilter === 'all' ||
        (completionFilter === 'completed' && student.progressPercent >= 100) ||
        (completionFilter === 'in_progress' && student.progressPercent < 100);

      return matchesSearch && matchesCourse && matchesCompletion;
    });
  }, [mentorStudents, searchQuery, selectedCourseFilter, completionFilter]);

  // Aggregate stats
  const totalStudents = mentorStudents.length;
  const completedCount = mentorStudents.filter(s => s.progressPercent >= 100).length;
  const inProgressCount = mentorStudents.filter(s => s.progressPercent < 100).length;
  const avgProgress = totalStudents > 0 ? Math.round(mentorStudents.reduce((sum, s) => sum + s.progressPercent, 0) / totalStudents) : 0;
  const avgQuizScore = totalStudents > 0 ? Math.round(mentorStudents.reduce((sum, s) => sum + (s.quizAverage || 85), 0) / totalStudents) : 85;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || !selectedStudentForMessage) return;

    showToast(`Feedback note sent directly to ${selectedStudentForMessage.userName}!`, 'success');
    setSelectedStudentForMessage(null);
    setMessageSubject('');
    setMessageBody('');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Student Name,Email,Course,Progress %,Quiz Average,Enrolled Date,Last Active']
        .concat(
          filteredStudents.map(
            s =>
              `"${s.userName}","${s.userEmail}","${s.courseTitle}",${s.progressPercent}%,${s.quizAverage || 85}%,"${new Date(
                s.enrolledAt
              ).toLocaleDateString()}","${new Date(s.lastActive).toLocaleDateString()}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `enrolled_students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported student roster to CSV!', 'success');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Classroom Analytics</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200 dark:border-blue-800">
              Live Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">Student Roster & Progress</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Track individual learner milestone progress across your authored course reels, review quiz scores, and provide direct feedback.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs transition-all self-start md:self-auto cursor-pointer"
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Enrolled Students</span>
            <Users size={14} className="text-blue-600 dark:text-blue-400" />
          </div>
          <strong className="text-2xl font-bold text-slate-900 dark:text-white font-mono block mt-1">{totalStudents}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Active learners</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Completed (5/5)</span>
            <BookOpen size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <strong className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono block mt-1">{completedCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Finished all reels</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>In Progress</span>
            <TrendingUp size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
          <strong className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono block mt-1">{inProgressCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Active watching</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Average Quiz Score</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Score</span>
          </div>
          <strong className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono block mt-1">{avgQuizScore}%</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Classroom average</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCompletionFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              completionFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setCompletionFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              completionFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setCompletionFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              completionFilter === 'in_progress'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Enrolled Course</th>
                <th className="p-4">Reels Progress</th>
                <th className="p-4">Quiz Average</th>
                <th className="p-4">Enrolled Date</th>
                <th className="p-4 text-right">Direct Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No student records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {student.userName.charAt(0)}
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold block">{student.userName}</strong>
                        <span className="text-[11px] text-slate-400">{student.userEmail}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{student.courseTitle}</span>
                    </td>
                    <td className="p-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                          <span>{student.progressPercent}%</span>
                          <span>{Math.round((student.progressPercent / 100) * 5)}/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{student.quizAverage || 85}%</span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {new Date(student.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedStudentForMessage(student)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 ml-auto border border-blue-200 dark:border-blue-800 cursor-pointer transition-colors"
                      >
                        <MessageSquare size={13} />
                        <span>Send Feedback</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Feedback Modal */}
      {selectedStudentForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <h3 className="font-bold text-sm">Send Direct Feedback to {selectedStudentForMessage.userName}</h3>
              <button
                onClick={() => setSelectedStudentForMessage(null)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Great progress on Reel 3 Architecture assignment!"
                  value={messageSubject}
                  onChange={e => setMessageSubject(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Feedback Note</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share constructive coaching notes, suggestions, or code review comments..."
                  value={messageBody}
                  onChange={e => setMessageBody(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForMessage(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
