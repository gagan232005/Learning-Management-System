import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseModule } from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  DollarSign,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Send,
  X
} from 'lucide-react';

interface CourseCreatorProps {
  onClose: () => void;
}

export const CourseCreator: React.FC<CourseCreatorProps> = ({ onClose }) => {
  const { currentUser, addNewCourse, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [price, setPrice] = useState(49);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Intermediate');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80');
  
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'mod-init-1',
      title: 'Module 1: Core Fundamentals & Setup',
      description: 'Environment walkthrough and foundational primitives.',
      durationMinutes: 25,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isFreePreview: true
    }
  ]);

  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Build production-ready applications from scratch',
    'Master advanced industry design patterns'
  ]);
  const [newOutcome, setNewOutcome] = useState('');

  const handleAddModule = () => {
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1}: Next Concept`,
      description: 'In-depth video lecture with downloadable exercise files.',
      durationMinutes: 30,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      isFreePreview: false
    };
    setModules([...modules, newMod]);
  };

  const handleRemoveModule = (id: string) => {
    if (modules.length > 1) {
      setModules(modules.filter(m => m.id !== id));
    }
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addNewCourse({
      title: title.trim(),
      subtitle: subtitle.trim() || 'Comprehensive Masterclass',
      description: description.trim(),
      category,
      price: Number(price),
      discountedPrice: Math.round(Number(price) * 0.8),
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      instructorBio: currentUser.bio || 'Verified LMS Educator & Creator',
      thumbnailUrl,
      level,
      modules,
      learningOutcomes,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Course Creation Studio</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 3: {step === 1 ? 'General Information' : step === 2 ? 'Curriculum & Video Modules' : 'Pricing & Outcomes'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Course Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced TypeScript & Enterprise Architecture"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Master modern type safety and recursive conditional utilities"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Tech">Tech & Web Dev</option>
                    <option value="AI & Engineering">AI & Engineering</option>
                    <option value="Design">UI/UX & Motion Design</option>
                    <option value="Business">Business & Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Skill Level</label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as any)}
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Course Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide a comprehensive syllabus overview, prerequisites, and what students will build..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Curriculum Modules</h4>
                  <p className="text-[11px] text-slate-400">Add video lectures, lesson descriptions, and duration.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-3 py-1.5 rounded-xl gradient-btn-primary font-bold flex items-center gap-1 text-[11px]"
                >
                  <Plus size={14} /> Add Module
                </button>
              </div>

              <div className="space-y-3">
                {modules.map((mod, i) => (
                  <div key={mod.id} className="p-4 rounded-2xl bg-slate-800/50 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-indigo-300 font-bold">Module {i + 1}</strong>
                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(mod.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Module Title"
                      value={mod.title}
                      onChange={e => {
                        const updated = [...modules];
                        updated[i].title = e.target.value;
                        setModules(updated);
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                    />

                    <input
                      type="text"
                      placeholder="Module Video URL"
                      value={mod.videoUrl}
                      onChange={e => {
                        const updated = [...modules];
                        updated[i].videoUrl = e.target.value;
                        setModules(updated);
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Course Price (USD $)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  What Will Students Learn? (Key Outcomes)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Master reactive state synchronization"
                    value={newOutcome}
                    onChange={e => setNewOutcome(e.target.value)}
                    className="flex-1 bg-slate-800/80 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddOutcome}
                    className="px-3.5 py-2 rounded-xl gradient-btn-primary font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {learningOutcomes.map((out, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-300 text-[11px]">• {out}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOutcome(i)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-blue-300 block mb-1">Admin Review Notice:</strong>
                All course submissions undergo admin review for video streaming quality and assessment alignment before being listed in the marketplace.
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/90 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) {
                  showToast('Please enter a course title.', 'warning');
                  return;
                }
                setStep(step + 1);
              }}
              className="px-5 py-2 rounded-xl gradient-btn-primary font-bold flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitCourse}
              className="px-5 py-2 rounded-xl gradient-btn-emerald font-bold flex items-center gap-1.5"
            >
              <Send size={14} />
              <span>Submit Course for Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
