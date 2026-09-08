import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Quiz } from '../../types';
import { CourseQuizModal } from '../courses/CourseQuizModal';
import {
  CheckSquare,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Lock,
  Unlock,
  PlaySquare,
  ArrowRight,
  BookOpen,
  Search,
  Building2,
  Brain,
  Calculator,
  Code2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Target
} from 'lucide-react';

interface AssessmentsViewProps {
  setActiveTab?: (tab: string) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ setActiveTab }) => {
  const {
    assessmentHistory,
    courses,
    quizzes,
    completedCourseReels,
    showToast
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuizPair, setSelectedQuizPair] = useState<{ quiz: Quiz; course?: Course } | null>(null);

  const categories = [
    'All',
    'Top Tech Giants',
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Course Milestone'
  ];

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Top Tech Giants' && (quiz.category === 'Top Tech Giants' || quiz.company === 'Google' || quiz.company === 'Amazon' || quiz.company === 'Microsoft' || quiz.company === 'Meta')) ||
        (selectedCategory === 'Quantitative Aptitude' && quiz.category === 'Quantitative Aptitude') ||
        (selectedCategory === 'Logical Reasoning' && quiz.category === 'Logical Reasoning') ||
        (selectedCategory === 'Course Milestone' && (quiz.category === 'Course Milestone' || quiz.courseId));

      // Search filter
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        quiz.title.toLowerCase().includes(query) ||
        (quiz.description && quiz.description.toLowerCase().includes(query)) ||
        (quiz.company && quiz.company.toLowerCase().includes(query)) ||
        (quiz.targetRole && quiz.targetRole.toLowerCase().includes(query)) ||
        (quiz.category && quiz.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [quizzes, selectedCategory, searchQuery]);

  const handleLaunchQuiz = (quiz: Quiz) => {
    // If course quiz, check if course is locked
    if (quiz.courseId) {
      const course = courses.find(c => c.id === quiz.courseId);
      const completedReels = completedCourseReels[quiz.courseId] || [];
      const isUnlocked = completedReels.length >= 5;

      if (!isUnlocked) {
        showToast(`Please complete all 5 course reels for "${course?.title || 'this course'}" before attempting this quiz (${completedReels.length}/5 completed).`, 'warning');
        return;
      }
      setSelectedQuizPair({ quiz, course });
      return;
    }

    // For company and aptitude quizzes, launch immediately
    setSelectedQuizPair({ quiz });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Interview & Aptitude Hub</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
              FAANG Technical • Campus Aptitude • Course Milestones
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Interview Prep & Mastery Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Practice realistic technical interview questions from top tech giants (Google, Amazon, Microsoft, Meta), quantitative aptitude tests for campus placement drives, and verified course milestone assessments.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shrink-0 self-start md:self-auto text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Available Quizzes</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{quizzes.length}</span>
          <span className="text-[11px] text-slate-500 block">Assessments</span>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => {
            let count = quizzes.length;
            if (cat === 'Top Tech Giants') {
              count = quizzes.filter(q => q.category === 'Top Tech Giants' || q.company === 'Google' || q.company === 'Amazon' || q.company === 'Microsoft' || q.company === 'Meta').length;
            } else if (cat === 'Quantitative Aptitude') {
              count = quizzes.filter(q => q.category === 'Quantitative Aptitude').length;
            } else if (cat === 'Logical Reasoning') {
              count = quizzes.filter(q => q.category === 'Logical Reasoning').length;
            } else if (cat === 'Course Milestone') {
              count = quizzes.filter(q => q.category === 'Course Milestone' || q.courseId).length;
            }

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search company, topic, role..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <HelpCircle size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No assessments match your criteria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try choosing another category or clearing your search.</p>
          </div>
        ) : (
          filteredQuizzes.map(quiz => {
            const isCourseQuiz = Boolean(quiz.courseId);
            const course = isCourseQuiz ? courses.find(c => c.id === quiz.courseId) : undefined;
            const completedReels = isCourseQuiz && quiz.courseId ? completedCourseReels[quiz.courseId] || [] : [];
            const isCourseUnlocked = !isCourseQuiz || completedReels.length >= 5;

            // Company or Category Badge Styling
            let badgeColor = 'bg-blue-600 text-white';
            let icon = <Code2 size={14} />;

            if (quiz.company === 'Google') {
              badgeColor = 'bg-red-600 text-white';
              icon = <Building2 size={14} />;
            } else if (quiz.company === 'Amazon') {
              badgeColor = 'bg-amber-600 text-white';
              icon = <Building2 size={14} />;
            } else if (quiz.company === 'Microsoft') {
              badgeColor = 'bg-sky-600 text-white';
              icon = <Building2 size={14} />;
            } else if (quiz.company === 'Meta') {
              badgeColor = 'bg-indigo-600 text-white';
              icon = <Building2 size={14} />;
            } else if (quiz.category === 'Quantitative Aptitude') {
              badgeColor = 'bg-purple-600 text-white';
              icon = <Calculator size={14} />;
            } else if (quiz.category === 'Logical Reasoning') {
              badgeColor = 'bg-emerald-600 text-white';
              icon = <Brain size={14} />;
            } else if (isCourseQuiz) {
              badgeColor = 'bg-teal-600 text-white';
              icon = <BookOpen size={14} />;
            }

            return (
              <div
                key={quiz.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Company Badge & Status */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-xs ${badgeColor}`}>
                        {icon}
                        <span>{quiz.company || quiz.category}</span>
                      </span>

                      {quiz.targetRole && (
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          {quiz.targetRole}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCourseUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <Unlock size={11} /> Unlocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 text-[10px] font-bold flex items-center gap-1">
                          <Lock size={11} /> Locked ({completedReels.length}/5 Reels)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {quiz.description || 'Test your technical and conceptual understanding on key interview questions.'}
                    </p>
                  </div>

                  {/* Course Reel Prerequisite Bar if applicable */}
                  {isCourseQuiz && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <span>Course Reels Completed:</span>
                        <span className={isCourseUnlocked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
                          {completedReels.length} / 5 Reels Watched
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCourseUnlocked ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, (completedReels.length / 5) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Metrics Row */}
                  <div className="grid grid-cols-4 gap-2 text-center pt-1">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Questions</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{quiz.questions.length} Qs</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Time</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{quiz.durationMinutes || 15} mins</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Pass Score</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{quiz.passingPercentage}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Reward</span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-300">+{quiz.rewardXp || 200} XP</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Difficulty: <strong className="text-slate-700 dark:text-slate-200">{quiz.difficulty}</strong>
                  </span>

                  {isCourseUnlocked ? (
                    <button
                      onClick={() => handleLaunchQuiz(quiz)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Zap size={14} />
                      <span>{isCourseQuiz ? 'Take Course Quiz' : 'Start Interview Assessment'}</span>
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLaunchQuiz(quiz)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock size={13} />
                      <span>Watch 5 Reels to Unlock</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assessment History */}
      {assessmentHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Assessment Attempt History
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {assessmentHistory.length} Attempt{assessmentHistory.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2.5">
            {assessmentHistory.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  {item.passed ? (
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle size={18} className="text-rose-600 dark:text-rose-400" />
                  )}
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 block font-bold">
                      {item.passed ? 'Assessment Passed' : 'Assessment Incomplete'}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Attempted: {new Date(item.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-bold block text-sm ${item.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {item.scorePercentage}%
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.correctCount} of {item.totalQuestions} Correct
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Course Quiz Modal */}
      {selectedQuizPair && (
        <CourseQuizModal
          quiz={selectedQuizPair.quiz}
          course={selectedQuizPair.course || {
            id: 'interview-prep',
            title: selectedQuizPair.quiz.title,
            subtitle: selectedQuizPair.quiz.targetRole || 'Interview Preparation',
            description: selectedQuizPair.quiz.description || 'Master interview assessments.',
            category: selectedQuizPair.quiz.category || 'Interview',
            level: selectedQuizPair.quiz.difficulty,
            instructorId: 'faculty-interview',
            instructorName: selectedQuizPair.quiz.company || 'Technical Faculty',
            instructorBio: 'Senior Technical Interview Panel',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
            price: 0,
            discountedPrice: 0,
            rating: 5.0,
            reviewsCount: 0,
            studentsCount: 0,
            status: 'published',
            progressPercent: 0,
            durationHours: 1,
            lessonsCount: 1,
            reelsCount: 0,
            quizzesCount: 1,
            assignmentsCount: 0,
            modules: [],
            learningOutcomes: ['Ace technical coding rounds', 'Master problem-solving patterns'],
            createdAt: new Date().toISOString()
          }}
          isOpen={true}
          onClose={() => setSelectedQuizPair(null)}
        />
      )}
    </div>
  );
};
