import React, { useState } from 'react';
import { Course, CourseReel, Assignment, Quiz } from '../../types';
import { useApp } from '../../context/AppContext';
import { CourseAssignmentModal } from './CourseAssignmentModal';
import { CourseQuizModal } from './CourseQuizModal';
import {
  BookOpen,
  PlayCircle,
  Clock,
  Award,
  CheckCircle2,
  Star,
  Users,
  Tag,
  Gift,
  Check,
  ShieldCheck,
  X,
  Play,
  MessageSquare,
  Send,
  Sparkles,
  PlaySquare,
  ChevronRight,
  FileCheck2,
  Lock,
  Unlock,
  ArrowRight,
  HelpCircle,
  Zap,
  RotateCcw,
  Youtube,
  ExternalLink
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, isOpen, onClose }) => {
  const {
    currentUser,
    enrollInCourse,
    redeemVoucher,
    courseFeedback,
    submitCourseFeedback,
    completedCourseReels,
    markCourseReelCompleted,
    isCourseReelCompleted,
    assignments,
    quizzes,
    showToast
  } = useApp();

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  // Quiz & Assignment Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Feedback State
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  if (!isOpen) return null;

  const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
  const basePrice = course.discountedPrice || course.price;
  const finalPrice = discountPercent > 0 ? Math.round(basePrice * (1 - discountPercent / 100)) : basePrice;

  // 5 Course Reels
  const courseReels: CourseReel[] = course.reels && course.reels.length > 0 ? course.reels : [
    {
      id: `${course.id}-reel-1`,
      courseId: course.id,
      order: 1,
      title: 'Reel 1: Foundations & Architecture Setup',
      description: 'Environment bootstrap, core architectural patterns, and foundational concepts in 60s.',
      topic: `${course.title} - Fundamentals`,
      durationSeconds: 54,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 1240
    },
    {
      id: `${course.id}-reel-2`,
      courseId: course.id,
      order: 2,
      title: 'Reel 2: Core Deep Dive & Execution',
      description: 'Hands-on code execution, internals, memory anatomy, and execution lifecycle.',
      topic: `${course.title} - Deep Dive`,
      durationSeconds: 58,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 980
    },
    {
      id: `${course.id}-reel-3`,
      courseId: course.id,
      order: 3,
      title: 'Reel 3: Advanced Patterns & Resiliency',
      description: 'Resilient architectural patterns, error handling, and production-grade best practices.',
      topic: `${course.title} - Patterns`,
      durationSeconds: 52,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 890
    },
    {
      id: `${course.id}-reel-4`,
      courseId: course.id,
      order: 4,
      title: 'Reel 4: Performance Profiling & Optimization',
      description: 'Profiling bottlenecks, memory optimization, caching strategies, and latency minimization.',
      topic: `${course.title} - Optimization`,
      durationSeconds: 56,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 750
    },
    {
      id: `${course.id}-reel-5`,
      courseId: course.id,
      order: 5,
      title: 'Reel 5: Production Deployment & Best Practices',
      description: 'Deploying to production, telemetry monitoring, real-world case studies, and certification readiness.',
      topic: `${course.title} - Production`,
      durationSeconds: 60,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 1120
    }
  ];

  const activeReel = courseReels[activeReelIndex] || courseReels[0];
  const isReelDone = isCourseReelCompleted(course.id, activeReel.id);

  // Feedback list
  const feedbackList = courseFeedback.filter(f => f.courseId === course.id);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const discount = redeemVoucher(couponCode.trim().toUpperCase());
    if (discount > 0) {
      setDiscountPercent(discount);
      setAppliedCode(couponCode.trim().toUpperCase());
    }
  };

  const handleEnroll = () => {
    enrollInCourse(course.id, appliedCode || undefined);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      showToast('Please enter your review comments.', 'error');
      return;
    }
    submitCourseFeedback(course.id, feedbackRating, feedbackComment.trim());
    setFeedbackComment('');
    setShowFeedbackForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              {course.category}
            </span>
            <span className="text-xs font-bold text-slate-700">• 5 Vertical Learning Reels</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Platform Banner & Launch Header */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs shrink-0">
                {course.platform === 'youtube' ? <Youtube size={20} className="fill-white" /> : course.platform === 'udemy' ? 'U' : course.platform === 'coursera' ? 'C' : course.platform === 'edx' ? 'e' : <ShieldCheck size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white capitalize">
                    {course.platform === 'youtube' ? 'YouTube Masterclass' : course.platform === 'udemy' ? 'Udemy Bestseller' : course.platform === 'coursera' ? 'Coursera Specialization' : course.platform === 'edx' ? 'edX Verified' : 'Verified LMS Masterclass'}
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                    {course.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {course.instructorName} • {course.durationHours || 10} Hours • {course.level} Level
                </p>
              </div>
            </div>

            {course.platformUrl && (
              <a
                href={course.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
              >
                <span>Open on {course.platform ? course.platform.toUpperCase() : 'Platform'}</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          {/* Main Grid: Player on left, 5 Reels list on right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Player Container (Left: 7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                {course.platform === 'youtube' && course.platformUrl ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${course.platformUrl.includes('v=') ? course.platformUrl.split('v=')[1]?.split('&')[0] : '8mAITcNt710'}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                    title={course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={activeReel.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={activeReel.thumbnailUrl || course.thumbnailUrl}
                  />
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow-xs pointer-events-none">
                  <PlaySquare size={13} className="text-blue-400" />
                  <span>Curriculum: {activeReel.title}</span>
                </div>
              </div>

              {/* Reel Controls for Enrolled Users */}
              {isEnrolled && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700">Reel Completion:</span>
                    <span className={isReelDone ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                      {isReelDone ? 'Completed ✓' : 'Not completed'}
                    </span>
                  </div>
                  <button
                    onClick={() => markCourseReelCompleted(course.id, activeReel.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isReelDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    <Check size={14} />
                    <span>{isReelDone ? 'Marked Complete' : 'Mark Reel Complete'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5 Reels Curriculum List (Right: 5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  5 Course Reels
                </h2>
                <span className="text-xs font-mono font-semibold text-blue-600">
                  5 Vertical Reels
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {courseReels.map((reel, index) => {
                  const isCurrent = activeReelIndex === index;
                  const isDone = isCourseReelCompleted(course.id, reel.id);

                  return (
                    <div
                      key={reel.id}
                      onClick={() => setActiveReelIndex(index)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isDone ? <Check size={14} /> : index + 1}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate leading-snug">
                            {reel.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {reel.topic} • {reel.durationSeconds || 60}s
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <ChevronRight size={14} className={isCurrent ? 'text-blue-600' : 'text-slate-300'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Course Details & Bio */}
          <div className="pt-2 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{course.title}</h1>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{course.description}</p>
            </div>

            {/* Instructor Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {course.instructorName ? course.instructorName[0] : 'M'}
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">{course.instructorName}</h2>
                  <p className="text-[11px] text-slate-500">{course.instructorBio || 'Verified LMS Mentor'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{(course.rating || 4.9).toFixed(1)}</span>
              </div>
            </div>

            {/* Enrollment / Purchase Section */}
            {!isEnrolled ? (
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-900">Get Instant Access to all 5 Reels & Assignment</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-slate-900">${finalPrice}</span>
                      {course.discountedPrice && (
                        <span className="text-sm text-slate-400 line-through">${course.price}</span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {discountPercent}% OFF APPLIED
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleEnroll}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Enroll Now (${finalPrice})
                  </button>
                </div>

                {/* Voucher Code Form */}
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter voucher code (e.g. REELPRO30)"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs uppercase font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>You are enrolled in this course. Complete all 5 reels to unlock the assignment!</span>
                </div>
                <button
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Write Review
                </button>
              </div>
            )}

            {/* Course Completion Banner */}
            {(() => {
              const completedReelsForCourse = completedCourseReels[course.id] || [];
              const completedReelsCount = completedReelsForCourse.length;
              const isCourseFinished = completedReelsCount >= 5;

              if (!isCourseFinished) return null;

              return (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg space-y-3 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 shadow-inner">
                        🎓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                            Course Completed ✓
                          </span>
                          <span className="text-xs text-blue-100 font-semibold">5 of 5 Reels Watched</span>
                        </div>
                        <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                          You are ready to take the Course Quiz & Capstone!
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsQuizModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <HelpCircle size={15} className="text-blue-600" />
                        <span>Attend Course Quiz (5 Qs)</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Course Quiz Section */}
            {(() => {
              const defaultQuiz: Quiz = {
                id: `quiz-${course.id}`,
                courseId: course.id,
                courseTitle: course.title,
                moduleId: 'mod-1',
                moduleTitle: 'Module 1: Comprehensive Mastery',
                title: `${course.title} - Mastery Assessment Quiz`,
                difficulty: course.level === 'Advanced' ? 'Advanced' : 'Intermediate',
                totalMarks: 50,
                passingPercentage: 80,
                createdAt: '2026-08-25T00:00:00Z',
                questions: [
                  {
                    id: `q-${course.id}-1`,
                    category: course.category,
                    type: 'mcq',
                    prompt: `What core architectural paradigm is demonstrated across the 5 reels of ${course.title}?`,
                    options: [
                      'Monolithic procedural single-threaded execution',
                      'High-throughput scalable architecture with structured patterns and memory optimization',
                      'Unvalidated synchronous blocking client queries',
                      'Direct hardware assembly mapping'
                    ],
                    correctIndex: 1,
                    explanation: `The course emphasizes production-grade architecture, resilience patterns, and optimal memory management for ${course.category}.`,
                    marks: 10
                  },
                  {
                    id: `q-${course.id}-2`,
                    category: course.category,
                    type: 'true_false',
                    prompt: `Mastering the 5 vertical reels for ${course.title} provides end-to-end certification readiness for technical interviews.`,
                    options: ['True', 'False'],
                    correctIndex: 0,
                    explanation: 'True! The 5-reel curriculum syllabus covers fundamentals, deep dive, advanced patterns, and production telemetry.',
                    marks: 10
                  },
                  {
                    id: `q-${course.id}-3`,
                    category: course.category,
                    type: 'mcq',
                    prompt: `Which optimization technique was covered in Reel 4 for ${course.title}?`,
                    options: [
                      'Disabling caching completely',
                      'Performance profiling, memory leak elimination, and latency reduction',
                      'Deleting all database indexes',
                      'Hardcoding credentials into source files'
                    ],
                    correctIndex: 1,
                    explanation: 'Reel 4 focuses on performance tuning, profiling bottlenecks, and optimizing resource utilization.',
                    marks: 10
                  },
                  {
                    id: `q-${course.id}-4`,
                    category: course.category,
                    type: 'true_false',
                    prompt: `Scoring ≥ 80% on this course quiz awards +150 XP and certifies verified mastery in ${course.category}.`,
                    options: ['True', 'False'],
                    correctIndex: 0,
                    explanation: 'True! Achieving 80% passes the mastery criteria.',
                    marks: 10
                  },
                  {
                    id: `q-${course.id}-5`,
                    category: course.category,
                    type: 'mcq',
                    prompt: `What is the primary production takeaway from Reel 5 of ${course.title}?`,
                    options: [
                      'Deploying without monitoring or alerts',
                      'Production telemetry, error resiliency, and architectural best practices',
                      'Skipping unit and integration test validation',
                      'Running untyped scripts in staging'
                    ],
                    correctIndex: 1,
                    explanation: 'Production readiness requires comprehensive observability, structured exception handlers, and deployment safety.',
                    marks: 10
                  }
                ]
              };

              const courseQuiz: Quiz = quizzes.find(q => q.courseId === course.id) || defaultQuiz;
              const completedReelsForCourse = completedCourseReels[course.id] || [];
              const completedReelsCount = completedReelsForCourse.length;
              const isQuizUnlocked = completedReelsCount >= 5;

              return (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                        <HelpCircle size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Course Quiz (5 Questions)
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{courseQuiz.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isQuizUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
                          <Unlock size={13} /> Unlocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 text-xs font-bold flex items-center gap-1">
                          <Lock size={13} /> Locked ({completedReelsCount}/5 Reels)
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Test your knowledge on the core architectural concepts covered across all 5 vertical reels of this masterclass. Pass with ≥ 80% to earn +150 XP and course certification.
                  </p>

                  {/* Quiz Reel Requirement Checklist */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                      <span>Course Reel Completion Requirement:</span>
                      <span className={isQuizUnlocked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
                        {completedReelsCount} / 5 Reels Watched
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isQuizUnlocked ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, (completedReelsCount / 5) * 100)}%` }}
                      />
                    </div>

                    <div className="text-[11px]">
                      {isQuizUnlocked ? (
                        <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} /> All 5 course reels completed! You are now eligible to take this quiz.
                        </span>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Lock size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Watch all 5 required course reels in the curriculum above to unlock this quiz.</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quiz Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Questions</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{courseQuiz.questions?.length || 5} Qs</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Passing Score</span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">80% (4/5)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Marks</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{courseQuiz.totalMarks || 50} pts</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Reward</span>
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">+150 XP</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isQuizUnlocked
                        ? '✨ Ready to attempt — 2-minute timed assessment'
                        : `Complete all 5 course reels to unlock this quiz (${completedReelsCount}/5 completed)`}
                    </div>

                    {isQuizUnlocked ? (
                      <button
                        onClick={() => setIsQuizModalOpen(true)}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Zap size={14} />
                        <span>Take Course Quiz</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-not-allowed"
                        title="Watch all 5 course reels to unlock this quiz"
                      >
                        <Lock size={13} />
                        <span>Complete 5/5 Reels to Unlock Quiz</span>
                      </button>
                    )}
                  </div>

                  {/* Course Quiz Modal */}
                  <CourseQuizModal
                    quiz={courseQuiz}
                    course={course}
                    isOpen={isQuizModalOpen}
                    onClose={() => setIsQuizModalOpen(false)}
                  />
                </div>
              );
            })()}

            {/* Course Assignment Section */}
            {(() => {
              const courseAssignment: Assignment = assignments.find(a => a.courseId === course.id) || {
                id: `ass-${course.id}`,
                courseId: course.id,
                courseTitle: course.title,
                moduleId: 'mod-1',
                moduleTitle: 'Module 1: Capstone',
                title: `${course.title} - Capstone Assignment`,
                instructions: `Implement the architectural requirements and core concepts learned in the 5 course reels. Submit your solution or repository link for mentor review.`,
                dueDate: '2026-09-30T23:59:59Z',
                maxMarks: 100,
                submissionType: 'code',
                submissions: []
              };

              const completedReelsForCourse = completedCourseReels[course.id] || [];
              const completedReelsCount = completedReelsForCourse.length;
              const isAssignmentUnlocked = completedReelsCount >= 5;
              const userSubmission = (courseAssignment.submissions || []).find(s => s.userId === currentUser.id);

              return (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <FileCheck2 size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Course Assignment
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">{courseAssignment.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isAssignmentUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <Unlock size={13} /> Unlocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1">
                          <Lock size={13} /> Locked ({completedReelsCount}/5 Reels)
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {courseAssignment.instructions}
                  </p>

                  {/* Progress Checklist */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Reel Completion Requirement:</span>
                      <span className={isAssignmentUnlocked ? 'text-emerald-600' : 'text-slate-600'}>
                        {completedReelsCount}/5 Reels Completed
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isAssignmentUnlocked ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, (completedReelsCount / 5) * 100)}%` }}
                      />
                    </div>

                    <div className="text-[11px]">
                      {isAssignmentUnlocked ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} /> All 5 course reels completed! You can now start and submit this assignment.
                        </span>
                      ) : (
                        <span className="text-slate-600 flex items-center gap-1">
                          <Lock size={13} className="text-amber-600" /> Complete all 5 required course reels above to unlock this assignment.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submission State & Action Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="text-xs">
                      {userSubmission ? (
                        <span className="font-bold text-slate-800">
                          Status:{' '}
                          <span className={userSubmission.status === 'graded' ? 'text-emerald-600' : 'text-amber-600'}>
                            {userSubmission.status === 'graded'
                              ? `Graded (${userSubmission.marksAwarded}/${courseAssignment.maxMarks})`
                              : 'Submitted (Under Review)'}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          {isAssignmentUnlocked ? 'Ready for submission' : 'Complete 5/5 reels to unlock'}
                        </span>
                      )}
                    </div>

                    {isAssignmentUnlocked ? (
                      <button
                        onClick={() => setIsAssignmentModalOpen(true)}
                        className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileCheck2 size={14} />
                        <span>{userSubmission ? 'View / Update Submission' : 'Start Assignment'}</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 cursor-not-allowed"
                        title="Complete all 5 reels to unlock this assignment"
                      >
                        <Lock size={13} />
                        <span>Complete 5/5 Reels to Unlock</span>
                      </button>
                    )}
                  </div>

                  {/* Assignment Modal */}
                  <CourseAssignmentModal
                    assignment={courseAssignment}
                    course={course}
                    isOpen={isAssignmentModalOpen}
                    onClose={() => setIsAssignmentModalOpen(false)}
                  />
                </div>
              );
            })()}

            {/* Review Form */}
            {showFeedbackForm && (
              <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h2 className="text-xs font-bold text-slate-900">Review this Masterclass</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={18}
                          className={star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder="Share what you learned from these 5 vertical reels..."
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Course Reviews List */}
            {feedbackList.length > 0 && (
              <div className="space-y-2 pt-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Learner Reviews ({feedbackList.length})
                </h2>
                <div className="space-y-2">
                  {feedbackList.map(fb => (
                    <div key={fb.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{fb.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(fb.rating)].map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
