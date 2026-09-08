import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, ApprovalStatus } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PlayCircle,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

interface MentorCoursesViewProps {
  onNavigateToCreateCourse?: () => void;
}

export const MentorCoursesView: React.FC<MentorCoursesViewProps> = ({
  onNavigateToCreateCourse
}) => {
  const { currentUser, courses, deleteCourse, updateCourse, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApprovalStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Filter courses owned by or assigned to current mentor
  const mentorCourses = useMemo(() => {
    const normalizedRole = (currentUser.role || '').toLowerCase().replace('role_', '');
    const isAdmin = normalizedRole === 'admin';
    return courses.filter(
      c => c.instructorId === currentUser.id || c.instructorName === currentUser.name || isAdmin
    );
  }, [courses, currentUser]);

  // Filtered courses based on search and filters
  const filteredCourses = useMemo(() => {
    return mentorCourses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        c.status === statusFilter ||
        (statusFilter === 'published' && c.status === 'approved') ||
        (statusFilter === 'under_review' && c.status === 'submitted');

      const matchesCategory =
        categoryFilter === 'all' || c.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [mentorCourses, searchQuery, statusFilter, categoryFilter]);

  // Statistics
  const totalCourses = mentorCourses.length;
  const publishedCount = mentorCourses.filter(c => c.status === 'published' || c.status === 'approved').length;
  const pendingCount = mentorCourses.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const changesCount = mentorCourses.filter(c => c.status === 'changes_requested' || c.status === 'rejected').length;
  const totalStudents = mentorCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalEarnings = mentorCourses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={12} /> Published
          </span>
        );
      case 'submitted':
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold uppercase tracking-wider">
            <Clock size={12} /> Under Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[11px] font-bold uppercase tracking-wider">
            <AlertTriangle size={12} /> Changes Requested
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold uppercase tracking-wider">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider">
            Draft
          </span>
        );
    }
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      showToast(`Course "${courseToDelete.title}" deleted.`, 'info');
      setCourseToDelete(null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, {
        title: editingCourse.title,
        subtitle: editingCourse.subtitle,
        description: editingCourse.description,
        price: editingCourse.price,
        discountedPrice: editingCourse.discountedPrice,
        category: editingCourse.category,
        level: editingCourse.level,
        status: 'submitted' // Resubmit on edit
      });
      showToast(`Course updated and resubmitted for admin review.`, 'success');
      setEditingCourse(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Instructor Studio</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
              5-Reel Curriculum Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">My Courses Management</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Create, manage, and inspect your courses. All published courses feature 5 short vertical reels.
          </p>
        </div>

        <button
          onClick={onNavigateToCreateCourse}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Total</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono block mt-1">{totalCourses}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Authored courses</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Published</span>
          <strong className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono block mt-1">{publishedCount}</strong>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block font-semibold">Live in catalog</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">In Review</span>
          <strong className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono block mt-1">{pendingCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Pending admin</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">Action Req.</span>
          <strong className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400 font-mono block mt-1">{changesCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Changes needed</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Students</span>
          <strong className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono block mt-1">{totalStudents}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Total enrolled</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Earnings</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono block mt-1">${totalEarnings.toLocaleString()}</strong>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block font-semibold">Gross sales</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by course title, category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All ({mentorCourses.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('under_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'under_review'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800'
            }`}
          >
            Under Review ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('changes_requested')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'changes_requested'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800'
            }`}
          >
            Changes Req. ({changesCount})
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end md:self-auto">
          <button
            onClick={() => setViewLayout('grid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewLayout === 'grid' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewLayout('table')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewLayout === 'table' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Courses Display (Grid or Table) */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 transition-colors">
          <BookOpen size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No courses found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {searchQuery || statusFilter !== 'all'
              ? 'Try changing your search keywords or clearing the active filters.'
              : "You haven't authored any courses yet. Get started by creating your first course!"}
          </p>
          {onNavigateToCreateCourse && (
            <button
              onClick={onNavigateToCreateCourse}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Course</span>
            </button>
          )}
        </div>
      ) : viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden group">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">{getStatusBadge(course.status)}</div>
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <PlayCircle size={13} className="text-emerald-400" />
                      <span>5 Vertical Reels</span>
                    </div>
                    <span>{course.level}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  ${course.price}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedCourseForDetails(course)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="View Course Details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => setEditingCourse(course)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Edit Course"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setCourseToDelete(course)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Layout */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Course</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold block">{course.title}</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">5 Vertical Reels</span>
                      </div>
                    </td>
                    <td className="p-4">{course.category}</td>
                    <td className="p-4">{course.level}</td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">${course.price}</td>
                    <td className="p-4">{getStatusBadge(course.status)}</td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedCourseForDetails(course)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        title="View Course"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Edit Course"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => setCourseToDelete(course)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base">Delete Course</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{courseToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setCourseToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
