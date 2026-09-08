import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseReel } from '../../types';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Send,
  PlaySquare,
  ShieldCheck,
  Video
} from 'lucide-react';

interface MentorCreateCourseViewProps {
  onCourseCreated?: () => void;
}

export const MentorCreateCourseView: React.FC<MentorCreateCourseViewProps> = ({
  onCourseCreated
}) => {
  const { currentUser, createCourse, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Course Info
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI & Engineering');
  const [price, setPrice] = useState<number>(79);
  const [discountedPrice, setDiscountedPrice] = useState<number>(49);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Intermediate');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
  );

  // Step 2: Exactly 5 Vertical Reels
  const [courseReels, setCourseReels] = useState<CourseReel[]>([
    {
      id: `new-reel-1`,
      courseId: '',
      order: 1,
      title: 'Reel 1: Foundations & Architecture Setup',
      description: 'Environment bootstrap, core architectural patterns, and foundational concepts in 60s.',
      topic: 'Architecture - Fundamentals',
      durationSeconds: 54,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-2`,
      courseId: '',
      order: 2,
      title: 'Reel 2: Core Implementation & Deep Dive',
      description: 'Hands-on practical walkthrough, internals, and execution lifecycle.',
      topic: 'Architecture - Core Concepts',
      durationSeconds: 58,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-3`,
      courseId: '',
      order: 3,
      title: 'Reel 3: Advanced Patterns & Resiliency',
      description: 'Resilient architectural patterns, error handling, and production-grade best practices.',
      topic: 'Architecture - Patterns',
      durationSeconds: 52,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-4`,
      courseId: '',
      order: 4,
      title: 'Reel 4: Performance Profiling & Optimization',
      description: 'Profiling bottlenecks, memory optimization, caching strategies, and latency minimization.',
      topic: 'Architecture - Optimization',
      durationSeconds: 56,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-5`,
      courseId: '',
      order: 5,
      title: 'Reel 5: Production Deployment & Best Practices',
      description: 'Deploying to production, telemetry monitoring, real-world case studies, and certification readiness.',
      topic: 'Architecture - Production',
      durationSeconds: 60,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    }
  ]);

  const handleUpdateReel = (index: number, field: keyof CourseReel, val: any) => {
    const updated = [...courseReels];
    updated[index] = { ...updated[index], [field]: val };
    setCourseReels(updated);
  };

  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a course title.', 'error');
      return;
    }

    createCourse({
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      category,
      price: Number(price) || 49,
      discountedPrice: Number(discountedPrice) || 29,
      level,
      thumbnailUrl,
      reels: courseReels,
      instructorId: currentUser.id,
      instructorName: currentUser.name
    });

    showToast('Course created and submitted for admin review!', 'success');
    if (onCourseCreated) {
      onCourseCreated();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Course Builder</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
              5 Vertical Reels
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">Create Course</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Design an intensive 5-reel masterclass curriculum. Upon creation, courses undergo admin quality assurance before going live.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              currentStep === 1 ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            1. Metadata
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              currentStep === 2 ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            2. 5 Reels
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              currentStep === 3 ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            3. Review & Submit
          </button>
        </div>
      </div>

      {/* STEP 1: COURSE METADATA & PRICING */}
      {currentStep === 1 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 animate-in fade-in transition-colors">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
            <span>Course Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Course Title *</label>
              <input
                type="text"
                placeholder="e.g. Distributed Systems Architecture & Event Streaming"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Subtitle / Catchphrase</label>
              <input
                type="text"
                placeholder="From Kafka, Event Sourcing to High-Throughput Clusters"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option>AI & Engineering</option>
                <option>Java</option>
                <option>Python</option>
                <option>Web Dev</option>
                <option>DSA</option>
                <option>DBMS</option>
                <option>Design</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Explain what learners will master across these 5 vertical reels..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Standard Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Discounted Price ($)</label>
              <input
                type="number"
                value={discountedPrice}
                onChange={e => setDiscountedPrice(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Skill Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Thumbnail Image URL</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Configure 5 Reels</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 5 VERTICAL REELS CONFIGURATION */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlaySquare size={18} className="text-blue-600 dark:text-blue-400" />
                <span>5 Vertical Learning Reels (Mandatory 5/5)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every course requires exactly 5 vertical video reels covering core topic progression.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
              5 of 5 Reels Ready
            </span>
          </div>

          <div className="space-y-4">
            {courseReels.map((reel, idx) => (
              <div
                key={reel.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>Reel {idx + 1} Configuration</span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">~{reel.durationSeconds || 60}s duration</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Reel Title</label>
                    <input
                      type="text"
                      value={reel.title}
                      onChange={e => handleUpdateReel(idx, 'title', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Topic Tag</label>
                    <input
                      type="text"
                      value={reel.topic}
                      onChange={e => handleUpdateReel(idx, 'topic', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Video Stream URL (MP4 / WebM)</label>
                    <input
                      type="text"
                      value={reel.videoUrl}
                      onChange={e => handleUpdateReel(idx, 'videoUrl', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back: Course Info</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Final Review</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & SUBMISSION */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmitCourse} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in transition-colors">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Summary & Quality Assurance Review</h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{title || 'Untitled Course'}</span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">${discountedPrice || price}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{description || 'No description provided.'}</p>
            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span>Category: {category}</span>
              <span>•</span>
              <span>Level: {level}</span>
              <span>•</span>
              <span>Reels: 5 Curriculum Videos</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300">
            <strong>Platform Standard:</strong> Once submitted, your course will be reviewed by the LMS administrator team for video quality, sound clarity, and curriculum accuracy before being published to the public catalog.
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back: Edit Reels</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={14} />
              <span>Submit Course for Review</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
