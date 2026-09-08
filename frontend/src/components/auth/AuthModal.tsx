import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import {
  GraduationCap,
  ArrowRight,
  Mail,
  Lock,
  User,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Shield,
  Briefcase,
  Award,
  BookOpen,
  Loader2,
  Check,
  Zap,
  Sparkles,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    authLogin,
    authRegisterLearner,
    authMentorApply,
    forgotPassword,
    showToast
  } = useApp();

  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'learner' | 'mentor'>('learner');

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem('lms_remember_me') === 'true';
  });
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Learner Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regTerms, setRegTerms] = useState(false);
  const [regError, setRegError] = useState('');

  // Mentor Apply Form State
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorPassword, setMentorPassword] = useState('');
  const [showMentorPassword, setShowMentorPassword] = useState(false);
  const [mentorExpertise, setMentorExpertise] = useState('');
  const [mentorExperience, setMentorExperience] = useState('3');
  const [mentorBio, setMentorBio] = useState('');
  const [mentorPortfolio, setMentorPortfolio] = useState('');
  const [mentorTerms, setMentorTerms] = useState(false);
  const [mentorError, setMentorError] = useState('');
  const [mentorSuccess, setMentorSuccess] = useState(false);

  // Forgot Password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Policy Modals
  const [policyModal, setPolicyModal] = useState<'terms' | 'privacy' | null>(null);

  // Bot Verification (Quick Check)
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!regPassword) return { score: 0, label: '', color: '', width: '0%' };
    let score = 0;
    if (regPassword.length >= 6) score++;
    if (regPassword.length >= 8) score++;
    if (/[A-Z]/.test(regPassword)) score++;
    if (/[0-9]/.test(regPassword)) score++;
    if (/[^A-Za-z0-9]/.test(regPassword)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500 text-rose-500', width: '25%' };
    if (score === 3) return { score: 2, label: 'Fair', color: 'bg-amber-500 text-amber-500', width: '50%' };
    if (score === 4) return { score: 3, label: 'Good', color: 'bg-blue-500 text-blue-500', width: '75%' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500 text-emerald-500', width: '100%' };
  }, [regPassword]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalTab || 'login');
      setLoginError('');
      setRegError('');
      setMentorError('');
      setMentorSuccess(false);
      setShowForgotPassword(false);
      setForgotSubmitted(false);
      setIsSubmitting(false);
      setIsHumanVerified(false);

      const savedEmail = localStorage.getItem('lms_remembered_email');
      if (savedEmail) {
        setLoginEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [isAuthModalOpen, authModalTab]);

  if (!isAuthModalOpen) return null;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    if (!isHumanVerified) {
      setLoginError('Please check the verification box to proceed.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authLogin(loginEmail.trim(), loginPassword);
      if (rememberMe) {
        localStorage.setItem('lms_remember_me', 'true');
        localStorage.setItem('lms_remembered_email', loginEmail.trim());
      } else {
        localStorage.removeItem('lms_remember_me');
        localStorage.removeItem('lms_remembered_email');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Learner Register
  const handleLearnerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('All fields are required.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters in length.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    if (!regTerms) {
      setRegError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (!isHumanVerified) {
      setRegError('Please check the verification box to proceed.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authRegisterLearner({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword
      });
    } catch (err: any) {
      setRegError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Mentor Application
  const handleMentorApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setMentorError('');

    if (!mentorName.trim() || !mentorEmail.trim() || !mentorPassword) {
      setMentorError('Name, email, and password are required.');
      return;
    }

    if (mentorPassword.length < 6) {
      setMentorError('Password must be at least 6 characters.');
      return;
    }

    if (!mentorExpertise.trim()) {
      setMentorError('Please specify your domain expertise.');
      return;
    }

    if (!mentorBio.trim()) {
      setMentorError('Please write a brief summary of your teaching background.');
      return;
    }

    if (!mentorTerms) {
      setMentorError('You must agree to the Mentor Code of Conduct & Terms.');
      return;
    }

    if (!isHumanVerified) {
      setMentorError('Please check the verification box to proceed.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authMentorApply({
        name: mentorName.trim(),
        email: mentorEmail.trim(),
        password: mentorPassword,
        expertise: mentorExpertise.trim(),
        experienceYears: parseInt(mentorExperience) || 3,
        bio: mentorBio.trim(),
        portfolioUrl: mentorPortfolio.trim() || undefined
      });
      setMentorSuccess(true);
    } catch (err: any) {
      setMentorError(err.message || 'Failed to submit mentor application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    try {
      setIsSubmitting(true);
      await forgotPassword(forgotEmail.trim());
      setForgotSubmitted(true);
    } catch (err: any) {
      setLoginError(err.message || 'Failed to dispatch reset instructions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 dark:bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto transition-all">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 sm:p-6 text-white text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-md shadow-inner">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-display">LMS Platform</h3>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            {activeTab === 'login' ? 'Sign in to access your dashboard' : 'Create an account to begin your journey'}
          </p>

          {/* Tab Switcher */}
          <div className="mt-5 flex bg-black/20 p-1 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => {
                setActiveTab('login');
                setShowForgotPassword(false);
                setLoginError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'login' && !showForgotPassword
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setShowForgotPassword(false);
                setRegError('');
                setMentorError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'register' && !showForgotPassword
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
          {/* ================= FORGOT PASSWORD VIEW ================= */}
          {showForgotPassword ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Reset Your Password</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter the email address registered with your LMS account.
                </p>
              </div>

              {forgotSubmitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">Instructions Dispatched</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    If an account is associated with <strong>{forgotEmail}</strong>, you will receive password reset instructions shortly.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotSubmitted(false);
                    }}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !forgotEmail.trim()}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : activeTab === 'login' ? (
            /* ================= SIGN IN VIEW ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold block">Authentication Error</strong>
                    <span>{loginError}</span>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between py-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300 select-none hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setForgotEmail(loginEmail);
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Human Verification */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-200 select-none">
                  <input
                    type="checkbox"
                    checked={isHumanVerified}
                    onChange={e => setIsHumanVerified(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>I am not a robot</span>
                </label>
                <Shield className="w-4 h-4 text-slate-400" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !loginEmail.trim() || !loginPassword}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>



              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setRegError('');
                      setMentorError('');
                    }}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ================= CREATE ACCOUNT (DUAL PATH: LEARNER vs MENTOR) ================= */
            <div className="space-y-4">
              {/* Account Type Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType('learner');
                    setRegError('');
                    setMentorError('');
                  }}
                  className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    accountType === 'learner'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className={`w-4 h-4 ${accountType === 'learner' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">Learner</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Instant access to courses</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccountType('mentor');
                    setRegError('');
                    setMentorError('');
                  }}
                  className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    accountType === 'mentor'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className={`w-4 h-4 ${accountType === 'mentor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">Mentor</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Apply for teaching portal</p>
                </button>
              </div>

              {/* ============ LEARNER REGISTRATION ============ */}
              {accountType === 'learner' ? (
                <form onSubmit={handleLearnerRegister} className="space-y-3.5">
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl flex items-start gap-2.5 text-blue-800 dark:text-blue-200 text-xs">
                    <Award className="w-4 h-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <strong className="font-semibold block">Learner Account Benefits</strong>
                      <span>Learn courses, watch 9:16 reels, take quizzes & assignments, and earn verified credentials.</span>
                    </div>
                  </div>

                  {regError && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Password & Strength Indicator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                      {regPassword && (
                        <span className={`text-[10px] font-bold ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Create a strong password (min 6 chars)"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {regPassword && (
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score === 1
                              ? 'bg-rose-500'
                              : passwordStrength.score === 2
                              ? 'bg-amber-500'
                              : passwordStrength.score === 3
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-type your password"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={regTerms}
                      onChange={e => setRegTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setPolicyModal('terms')}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => setPolicyModal('privacy')}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>

                  {/* Human Verification */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-200 select-none">
                      <input
                        type="checkbox"
                        checked={isHumanVerified}
                        onChange={e => setIsHumanVerified(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>I am not a robot</span>
                    </label>
                    <Shield className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !regName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword || !regTerms}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Learner Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Learner Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ============ MENTOR APPLICATION ============ */
                mentorSuccess ? (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                        Application Submitted for Review
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        Your mentor application has been submitted successfully and is awaiting administrator review. Once approved, you will receive full access to the Mentor Studio.
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left text-xs space-y-1">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Applicant:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{mentorName}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Email:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{mentorEmail}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Status:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px] bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          Pending Review
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMentorSuccess(false);
                        setActiveTab('login');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMentorApply} className="space-y-3.5">
                    <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-amber-900 dark:text-amber-200 text-xs">
                      <Shield className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <div>
                        <strong className="font-semibold block">Faculty Verification Notice</strong>
                        <span>Mentor accounts require administrator review and approval before teaching access is unlocked.</span>
                      </div>
                    </div>

                    {mentorError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{mentorError}</span>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={mentorName}
                        onChange={e => setMentorName(e.target.value)}
                        placeholder="e.g. Dr. Sarah Connor"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official / Institutional Email</label>
                      <input
                        type="email"
                        required
                        value={mentorEmail}
                        onChange={e => setMentorEmail(e.target.value)}
                        placeholder="s.connor@university.edu"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Password</label>
                      <div className="relative">
                        <input
                          type={showMentorPassword ? 'text' : 'password'}
                          required
                          value={mentorPassword}
                          onChange={e => setMentorPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMentorPassword(!showMentorPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                        >
                          {showMentorPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Domain & Experience */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Domain</label>
                        <input
                          type="text"
                          required
                          value={mentorExpertise}
                          onChange={e => setMentorExpertise(e.target.value)}
                          placeholder="e.g. Java, Cloud, DevOps"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Years Experience</label>
                        <select
                          value={mentorExperience}
                          onChange={e => setMentorExperience(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                        >
                          <option value="1">1-2 Years</option>
                          <option value="3">3-5 Years</option>
                          <option value="6">6-10 Years</option>
                          <option value="10">10+ Years</option>
                        </select>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Bio & Teaching Background</label>
                      <textarea
                        required
                        rows={2}
                        value={mentorBio}
                        onChange={e => setMentorBio(e.target.value)}
                        placeholder="Summarize your engineering background and course focus..."
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Portfolio / LinkedIn */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio or LinkedIn URL (Optional)</label>
                      <input
                        type="url"
                        value={mentorPortfolio}
                        onChange={e => setMentorPortfolio(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Agreement Checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={mentorTerms}
                        onChange={e => setMentorTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>I agree to the LMS Faculty Code of Conduct, curriculum standards, and terms.</span>
                    </label>

                    {/* Human Verification */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-200 select-none">
                        <input
                          type="checkbox"
                          checked={isHumanVerified}
                          onChange={e => setIsHumanVerified(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>I am not a robot</span>
                      </label>
                      <Shield className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !mentorName.trim() || !mentorEmail.trim() || !mentorPassword || !mentorExpertise.trim() || !mentorBio.trim() || !mentorTerms}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Mentor Application</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Policy Modal Overlay */}
      {policyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-base font-bold font-display">
                {policyModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h4>
              <button
                onClick={() => setPolicyModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 max-h-60 overflow-y-auto pr-2 leading-relaxed">
              <p>
                By creating an account on the LMS Platform, you agree to uphold academic integrity, engage in respectful educational discussions, and follow curriculum guidelines.
              </p>
              <p>
                Your personal data is encrypted and securely maintained in accordance with enterprise data protection standards.
              </p>
            </div>
            <button
              onClick={() => setPolicyModal(null)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
