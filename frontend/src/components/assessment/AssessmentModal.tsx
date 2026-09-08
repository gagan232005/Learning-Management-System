import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, AssessmentResult } from '../../types';
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
  X,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentModalProps {
  onNavigateToRewards?: () => void;
  onNavigateToProfile?: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  onNavigateToRewards,
  onNavigateToProfile
}) => {
  const {
    isAssessmentOpen,
    closeAssessment,
    getAssessmentQuestionsForUser,
    submitAssessmentAnswers,
    currentUser,
    isUserEligibleForMentor,
    showToast
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(90);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<AssessmentResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Initialize questions when modal opens
  useEffect(() => {
    if (isAssessmentOpen) {
      const qList = getAssessmentQuestionsForUser();
      setQuestions(qList);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft(90);
      setShowResult(false);
      setResultData(null);
    }
  }, [isAssessmentOpen]);

  // Timer tick
  useEffect(() => {
    if (!isAssessmentOpen || showResult) return;
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
  }, [isAssessmentOpen, showResult, selectedAnswers, questions]);

  if (!isAssessmentOpen) return null;

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

  const handleSubmitQuiz = () => {
    if (questions.length === 0) return;

    const result = submitAssessmentAnswers(selectedAnswers);
    setResultData(result);
    setShowResult(true);

    if (result.passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
      showToast(`Assessment Passed! Score: ${result.scorePercentage}%`, 'success');
    } else {
      showToast(`Score: ${result.scorePercentage}%. Minimum required is 80%.`, 'error');
    }
  };

  const isAnswered = currentQ && selectedAnswers[currentQ.id] !== undefined;
  const eligibility = isUserEligibleForMentor(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-2xs">
              <Zap size={16} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
                Automated Evaluation
              </span>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                5-Reel Assessment
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!showResult && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
                <Clock size={13} className={timeLeft < 20 ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
            )}
            <button
              onClick={closeAssessment}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!showResult ? (
            /* QUESTION SCREEN */
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

              {/* Question Card */}
              {currentQ && (
                <div className="space-y-4">
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
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
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
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* RESULTS SCREEN */
            <div className="space-y-6 animate-in fade-in">
              {resultData && (
                <>
                  {/* Score Card Hero */}
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-3 ${
                      resultData.passed
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-md ${
                        resultData.passed ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {resultData.passed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                    </div>

                    <div>
                      <span className="text-3xl font-black font-display text-slate-900 dark:text-white">
                        {resultData.scorePercentage}%
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {resultData.passed ? 'Assessment Passed! 🎉' : 'Assessment Incomplete'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        You answered {resultData.correctCount} out of {resultData.totalQuestions} questions correctly.
                        {resultData.passed
                          ? ' Minimum threshold (80%) satisfied. Milestone badge unlocked!'
                          : ' You need 80% to pass. Review the reels and retake anytime!'}
                      </p>
                    </div>
                  </div>

                  {/* Milestone Badge Credential Notification */}
                  {resultData.passed && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                        <Award size={20} />
                      </div>
                      <div>
                        <strong className="font-bold text-amber-900 dark:text-amber-200 block">
                          Milestone Badge Awarded: Quiz Champion
                        </strong>
                        <p className="text-amber-800 dark:text-amber-300 mt-0.5">
                          Your verified badge has been credited to your profile and achievements gallery.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mentor Eligibility Milestone */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs">
                    <UserCheck size={18} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Mentor Promotion Criteria:</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {eligibility.isEligible
                          ? '🎉 You have satisfied all mentor eligibility criteria! You can now apply for verified Mentor status.'
                          : eligibility.reason}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          {!showResult ? (
            <>
              <button
                onClick={closeAssessment}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Exit
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isAnswered
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Assessment'}</span>
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                  setTimeLeft(90);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={closeAssessment}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
