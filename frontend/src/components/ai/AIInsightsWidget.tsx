import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Target,
  Lightbulb,
  PlaySquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AIInsightsWidgetProps {
  onNavigateToReels: (reelId?: string) => void;
}

export const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({ onNavigateToReels }) => {
  const { currentUser, reels, setCurrentReelIndex } = useApp();

  const strongTopics = [
    { topic: 'React 19 & Next.js Architecture', score: 94, category: 'Tech' },
    { topic: 'LLM Prompting & Agent Workflows', score: 88, category: 'AI' },
    { topic: 'CSS Subgrid & Responsive Layouts', score: 85, category: 'Design' },
  ];

  const weakTopics = [
    { topic: 'TypeScript Generics & Recursive Types', score: 55, category: 'Tech', suggestedReelId: 'reel-5' },
    { topic: 'Vector Embeddings & HNSW Indexing', score: 60, category: 'AI', suggestedReelId: 'reel-6' },
    { topic: 'Compounding Financial Models in Tech', score: 64, category: 'Business', suggestedReelId: 'reel-4' },
  ];

  const recommendedReels = reels.filter(r => ['reel-5', 'reel-6', 'reel-4'].includes(r.id));

  const handleWatchRecommended = (reelId: string) => {
    const idx = reels.findIndex(r => r.id === reelId);
    if (idx !== -1) {
      setCurrentReelIndex(idx);
      onNavigateToReels(reelId);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24 animate-in fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-950/70 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 flex-shrink-0">
            <BrainCircuit size={28} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-sky-300">Learning Intelligence</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                ACTIVE AI COACH
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Personalized AI Learning Insights & Diagnostic Analysis
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Our continuous assessment engine analyzes your response latency, quiz mistakes, and reel watch patterns to pinpoint knowledge gaps and recommend tailored learning.
            </p>
          </div>
        </div>
      </div>

      {/* Diagnostic Grid: Strong vs Weak Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <div className="p-6 rounded-3xl glass-panel bg-slate-900/80 border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <h3 className="font-bold text-base text-white">Your Strongest Competencies</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400">90%+ Accuracy</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            You consistently ace questions in these areas with high confidence and speed!
          </p>

          <div className="space-y-3 pt-2">
            {strongTopics.map((topic, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-slate-200">{topic.topic}</strong>
                  <span className="text-emerald-400 font-mono font-bold">{topic.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas Needing Reinforcement */}
        <div className="p-6 rounded-3xl glass-panel bg-slate-900/80 border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className="font-bold text-base text-white">Recommended Focus Areas</h3>
            </div>
            <span className="text-xs font-bold text-amber-400">Needs Reinforcement</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            AI detected lower accuracy on assessment questions related to these concepts.
          </p>

          <div className="space-y-3 pt-2">
            {weakTopics.map((topic, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-800/50 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-slate-200">{topic.topic}</strong>
                  <span className="text-amber-400 font-mono font-bold">{topic.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tailored Reels Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-sky-400" />
              <span>AI Tailored Reel Recommendations</span>
            </h2>
            <p className="text-xs text-slate-400">Hand-picked 60-second reels to strengthen your weak topics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendedReels.map(reel => (
            <div
              key={reel.id}
              onClick={() => handleWatchRecommended(reel.id)}
              className="group p-4 rounded-2xl glass-panel bg-slate-900/80 border border-white/10 hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black">
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <PlaySquare size={20} />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                    {reel.durationSeconds}s
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  {reel.category}
                </span>

                <h3 className="font-bold text-xs sm:text-sm text-white mt-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {reel.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Watch Reel</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Study Coach Advice Cards */}
      <div className="p-6 rounded-3xl glass-panel bg-slate-900/80 border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-amber-400" />
          <h3 className="font-bold text-base text-white">AI Study Coach Guidance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 leading-relaxed">
            <strong className="block text-white font-semibold mb-1">🎯 Focus on TypeScript Variance & Infer</strong>
            Your last 2 incorrect answers involved conditional type extractions. Spend 5 minutes reviewing the TypeScript Generics reel to prepare for the next assessment tier.
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 leading-relaxed">
            <strong className="block text-white font-semibold mb-1">🚀 Fast Track to Masterclass Mastery</strong>
            You are currently maintaining a 94% average across AI assessments. Complete the "Full-Stack Modern AI Architecture" course to earn your verified certificate!
          </div>
        </div>
      </div>
    </div>
  );
};
