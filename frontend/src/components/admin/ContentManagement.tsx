import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Quiz, Assignment, Reel } from '../../types';
import { ConnectReelModal } from '../reels/ConnectReelModal';
import { parseMediaSource } from '../../utils/mediaUtils';
import {
  BookOpen,
  HelpCircle,
  FileCheck2,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Edit,
  Clock,
  Search,
  X,
  Play,
  Film,
  Youtube,
  Instagram,
  Video,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ContentManagementProps {
  initialSubTab?: 'courses' | 'reels' | 'quizzes' | 'assignments';
  onSubTabChange?: (tab: 'courses' | 'reels' | 'quizzes' | 'assignments') => void;
  onOpenCreateContent: (type?: 'course' | 'quiz' | 'assignment') => void;
}

export const ContentManagement: React.FC<ContentManagementProps> = ({
  initialSubTab = 'courses',
  onSubTabChange,
  onOpenCreateContent,
}) => {
  const {
    courses,
    deleteCourse,
    reels,
    deleteReel,
    toggleReelPublish,
    quizzes,
    deleteQuiz,
    assignments,
    deleteAssignment,
    gradeAssignmentSubmission,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'reels' | 'quizzes' | 'assignments'>(initialSubTab);
  const [isConnectReelOpen, setIsConnectReelOpen] = useState(false);
  const [previewReel, setPreviewReel] = useState<Reel | null>(null);

  React.useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'under_review' | 'draft'>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // Modals state
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<Assignment | null>(null);
  const [awardedMarks, setAwardedMarks] = useState<number>(90);
  const [gradingFeedback, setGradingFeedback] = useState('Excellent code architecture and unit tests!');

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && (c.status === 'published' || c.status === 'approved')) ||
        (statusFilter === 'under_review' && (c.status === 'submitted' || c.status === 'under_review')) ||
        (statusFilter === 'draft' && c.status === 'draft');

      return matchesSearch && matchesStatus;
    });
  }, [courses, searchQuery, statusFilter]);

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.courseTitle && q.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCourse =
        selectedCourseFilter === 'all' || q.courseId === selectedCourseFilter;

      return matchesSearch && matchesCourse;
    });
  }, [quizzes, searchQuery, selectedCourseFilter]);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.courseTitle && a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCourse =
        selectedCourseFilter === 'all' || a.courseId === selectedCourseFilter;

      return matchesSearch && matchesCourse;
    });
  }, [assignments, searchQuery, selectedCourseFilter]);

  // Filtered Reels
  const filteredReels = useMemo(() => {
    return reels.filter(r => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.creatorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && r.isPublished) ||
        (statusFilter === 'draft' && !r.isPublished);

      return matchesSearch && matchesStatus;
    });
  }, [reels, searchQuery, statusFilter]);

  const handleGradeSubmission = (submissionId: string) => {
    if (!selectedAssignmentForGrading) return;
    gradeAssignmentSubmission(
      selectedAssignmentForGrading.id,
      submissionId,
      awardedMarks,
      gradingFeedback
    );
    showToast('Assignment grade & evaluation feedback recorded!', 'success');
    setSelectedAssignmentForGrading(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Curriculum Repository</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold border border-indigo-200 dark:border-indigo-800">
              Multi-Source Learning
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">Content & Curriculum Management</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Oversee course masterclasses, educational YouTube & Instagram reels, milestone quizzes, and assignments.
          </p>
        </div>

        {/* Sub-Tab Navigation Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold self-start md:self-auto flex-wrap">
          <button
            onClick={() => {
              setActiveTab('courses');
              if (onSubTabChange) onSubTabChange('courses');
            }}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'courses' ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('reels');
              if (onSubTabChange) onSubTabChange('reels');
            }}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reels' ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Film size={14} className="text-red-500" />
            <span>Reels ({reels.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('quizzes');
              if (onSubTabChange) onSubTabChange('quizzes');
            }}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'quizzes' ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('assignments');
              if (onSubTabChange) onSubTabChange('assignments');
            }}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'assignments' ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Assignments ({assignments.length})
          </button>
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
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {activeTab === 'reels' ? (
          <button
            onClick={() => setIsConnectReelOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-end md:self-auto"
          >
            <Plus size={14} />
            <span>+ Connect YouTube / Instagram Reel</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenCreateContent(activeTab === 'courses' ? 'course' : activeTab === 'quizzes' ? 'quiz' : 'assignment')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-end md:self-auto"
          >
            <Plus size={14} />
            <span>+ Create {activeTab === 'courses' ? 'Course' : activeTab === 'quizzes' ? 'Quiz' : 'Assignment'}</span>
          </button>
        )}
      </div>

      {/* 1. EDUCATIONAL REELS TAB */}
      {activeTab === 'reels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReels.map(reel => {
              const media = parseMediaSource(reel.videoUrl);
              return (
                <div
                  key={reel.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail & Source Tag */}
                    <div className="relative h-44 w-full bg-slate-950 overflow-hidden group">
                      <img
                        src={reel.thumbnailUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {media.type === 'youtube' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-xs flex items-center gap-1">
                            <Youtube size={11} className="fill-white" />
                            <span>YouTube Shorts</span>
                          </span>
                        )}
                        {media.type === 'instagram' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs flex items-center gap-1">
                            <Instagram size={11} />
                            <span>Instagram</span>
                          </span>
                        )}
                        {media.type === 'direct' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-white border border-slate-700 shadow-xs flex items-center gap-1">
                            <Video size={11} />
                            <span>LMS Masterclass</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-slate-200 backdrop-blur-xs">
                          {reel.category}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reel.isPublished ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                        }`}>
                          {reel.isPublished ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>

                      {/* Bottom stats overlay */}
                      <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-semibold flex items-center justify-between">
                        <span>{reel.viewsCount.toLocaleString()} views</span>
                        <span>{reel.likesCount.toLocaleString()} likes</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {reel.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {reel.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                        <span>Creator: <strong className="text-slate-700 dark:text-slate-300">{reel.creatorName}</strong></span>
                        <span>{reel.questions?.length || 0} Quiz Question(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => toggleReelPublish(reel.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        reel.isPublished
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {reel.isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {media.originalUrl && (
                        <a
                          href={media.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="Open Original Video Link"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          deleteReel(reel.id);
                          showToast(`Reel "${reel.title}" removed.`, 'info');
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Reel"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden group">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between">
                    <span>5 Vertical Reels</span>
                    <span>${course.price}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{course.instructorName}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewCourse(course)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Preview Course"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => {
                      deleteCourse(course.id);
                      showToast(`Course "${course.title}" removed.`, 'info');
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => (
            <div
              key={quiz.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-4 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    {quiz.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {quiz.questions?.length || 0} Questions
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{quiz.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{quiz.courseTitle}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Pass: {quiz.passingPercentage}%</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewQuiz(quiz)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Preview Quiz"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => {
                      deleteQuiz(quiz.id);
                      showToast(`Quiz removed.`, 'info');
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Quiz"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ASSIGNMENTS TAB */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(assignment => (
            <div
              key={assignment.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-4 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Capstone Project
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Max: {assignment.maxMarks} pts
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{assignment.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{assignment.instructions}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedAssignmentForGrading(assignment)}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800 cursor-pointer"
                >
                  Grade Submissions ({(assignment.submissions || []).length})
                </button>
                <button
                  onClick={() => {
                    deleteAssignment(assignment.id);
                    showToast(`Assignment removed.`, 'info');
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                  title="Delete Assignment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Grading Modal */}
      {selectedAssignmentForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div>
                <h3 className="font-bold text-base">{selectedAssignmentForGrading.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Max Marks: {selectedAssignmentForGrading.maxMarks}</p>
              </div>
              <button onClick={() => setSelectedAssignmentForGrading(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="font-bold">Learner Submission: alex.chen@lms.ai</strong>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">SUBMITTED</span>
                </div>
                <p className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                  Repository URL: https://github.com/alexchen/distributed-architecture-assignment<br/>
                  Documentation: Completed all unit tests and Docker orchestrations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Award Marks (out of {selectedAssignmentForGrading.maxMarks})</label>
                    <input
                      type="number"
                      max={selectedAssignmentForGrading.maxMarks}
                      value={awardedMarks}
                      onChange={e => setAwardedMarks(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Evaluator Feedback</label>
                    <input
                      type="text"
                      value={gradingFeedback}
                      onChange={e => setGradingFeedback(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleGradeSubmission('sub-1')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Save Grade & Feedback
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
              <button onClick={() => setSelectedAssignmentForGrading(null)} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect YouTube / Instagram Reel Modal for Admin */}
      <ConnectReelModal
        isOpen={isConnectReelOpen}
        onClose={() => setIsConnectReelOpen(false)}
      />
    </div>
  );
};
