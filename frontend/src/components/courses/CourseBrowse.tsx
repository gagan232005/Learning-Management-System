import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  BookOpen,
  Search,
  Star,
  Users,
  ChevronRight,
  GraduationCap,
  PlaySquare,
  Sparkles,
  ExternalLink,
  Youtube,
  Award,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CourseDetailsModal } from './CourseDetailsModal';

export const CourseBrowse: React.FC = () => {
  const { courses, currentUser, completedCourseReels } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'my-learning'>('browse');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'youtube' | 'udemy' | 'coursera' | 'edx' | 'lms'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = ['All', 'Web Dev', 'Python', 'AI & Engineering', 'DSA', 'Cloud', 'Java'];

  // Published courses only
  const publishedCourses = useMemo(() => courses.filter(c => c.status === 'published' || c.status === 'approved'), [courses]);
  const enrolledCourses = useMemo(() => courses.filter(c => currentUser.enrolledCourseIds.includes(c.id)), [courses, currentUser.enrolledCourseIds]);

  const targetCourses = activeTab === 'my-learning' ? enrolledCourses : publishedCourses;

  // Platform counts
  const ytCount = useMemo(() => publishedCourses.filter(c => c.platform === 'youtube' || c.platformUrl?.includes('youtube')).length, [publishedCourses]);
  const udemyCount = useMemo(() => publishedCourses.filter(c => c.platform === 'udemy' || c.platformUrl?.includes('udemy')).length, [publishedCourses]);
  const courseraCount = useMemo(() => publishedCourses.filter(c => c.platform === 'coursera' || c.platformUrl?.includes('coursera')).length, [publishedCourses]);
  const edxCount = useMemo(() => publishedCourses.filter(c => c.platform === 'edx' || c.platformUrl?.includes('edx')).length, [publishedCourses]);
  const lmsCount = useMemo(() => publishedCourses.filter(c => c.platform === 'lms' || (!c.platform && !c.platformUrl)).length, [publishedCourses]);

  const filteredCourses = useMemo(() => {
    return targetCourses.filter(course => {
      // Platform filter
      if (selectedPlatform !== 'all') {
        if (selectedPlatform === 'youtube' && course.platform !== 'youtube' && !course.platformUrl?.includes('youtube')) return false;
        if (selectedPlatform === 'udemy' && course.platform !== 'udemy' && !course.platformUrl?.includes('udemy')) return false;
        if (selectedPlatform === 'coursera' && course.platform !== 'coursera' && !course.platformUrl?.includes('coursera')) return false;
        if (selectedPlatform === 'edx' && course.platform !== 'edx' && !course.platformUrl?.includes('edx')) return false;
        if (selectedPlatform === 'lms' && course.platform !== 'lms' && course.platformUrl) return false;
      }

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        course.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Web Dev' && (course.category.toLowerCase().includes('web') || course.category.toLowerCase().includes('frontend')));

      // Search filter
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [targetCourses, selectedPlatform, selectedCategory, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Universal Courses Hub</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
              YouTube • Udemy • Coursera • edX • Verified LMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
            Explore Courses & Certifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Curated, industry-leading full courses and specializations from world-class universities and platforms including Harvard, Stanford, MIT, Google Cloud, Meta, and Verified LMS Faculty.
          </p>
        </div>

        {/* Tab Switcher: Browse Courses vs My Learning */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Browse Catalog ({publishedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('my-learning')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my-learning'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Enrolled ({enrolledCourses.length})
          </button>
        </div>
      </div>

      {/* Platform Source Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedPlatform === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Platforms ({publishedCourses.length})
        </button>

        <button
          onClick={() => setSelectedPlatform('youtube')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            selectedPlatform === 'youtube'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Youtube size={14} className={selectedPlatform === 'youtube' ? 'fill-white' : 'text-red-500'} />
          <span>YouTube ({ytCount})</span>
        </button>

        <button
          onClick={() => setSelectedPlatform('udemy')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            selectedPlatform === 'udemy'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-purple-500 text-white font-black text-[9px] flex items-center justify-center">
            U
          </div>
          <span>Udemy ({udemyCount})</span>
        </button>

        <button
          onClick={() => setSelectedPlatform('coursera')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            selectedPlatform === 'coursera'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white font-black text-[9px] flex items-center justify-center">
            C
          </div>
          <span>Coursera ({courseraCount})</span>
        </button>

        <button
          onClick={() => setSelectedPlatform('edx')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            selectedPlatform === 'edx'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
            e
          </div>
          <span>edX ({edxCount})</span>
        </button>

        <button
          onClick={() => setSelectedPlatform('lms')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            selectedPlatform === 'lms'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck size={14} className={selectedPlatform === 'lms' ? 'text-white' : 'text-emerald-500'} />
          <span>Verified LMS ({lmsCount})</span>
        </button>
      </div>

      {/* Category and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses, instructors, platforms..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <BookOpen size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No courses match your query</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try selecting another platform or category filter above.</p>
          </div>
        ) : (
          filteredCourses.map(course => {
            const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
            const userCompleted = completedCourseReels[course.id] || [];
            const progressPercent = Math.round((userCompleted.length / 5) * 100);

            // Determine Platform style and icon
            let platformBadge = {
              name: 'Verified LMS',
              bg: 'bg-emerald-600',
              border: 'border-emerald-400/30',
              icon: <ShieldCheck size={12} className="text-white" />
            };

            if (course.platform === 'youtube' || course.platformUrl?.includes('youtube')) {
              platformBadge = {
                name: 'YouTube Masterclass',
                bg: 'bg-red-600',
                border: 'border-red-400/30',
                icon: <Youtube size={12} className="fill-white" />
              };
            } else if (course.platform === 'udemy' || course.platformUrl?.includes('udemy')) {
              platformBadge = {
                name: 'Udemy Bestseller',
                bg: 'bg-purple-600',
                border: 'border-purple-400/30',
                icon: <span className="font-black text-[10px]">U</span>
              };
            } else if (course.platform === 'coursera' || course.platformUrl?.includes('coursera')) {
              platformBadge = {
                name: 'Coursera Specialization',
                bg: 'bg-blue-600',
                border: 'border-blue-400/30',
                icon: <span className="font-black text-[10px]">C</span>
              };
            } else if (course.platform === 'edx' || course.platformUrl?.includes('edx')) {
              platformBadge = {
                name: 'edX Verified',
                bg: 'bg-rose-600',
                border: 'border-rose-400/30',
                icon: <span className="font-black text-[10px]">e</span>
              };
            }

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Thumbnail & Video Banner */}
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Top Badges: Platform Source + Category */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1.5 backdrop-blur-xs ${platformBadge.bg}`}>
                        {platformBadge.icon}
                        <span>{platformBadge.name}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-slate-200 backdrop-blur-xs border border-white/10">
                        {course.category}
                      </span>
                    </div>

                    {/* Top Right Price Tag */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-sm ${
                        course.price === 0
                          ? 'bg-emerald-500 text-white'
                          : 'bg-black/70 text-amber-300 backdrop-blur-xs border border-amber-300/30'
                      }`}>
                        {course.price === 0 ? 'FREE' : `$${course.discountedPrice || course.price}`}
                      </span>
                    </div>

                    {/* Bottom Metadata: Duration & Level */}
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Clock size={13} />
                        <span>{course.durationHours || 10} Hours</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold backdrop-blur-xs">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2.5">
                    {/* Instructor & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium truncate max-w-[180px]">
                        {course.instructorName}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={13} fill="currentColor" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{course.rating}</span>
                        <span className="text-[10px] text-slate-400">({course.studentsCount > 1000 ? `${(course.studentsCount / 1000).toFixed(0)}k+` : course.studentsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Certificate Badge */}
                    {course.certificateIncluded && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                        <Award size={13} />
                        <span>Official Certificate Included</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Progress / Action */}
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2">
                  {isEnrolled ? (
                    <div className="pt-3 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        <span>Course Progress</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>Explore Curriculum & Start</span>
                      <div className="flex items-center gap-1">
                        {course.platformUrl && <ExternalLink size={13} />}
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={true}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};
