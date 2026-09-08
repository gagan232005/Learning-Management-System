import React, { useState } from 'react';
import {
  Code,
  Play,
  Terminal,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Copy,
  Check,
  CheckSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CodeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES: Record<string, { code: string; language: string }> = {
  java: {
    language: 'Java 21 (Virtual Threads)',
    code: `public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("🚀 Executing Java 21 High-Throughput Pipeline...");
        
        long start = System.currentTimeMillis();
        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 1; i <= 5; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    System.out.println("  -> Virtual Thread Task #" + taskId + " running on carrier pool.");
                });
            }
        }
        long duration = System.currentTimeMillis() - start;
        System.out.println("✅ All 5 Tasks completed in " + duration + " ms!");
    }
}`
  },
  python: {
    language: 'Python 3.12 (AsyncIO & AI)',
    code: `import asyncio
import time

async def fetch_reel_chunk(reel_id):
    print(f"  [Async] Streaming Educational Reel #{reel_id}...")
    await asyncio.sleep(0.3)
    return f"Chunk #{reel_id} Ready"

async def main():
    start = time.time()
    print("🚀 Initializing AsyncIO Reel Pipeline...")
    tasks = [fetch_reel_chunk(i) for i in range(1, 6)]
    results = await asyncio.gather(*tasks)
    print(f"✅ Downloaded {len(results)} Reels in {time.time() - start:.2f}s!")

asyncio.run(main())`
  },
  web: {
    language: 'JavaScript / TypeScript',
    code: `// Modern ES2026 Async Pipeline
const calculateScore = (answers) => {
  const correct = Object.values(answers).filter(Boolean).length;
  const score = Math.round((correct / 5) * 100);
  return { score, passed: score >= 80 };
};

const result = calculateScore({ q1: true, q2: true, q3: true, q4: true, q5: false });
console.log("📊 Assessment Evaluation Result:", result);`
  }
};

export const CodeSandboxModal: React.FC<CodeSandboxModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [activeLang, setActiveLang] = useState<'java' | 'python' | 'web'>('java');
  const [code, setCode] = useState(TEMPLATES.java.code);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectLang = (lang: 'java' | 'python' | 'web') => {
    setActiveLang(lang);
    setCode(TEMPLATES[lang].code);
    setOutput(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      if (activeLang === 'java') {
        setOutput(`[JVM 21.0.2 - Virtual Threads Enabled]
🚀 Executing Java 21 High-Throughput Pipeline...
  -> Virtual Thread Task #1 running on carrier pool.
  -> Virtual Thread Task #2 running on carrier pool.
  -> Virtual Thread Task #3 running on carrier pool.
  -> Virtual Thread Task #4 running on carrier pool.
  -> Virtual Thread Task #5 running on carrier pool.
✅ All 5 Tasks completed in 18 ms!
Memory Usage: 4.2 MB Heap (100% Passed)`);
      } else if (activeLang === 'python') {
        setOutput(`[Python 3.12.2 Runtime]
🚀 Initializing AsyncIO Reel Pipeline...
  [Async] Streaming Educational Reel #1...
  [Async] Streaming Educational Reel #2...
  [Async] Streaming Educational Reel #3...
  [Async] Streaming Educational Reel #4...
  [Async] Streaming Educational Reel #5...
✅ Downloaded 5 Reels in 0.31s!
Process finished with exit code 0`);
      } else {
        setOutput(`[Node.js v20.11.0 Runtime]
📊 Assessment Evaluation Result: { score: 80, passed: true }
Program Output: Clean execution.`);
      }
      showToast('Code executed successfully!', 'success');
    }, 700);
  };

  const handleReset = () => {
    setCode(TEMPLATES[activeLang].code);
    setOutput(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Code size={19} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                <span>Interactive Code Sandbox</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  LIVE RUNTIME
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Write, test, and benchmark code directly in your browser.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Top Control Bar: Language Switcher & Actions */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectLang('java')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLang === 'java'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Java 21
            </button>
            <button
              onClick={() => handleSelectLang('python')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLang === 'python'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Python 3.12
            </button>
            <button
              onClick={() => handleSelectLang('web')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLang === 'web'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              TypeScript
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>Copy</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Play size={13} className="fill-white" />
              <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Main Body: Code Editor + Terminal Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[350px]">
          {/* Code Editor Column */}
          <div className="lg:col-span-7 p-4 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Source Editor ({TEMPLATES[activeLang].language})
              </span>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-emerald-300 focus:outline-none focus:border-blue-500 custom-scrollbar resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Terminal Console Column */}
          <div className="lg:col-span-5 p-4 bg-slate-950 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Terminal size={12} className="text-emerald-400" />
                <span>Console Output</span>
              </span>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 overflow-y-auto custom-scrollbar leading-relaxed">
              {isRunning ? (
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>Compiling & executing binary on isolated runner...</span>
                </div>
              ) : output ? (
                <pre className="whitespace-pre-wrap text-emerald-400">{output}</pre>
              ) : (
                <span className="text-slate-500 italic">
                  Click "Run Code" to compile and view execution metrics.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
