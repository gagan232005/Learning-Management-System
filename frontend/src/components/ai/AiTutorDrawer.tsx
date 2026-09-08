import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Code,
  HelpCircle,
  BookOpen,
  Zap,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextTopic?: string;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  contextTopic = 'Java Core & Modern Concurrency'
}) => {
  const { currentUser, showToast } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am your LMS AI Learning Companion. Ask me anything about ${contextTopic}, code optimization, or practice questions.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsTyping(true);

    // Simulate AI response stream
    setTimeout(() => {
      let aiResponseText = '';
      let codeSnippet: string | undefined = undefined;

      const lower = textToSend.toLowerCase();

      if (lower.includes('explain') || lower.includes('what is') || lower.includes('concept')) {
        aiResponseText = `Great question! In ${contextTopic}, key principles revolve around memory efficiency, concurrent thread scheduling, and clean design patterns. \n\n1. Core Mechanics: Keeps execution lightweight.\n2. Performance: Reduces memory overhead by up to 80%.\n3. Best Practice: Always manage system resources cleanly.`;
        codeSnippet = `// Example Implementation in Java 21\ntry (var scope = new StructuredTaskScope.ShutdownOnFailure()) {\n    Supplier<String> user  = scope.fork(() -> fetchUser());\n    Supplier<Order> order = scope.fork(() -> fetchOrder());\n    scope.join().throwIfFailed();\n    System.out.println(user.get() + " -> " + order.get());\n}`;
      } else if (lower.includes('quiz') || lower.includes('practice') || lower.includes('question')) {
        aiResponseText = `Here is a practice question to test your knowledge:\n\n❓ Question: Which parameter in Java Virtual Threads determines stack size allocation?\n\nA) Fixed 2MB Native Stack\nB) Dynamic Growing/Shrinking Heap Stack (Correct)\nC) Static Compiler Allocation\n\n💡 Tip: Virtual Threads run on top of Carrier Threads!`;
      } else if (lower.includes('debug') || lower.includes('code') || lower.includes('fix')) {
        aiResponseText = `Here is how you refactor and optimize code for maximum throughput:`;
        codeSnippet = `// Optimized Non-Blocking Pipeline\npublic CompletableFuture<Data> fetchDataAsync(String id) {\n    return CompletableFuture.supplyAsync(() -> api.get(id))\n        .orTimeout(3, TimeUnit.SECONDS)\n        .exceptionally(ex -> Data.empty());\n}`;
      } else {
        aiResponseText = `I have analyzed your query about "${textToSend}". Here is a concise takeaway:\n\n• Focus on understanding core data flow.\n• Test edge cases in your local sandbox.\n• Keep functions modular and pure.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Code snippet copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Bot size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-display">
              <span>LMS AI Tutor</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                ONLINE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
              Topic: {contextTopic}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/90 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSendMessage('Explain the main concept in simple terms')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 shrink-0 cursor-pointer flex items-center gap-1"
        >
          <Sparkles size={11} className="text-amber-400" />
          <span>Explain Concept</span>
        </button>
        <button
          onClick={() => handleSendMessage('Generate a practice quiz question for me')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 shrink-0 cursor-pointer flex items-center gap-1"
        >
          <HelpCircle size={11} className="text-blue-400" />
          <span>Practice Quiz</span>
        </button>
        <button
          onClick={() => handleSendMessage('Give me a clean code example')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 shrink-0 cursor-pointer flex items-center gap-1"
        >
          <Code size={11} className="text-emerald-400" />
          <span>Code Example</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Bot size={15} />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs space-y-2'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {msg.codeSnippet && (
                <div className="mt-2 rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-[11px] text-emerald-300 relative group">
                  <button
                    onClick={() => handleCopyCode(msg.id, msg.codeSnippet!)}
                    className="absolute top-2 right-2 p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                  <pre className="overflow-x-auto pr-6">{msg.codeSnippet}</pre>
                </div>
              )}

              <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Bot size={15} />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask AI Tutor a question..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer shrink-0"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
