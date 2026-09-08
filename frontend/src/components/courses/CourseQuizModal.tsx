import React, { useState, useEffect } from 'react';
import { Quiz, Course, Question, AssessmentResult, Badge } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  Zap,
  Clock,
  TrendingUp,
  X,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseQuizModalProps {
  quiz: Quiz;
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseQuizModal: React.FC<CourseQuizModalProps> = ({
  quiz,
  course,
  isOpen,
  onClose
}) => {
  const {
    currentUser,
    awardCourseBadge,
    submitAssessmentAnswers,
    showToast,
    adminSettings
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<AssessmentResult | null>(null);
  const [awardedBadge, setAwardedBadge] = useState<Badge | null>(null);

  const questions: Question[] = quiz.questions || [];

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(120);
      setShowResult(false);
      setResultData(null);
      setAwardedBadge(null);
    }
  }, [isOpen, quiz.id]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, showResult, selectedAnswers, questions]);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (currentQ) {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQ.id]: index
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const getBadgeForCourseOrQuiz = (): Badge => {
    if (course.id === 'course-yt-cs50') {
      return {
        id: 'badge-cs50-master',
        title: 'CS50x Computer Science Master',
        description: 'Passed the Harvard CS50x mastery assessment with distinction.',
        icon: '🎓',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-java') {
      return {
        id: 'badge-java-specialist',
        title: 'Java 21 Enterprise Specialist',
        description: 'Mastered JVM bytecode, virtual threads & high-concurrency systems.',
        icon: '☕',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-yt-fullstack') {
      return {
        id: 'badge-fullstack-master',
        title: 'Full Stack Master 2026',
        description: 'Completed full stack React 19 & Node.js architecture certification.',
        icon: '💻',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic'
      };
    }
    if (course.id === 'course-yt-ml') {
      return {
        id: 'badge-ai-ml-specialist',
        title: 'Machine Learning Specialist',
        description: 'Mastered gradient descent, neural networks and regularization.',
        icon: '🤖',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-udemy-web') {
      return {
        id: 'badge-web-bootcamp',
        title: 'Web Development Bootcamp Master',
        description: 'Completed the Complete 2026 Web Development curriculum.',
        icon: '🌐',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic'
      };
    }
    if (course.id === 'course-udemy-aws') {
      return {
        id: 'badge-aws-solutions',
        title: 'AWS Solutions Architect Associate',
        description: 'Certified in resilient AWS cloud infrastructure design.',
        icon: '☁️',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-udemy-dsa') {
      return {
        id: 'badge-dsa-master',
        title: 'DSA & Algorithms Master',
        description: 'Mastered advanced data structures & algorithms.',
        icon: '⚡',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-coursera-dl') {
      return {
        id: 'badge-deep-learning',
        title: 'Deep Learning Pioneer',
        description: 'Deep Learning Specialization certified.',
        icon: '🧠',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-coursera-gcp') {
      return {
        id: 'badge-gcp-architect',
        title: 'Google Cloud Certified Architect',
        description: 'Enterprise Google Cloud solutions certified.',
        icon: '🛡️',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-coursera-meta') {
      return {
        id: 'badge-meta-frontend',
        title: 'Meta Front-End Certified Specialist',
        description: 'Official Meta Front-End curriculum verified.',
        icon: '🚀',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (course.id === 'course-edx-mit') {
      return {
        id: 'badge-mit-python',
        title: 'MIT Python Specialist',
        description: 'Completed MIT 6.00.1x computational programming.',
        icon: '🐍',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (quiz.id === 'quiz-google-swe' || quiz.company === 'Google') {
      return {
        id: 'badge-google-ready',
        title: 'Google Interview Ready',
        description: 'Passed Google SWE technical engineering round.',
        icon: '🏆',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (quiz.id === 'quiz-amazon-sde' || quiz.company === 'Amazon') {
      return {
        id: 'badge-amazon-ready',
        title: 'Amazon AWS Interview Ready',
        description: 'Passed Amazon SDE & Cloud Systems technical round.',
        icon: '📦',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (quiz.id === 'quiz-microsoft-swe' || quiz.company === 'Microsoft') {
      return {
        id: 'badge-microsoft-ready',
        title: 'Microsoft Interview Ready',
        description: 'Passed Microsoft OOP & Concurrency assessment.',
        icon: '🪟',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (quiz.id === 'quiz-meta-fe' || quiz.company === 'Meta') {
      return {
        id: 'badge-meta-fe-master',
        title: 'Meta Front-End Master',
        description: 'Passed Meta UI & React 19 architecture round.',
        icon: '♾️',
        unlockedAt: new Date().toISOString(),
        rarity: 'legendary'
      };
    }
    if (quiz.id === 'quiz-quant-aptitude' || quiz.category === 'Quantitative Aptitude') {
      return {
        id: 'badge-quant-champion',
        title: 'Quantitative Aptitude Champion',
        description: 'Scored top marks in speed math & numerical reasoning.',
        icon: '🎯',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic'
      };
    }
    if (quiz.id === 'quiz-logical-reasoning' || quiz.category === 'Logical Reasoning') {
      return {
        id: 'badge-logic-expert',
        title: 'Logical Reasoning Expert',
        description: 'Mastered critical thinking & placement deductions.',
        icon: '💡',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic'
      };
    }

    return {
      id: `badge-${quiz.id || course.id}-${Date.now()}`,
      title: `${course.title || quiz.title} Mastery Badge`,
      description: `Demonstrated mastery in ${course.title || quiz.title}.`,
      icon: '🏅',
      unlockedAt: new Date().toISOString(),
      rarity: 'epic'
    };
  };

  const handleSubmitQuiz = () => {
    if (questions.length === 0) return;

    let correctCount = 0;
    const answeredMap: Record<string, number> = {};

    questions.forEach(q => {
      const selected = selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1;
      answeredMap[q.id] = selected;
      if (selected === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passingThreshold = adminSettings.passingScoreThreshold || 70;
    const isPassed = scorePercentage >= passingThreshold;

    let badgeEarned: Badge | null = null;
    if (isPassed) {
      badgeEarned = getBadgeForCourseOrQuiz();
      awardCourseBadge(badgeEarned, course.id);
      setAwardedBadge(badgeEarned);
    }

    const result: AssessmentResult = {
      id: `result-${Date.now()}`,
      userId: currentUser.id,
      reelIds: [],
      scorePercentage,
      passed: isPassed,
      totalQuestions: questions.length,
      correctCount,
      completedAt: new Date().toISOString(),
      rewardsEarned: {
        points: scorePercentage,
        badge: badgeEarned || undefined
      }
    };

    setResultData(result);
    setShowResult(true);

    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      showToast(`Quiz Passed! Score: ${scorePercentage}% • Badge Awarded: "${badgeEarned?.title}"`, 'success');
    } else {
      showToast(`Quiz Score: ${scorePercentage}%. Minimum required is ${passingThreshold}%.`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Zap size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
                {course.title} • Milestone Quiz
              </span>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {quiz.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showResult && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
                <Clock size={13} className={timeLeft < 30 ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {showResult && resultData ? (
            /* Results View */
            <div className="space-y-6 text-center py-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-lg ${
                resultData.passed ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'
              }`}>
                {resultData.passed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  {resultData.passed ? 'Assessment Passed!' : 'Requires Review'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {resultData.passed
                    ? 'Congratulations! You demonstrated strong conceptual understanding of the course principles.'
                    : `You scored ${resultData.scorePercentage}%. Review the course reels and try again.`}
                </p>
              </div>

              {/* Score Tile */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                  <strong className={`text-base font-bold ${resultData.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {resultData.scorePercentage}%
                  </strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Correct</span>
                  <strong className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {resultData.correctCount} / {resultData.totalQuestions}
                  </strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <strong className={`text-xs font-bold uppercase ${resultData.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {resultData.passed ? 'Passed' : 'Failed'}
                  </strong>
                </div>
              </div>

              {/* Milestone Badge Award Banner (Matches Image 2) */}
              {resultData.passed && awardedBadge && (
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex items-center gap-3.5 text-left max-w-md mx-auto animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl shrink-0">
                    {awardedBadge.icon}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block flex items-center gap-1.5">
                      <Award size={14} /> Milestone Badge Awarded: {awardedBadge.title}
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      {awardedBadge.description} Your verified badge has been credited to your profile and achievements gallery.
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setTimeLeft(120);
                    setShowResult(false);
                    setResultData(null);
                    setAwardedBadge(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : currentQ ? (
            /* Active Quiz Question View */
            <div className="space-y-6">
              {/* Question Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-xs font-semibold leading-relaxed">{option}</span>
                      </div>
                      {isSelected && <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQ.id] === undefined}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              No questions found for this quiz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
