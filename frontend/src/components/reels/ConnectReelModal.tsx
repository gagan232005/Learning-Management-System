import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Question } from '../../types';
import { parseMediaSource } from '../../utils/mediaUtils';
import {
  X,
  Youtube,
  Instagram,
  Video,
  Sparkles,
  Plus,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ConnectReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_EDUCATIONAL_PRESETS = [
  {
    name: 'Python Tricks (YouTube Shorts)',
    url: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    title: 'Python Memory & Variables Visualized',
    category: 'Python',
    difficulty: 'Beginner' as const
  },
  {
    name: 'JS Event Loop (YouTube Shorts)',
    url: 'https://www.youtube.com/shorts/Mus_vwhTCq0',
    title: 'JavaScript Event Loop in 60 Seconds',
    category: 'Web Dev',
    difficulty: 'Intermediate' as const
  },
  {
    name: 'System Design (YouTube Shorts)',
    url: 'https://www.youtube.com/shorts/xP_YFmS_S4M',
    title: 'API Gateways vs Load Balancers',
    category: 'System Design',
    difficulty: 'Advanced' as const
  },
  {
    name: 'DSA Sliding Window (YouTube Shorts)',
    url: 'https://www.youtube.com/shorts/RBSGKlAnoiM',
    title: 'Sliding Window Algorithm Deep Dive',
    category: 'Data Structures',
    difficulty: 'Intermediate' as const
  }
];

export const ConnectReelModal: React.FC<ConnectReelModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addNewReel, currentUser, showToast } = useApp();

  const [urlInput, setUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Python');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [tagsInput, setTagsInput] = useState('YouTubeShorts, Educational');

  // Question fields
  const [includeQuestion, setIncludeQuestion] = useState(true);
  const [qPrompt, setQPrompt] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qOpt4, setQOpt4] = useState('');
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  if (!isOpen) return null;

  const parsedMedia = parseMediaSource(urlInput);
  const isUrlValid = Boolean(urlInput.trim() && (parsedMedia.id || parsedMedia.type === 'direct'));

  const handleApplyPreset = (preset: typeof SAMPLE_EDUCATIONAL_PRESETS[0]) => {
    setUrlInput(preset.url);
    setTitle(preset.title);
    setCategory(preset.category);
    setDifficulty(preset.difficulty);
    setDescription(`Curated educational short covering ${preset.category} core fundamentals.`);
    setTagsInput(`${preset.category}, YouTubeShorts, LearnFast`);
    setQPrompt(`What is the primary architectural concept demonstrated in this ${preset.category} reel?`);
    setQOpt1('Core language runtime and memory optimization');
    setQOpt2('Random hardware acceleration');
    setQOpt3('Legacy deprecation cycle');
    setQOpt4('None of the above');
    setQCorrectIndex(0);
    setQExplanation('The reel focuses on fundamental computer science principles and efficient code execution.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!urlInput.trim()) {
      showToast('Please provide a YouTube Shorts, Instagram Reel, or video URL.', 'warning');
      return;
    }

    if (!title.trim()) {
      showToast('Please enter a descriptive title for this reel.', 'warning');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const questions: Question[] = [];
    if (includeQuestion && qPrompt.trim()) {
      const options = [qOpt1.trim(), qOpt2.trim(), qOpt3.trim(), qOpt4.trim()].filter(Boolean);
      if (options.length >= 2) {
        questions.push({
          id: `q-custom-${Date.now()}`,
          category,
          type: 'mcq',
          prompt: qPrompt.trim(),
          options,
          correctIndex: Math.min(qCorrectIndex, options.length - 1),
          explanation: qExplanation.trim() || 'Correct answer based on the educational reel content.',
          difficulty,
          marks: 15
        });
      }
    }

    addNewReel({
      title: title.trim(),
      description: description.trim() || `Educational short on ${category} principles.`,
      category,
      subject: category,
      topic: title.trim(),
      videoUrl: urlInput.trim(),
      thumbnailUrl:
        parsedMedia.thumbnailUrl ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      source: parsedMedia.type,
      platformEmbedId: parsedMedia.id,
      externalUrl: parsedMedia.originalUrl || urlInput.trim(),
      channelName: currentUser.name,
      creatorId: currentUser.id,
      creatorName: `${currentUser.name} (${parsedMedia.platformName})`,
      creatorRole: currentUser.role === 'admin' ? 'Admin' : 'Mentor',
      difficulty,
      durationSeconds: 55,
      isPublished: true,
      tags,
      questions
    });

    showToast(`Successfully connected ${parsedMedia.platformName} to your Educational Feed!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Connect Educational Reel</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-mono font-medium">
                  YouTube & Instagram
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paste any YouTube Shorts or Instagram Reel link to embed it into the learning feed.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              ⚡ Quick Educational Presets (Click to Auto-fill)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_EDUCATIONAL_PRESETS.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-950/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {preset.title}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Video URL Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Video URL (YouTube Shorts, Instagram Reel, or MP4) *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/shorts/k9TUPpGqYTo or https://instagram.com/reel/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {parsedMedia.type === 'youtube' && (
                  <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px] font-bold flex items-center gap-1">
                    <Youtube size={12} />
                    <span>YouTube Shorts</span>
                  </span>
                )}
                {parsedMedia.type === 'instagram' && (
                  <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold flex items-center gap-1">
                    <Instagram size={12} />
                    <span>Instagram</span>
                  </span>
                )}
                {parsedMedia.type === 'direct' && urlInput.trim() && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center gap-1">
                    <Video size={12} />
                    <span>Direct Video</span>
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Supports <code className="font-mono text-blue-600 dark:text-blue-400">youtube.com/shorts/ID</code>, <code className="font-mono text-blue-600 dark:text-blue-400">youtu.be/ID</code>, and <code className="font-mono text-pink-600 dark:text-pink-400">instagram.com/reel/ID</code>.
            </p>
          </div>

          {/* Live Preview If Valid URL */}
          {isUrlValid && (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-20 h-28 rounded-xl overflow-hidden bg-black shrink-0 relative border border-slate-700">
                {parsedMedia.type === 'youtube' && parsedMedia.id ? (
                  <img
                    src={`https://img.youtube.com/vi/${parsedMedia.id}/hqdefault.jpg`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Video size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Valid Link Detected
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {parsedMedia.id || 'direct'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Source: {parsedMedia.platformName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ready to embed with responsive 9:16 vertical playback and auto-assessment tracking.
                </p>
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reel Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Python Variables & Memory References in 60s"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs cursor-pointer"
              >
                <option value="Python">Python</option>
                <option value="Web Dev">Web Dev / JavaScript</option>
                <option value="System Design">System Design & Cloud</option>
                <option value="Data Structures">Data Structures & Algorithms</option>
                <option value="DBMS">Database & SQL</option>
                <option value="AI & ML">AI, LLMs & Machine Learning</option>
                <option value="Java">Java & JVM</option>
                <option value="General Tech">General Software Engineering</option>
              </select>
            </div>
          </div>

          {/* Difficulty & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Python, Memory, Shorts"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description / Key Takeaways
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of what learners will understand in this 60s reel..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs resize-none"
            />
          </div>

          {/* Assessment Micro-Quiz Question Attachment */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Attach Assessment Question
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeQuestion}
                  onChange={e => setIncludeQuestion(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Include in Quiz</span>
              </label>
            </div>

            {includeQuestion && (
              <div className="space-y-3 pt-2">
                <div>
                  <input
                    type="text"
                    value={qPrompt}
                    onChange={e => setQPrompt(e.target.value)}
                    placeholder="Question prompt based on this reel..."
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: qOpt1, setter: setQOpt1, idx: 0, placeholder: 'Option A (Correct Answer by default)' },
                    { val: qOpt2, setter: setQOpt2, idx: 1, placeholder: 'Option B' },
                    { val: qOpt3, setter: setQOpt3, idx: 2, placeholder: 'Option C (Optional)' },
                    { val: qOpt4, setter: setQOpt4, idx: 3, placeholder: 'Option D (Optional)' }
                  ].map(opt => (
                    <div key={opt.idx} className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={qCorrectIndex === opt.idx}
                        onChange={() => setQCorrectIndex(opt.idx)}
                        className="cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        value={opt.val}
                        onChange={e => opt.setter(e.target.value)}
                        placeholder={opt.placeholder}
                        className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  value={qExplanation}
                  onChange={e => setQExplanation(e.target.value)}
                  placeholder="Explanation shown after answer submission..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} />
              <span>Connect to Reels Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
