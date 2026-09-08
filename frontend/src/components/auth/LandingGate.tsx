import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  PlaySquare,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Check,
  HelpCircle,
  FileCheck2,
  Lock,
  Unlock,
  Eye,
  Star,
  Users,
  Clock,
  Layers,
  Menu,
  X,
  ChevronRight,
  Shield,
  Play,
  FileText,
  ExternalLink,
  Laptop,
  Sun,
  Moon,
  Zap,
  KeyRound
} from 'lucide-react';

export const LandingGate: React.FC = () => {
  const { openAuthModal, courses, reels } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const featuredCourses = courses.slice(0, 3);
  const featuredReels = reels.filter(r => r.isPublished).slice(0, 3);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-200 transition-colors duration-150">
      {/* ===================================================
          1. HEADER / NAVIGATION (STICKY TOP)
      =================================================== */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* LMS Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <span className="text-lg font-black text-white font-display">L</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white font-display">LMS</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                PLATFORM
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('reels')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Reels
            </button>
            <button
              onClick={() => scrollToSection('achievements')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Credentials
            </button>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Global Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-2xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('courses')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('reels')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Learning Reels
              </button>
              <button
                onClick={() => scrollToSection('achievements')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Badges & Certificates
              </button>
              <button
                onClick={() => scrollToSection('mentors')}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                For Mentors
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs text-center shadow-xs cursor-pointer"
              >
                Get Started — Create Account
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs text-center cursor-pointer"
              >
                Sign In to Existing Account
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================
          2. HERO SECTION
      =================================================== */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs">
            <Sparkles size={14} className="text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>CONNECTED LEARNING PLATFORM</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight font-display leading-[1.12] max-w-4xl mx-auto">
            LEARN SMARTER.<br />
            BUILD SKILLS.<br />
            <span className="text-blue-600 dark:text-blue-400">GET RECOGNIZED.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Build practical skills through structured courses, engaging learning reels, quizzes and assignments — and earn badges and certificates as you progress.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Learning</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('courses')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Explore Courses
            </button>
          </div>

          {/* Sign In link */}
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Already have an account?{' '}
            <button
              onClick={() => openAuthModal('login')}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Sign In here
            </button>
          </p>



          {/* ===================================================
              3. HERO PRODUCT PREVIEW VISUAL
          =================================================== */}
          <div className="pt-8 sm:pt-12 max-w-3xl mx-auto">
            <div className="relative p-5 sm:p-7 rounded-3xl bg-slate-900 dark:bg-slate-900 text-white border border-slate-800 shadow-2xl text-left overflow-hidden">
              {/* Top Bar of Preview */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">LMS Learning Workspace</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Active Enrollment
                </span>
              </div>

              {/* Card Body */}
              <div className="pt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Continue Learning</span>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
                      Java Core & Modern Enterprise Architecture
                    </h3>
                  </div>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Curriculum Progress</span>
                    <span className="text-blue-400 font-bold">100% Completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 w-full" />
                  </div>
                </div>

                {/* Bottom Badges Preview */}
                <div className="pt-2 grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Status</span>
                    <span className="text-xs font-bold text-emerald-400">Completed</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Assessment</span>
                    <span className="text-xs font-bold text-blue-400">Quiz Ready</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Credential</span>
                    <span className="text-xs font-bold text-amber-400">Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. STATS BAR
      =================================================== */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">100%</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Hands-on Curriculum</p>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-display">9:16</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Mobile Educational Reels</p>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">1:1</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Verified Mentor Review</p>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-display">Instant</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Verified Credentials</p>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. HOW IT WORKS SECTION
      =================================================== */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Structured Roadmap
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              HOW LMS PLATFORM WORKS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A proven 4-step learning architecture taking you from fundamentals to verifiable mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-200 dark:border-blue-800">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Learn in Modules</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Watch bite-sized 9:16 vertical learning reels and complete comprehensive masterclass modules.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-200 dark:border-blue-800">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Validate with Quizzes</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Test your understanding with topic-specific quizzes with instant scoring and explanations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-200 dark:border-blue-800">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Submit Assignments</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Apply your skills with practical projects reviewed and graded directly by expert mentors.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Earn Credentials</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlock official course completion certificates and verifiable badges to showcase on LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          6. FEATURED COURSES SECTION
      =================================================== */}
      <section id="courses" className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Curriculum Catalog
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                FEATURED MASTERCLASSES
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Industry-crafted courses designed for direct career advancement.
              </p>
            </div>

            <button
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>View All Courses</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <div
                key={course.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between">
                      <span>{course.level} Level</span>
                      <span>5 Vertical Reels</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center">
                        {course.instructorName.charAt(0)}
                      </div>
                      <span className="truncate">{course.instructorName}</span>
                    </div>
                  </div>
                </div>

                {/* Footer button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>View Course</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          7. LEARNING REELS SECTION (9:16 VERTICAL VIDEO)
      =================================================== */}
      <section id="reels" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Short-Form Learning Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              LEARN IN SHORT, ENGAGING SESSIONS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Turn small moments into meaningful learning with focused educational reels designed in modern 9:16 format.
            </p>
          </div>

          {/* 3 Vertical 9:16 Reel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {featuredReels.map((reel, idx) => (
              <div
                key={reel.id}
                onClick={() => openAuthModal('login')}
                className="group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[9/15] max-w-[280px] w-full mx-auto border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between p-4"
              >
                {/* Background poster */}
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                    Reel {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {reel.durationSeconds || 55}s
                  </span>
                </div>

                {/* Center Play Button Icon */}
                <div className="relative z-10 self-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-lg">
                    <Play size={20} className="translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                    {reel.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                    {reel.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 pt-0.5">
                    {reel.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <PlaySquare size={16} />
              <span>Explore Learning Reels</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          8. QUIZZES & ASSIGNMENTS SECTION
      =================================================== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Evaluation & Feedback
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                QUIZZES & REAL ASSIGNMENTS
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Validate your knowledge at each milestone with automated interactive quizzes and faculty-reviewed project assignments.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <Check size={16} />
                </div>
                <div>
                  <strong className="text-sm text-slate-900 dark:text-white block font-bold">Concept Check Quizzes</strong>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Instant grading, multiple-choice questions, and detailed answer explanations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <Check size={16} />
                </div>
                <div>
                  <strong className="text-sm text-slate-900 dark:text-white block font-bold">Practical Project Submissions</strong>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Submit GitHub repositories or code archives for direct mentor code review.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <Check size={16} />
                </div>
                <div>
                  <strong className="text-sm text-slate-900 dark:text-white block font-bold">Actionable Faculty Feedback</strong>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Receive precise rubric scoring and suggestions for code quality improvements.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  Q1
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Interactive Assessment</span>
                  <strong className="text-xs text-slate-900 dark:text-white">Java OOP Fundamentals</strong>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Score: 100%
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Which principle of OOP is primarily demonstrated by method overriding in subclass hierarchies?
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                A) Data Encapsulation
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 text-xs text-blue-900 dark:text-blue-200 font-bold flex items-center justify-between">
                <span>B) Dynamic Polymorphism</span>
                <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                C) Static Coupling
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          9. BADGES & VERIFIED CERTIFICATES SECTION
      =================================================== */}
      <section id="achievements" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Career Credentials
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              PROVE YOUR ACCOMPLISHMENTS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Earn verified milestone badges and official certificates to demonstrate your verified engineering competencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Badges Preview Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Milestone Badges</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Awarded as you complete milestones and quizzes</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold text-xs">
                    🎓
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block font-bold">Course Master</strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Earned</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block font-bold">Quiz Champion</strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Earned</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center font-bold text-xs">
                    🏆
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block font-bold">Architecture Lead</strong>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block">In Progress</span>
                </div>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <FileCheck2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Official Certificate</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Issued upon 100% curriculum and quiz completion</p>
                </div>
              </div>

              {/* Certificate Mock Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 text-[10px]">ID: LMS-JAVA-2026-001</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                    VERIFIED
                  </span>
                </div>
                <div>
                  <strong className="text-sm text-slate-900 dark:text-white font-bold block">Certificate of Specialization</strong>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Java Core & Modern Enterprise Architecture</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Recipient: Verified Learner</span>
                  <span>Issued: August 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          10. LEARNER BENEFITS
      =================================================== */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Why Learners Choose LMS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              DESIGNED FOR ENGAGEMENT
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every detail is engineered to keep you focused, motivated, and steadily improving.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Laptop size={20} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Learn Anywhere</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Responsive layouts designed specifically for mobile, tablet, and widescreen desktop monitors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <PlaySquare size={20} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Bite-Sized Modules</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Master complex engineering patterns in structured 5-minute video capsules without overwhelm.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Faculty Mentorship</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get direct feedback from industry professionals who review your project assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          11. BECOME A MENTOR SECTION
      =================================================== */}
      <section id="mentors" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 lg:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Faculty & Instructors
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
                SHARE YOUR EXPERTISE AS A MENTOR
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Publish masterclasses, create educational reels, review student assignments, and nurture the next generation of engineers.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Curriculum Studio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Assignment Grading</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Track Student Progress</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto text-center">
              <button
                onClick={() => openAuthModal('register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Become a Mentor</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          12. FINAL CALL-TO-ACTION SECTION
      =================================================== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-blue-600 dark:bg-blue-700 text-white px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight">
            YOUR NEXT SKILL STARTS HERE.
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Start learning today and turn your progress into real, verifiable achievements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Learning</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('courses')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 border border-blue-400 text-white font-bold text-sm transition-all cursor-pointer"
            >
              Explore Courses
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          13. FOOTER
      =================================================== */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-150">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <span className="font-black text-base text-slate-900 dark:text-white font-display">LMS PLATFORM</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              An integrated modern learning platform combining structured masterclasses, short vertical reels, quizzes, and verifiable credential certification.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <strong className="text-slate-900 dark:text-white font-bold uppercase tracking-wider block text-[11px]">Platform</strong>
            <ul className="space-y-2">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('courses')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Courses
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('reels')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Learning Reels
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Mentors */}
          <div className="space-y-2.5">
            <strong className="text-slate-900 dark:text-white font-bold uppercase tracking-wider block text-[11px]">Mentors</strong>
            <ul className="space-y-2">
              <li>
                <button onClick={() => openAuthModal('register')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Become a Mentor
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('login')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Faculty Portal
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('register')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Course Creation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Support */}
          <div className="space-y-2.5">
            <strong className="text-slate-900 dark:text-white font-bold uppercase tracking-wider block text-[11px]">Account</strong>
            <ul className="space-y-2">
              <li>
                <button onClick={() => openAuthModal('login')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Sign In
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('register')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Create Learner Account
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('login')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Forgot Password
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} LMS Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Security Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
