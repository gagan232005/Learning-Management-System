import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseModule, Question } from '../../types';
import {
  Plus,
  X,
  BookOpen,
  HelpCircle,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Trash2,
  Layers,
  Send,
  Upload,
  Calendar,
  DollarSign
} from 'lucide-react';

interface CreateContentModalProps {
  onClose: () => void;
  defaultContentType?: 'course' | 'quiz' | 'assignment';
}

export const CreateContentModal: React.FC<CreateContentModalProps> = ({
  onClose,
  defaultContentType = 'course',
}) => {
  const {
    currentUser,
    courses,
    addNewCourse,
    createQuiz,
    createAssignment,
    showToast
  } = useApp();

  const [contentType, setContentType] = useState<'course' | 'quiz' | 'assignment'>(defaultContentType);

  // Course fields
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCat, setCourseCat] = useState('Tech');
  const [courseDiff, setCourseDiff] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Intermediate');
  const [coursePrice, setCoursePrice] = useState(49);
  const [courseThumb, setCourseThumb] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80');
  const [courseObjectives, setCourseObjectives] = useState<string[]>(['Master fundamental core concepts', 'Build hands-on production application']);
  const [newObjective, setNewObjective] = useState('');

  // Course Modules
  const [courseModules, setCourseModules] = useState<CourseModule[]>([
    {
      id: 'mod-1',
      title: 'Module 1: Getting Started & Foundations',
      description: 'Overview of core primitives and environment setup.',
      durationMinutes: 30,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isFreePreview: true
    }
  ]);

  // Quiz fields
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCourseId, setQuizCourseId] = useState(courses[0]?.id || '');
  const [quizDiff, setQuizDiff] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [quizPassingPct, setQuizPassingPct] = useState(80);
  const [quizTotalMarks, setQuizTotalMarks] = useState(100);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([
    {
      id: 'q-1',
      category: 'Tech',
      type: 'mcq',
      prompt: 'What is the primary benefit of modular software architecture?',
      options: ['Separation of concerns and maintainability', 'Slower compile time', 'Increased memory overhead', 'None of the above'],
      correctIndex: 0,
      explanation: 'Modular systems isolate responsibilities and make code reusable.'
    }
  ]);
  const [newQPrompt, setNewQPrompt] = useState('');
  const [newQOpt1, setNewQOpt1] = useState('');
  const [newQOpt2, setNewQOpt2] = useState('');
  const [newQOpt3, setNewQOpt3] = useState('');
  const [newQOpt4, setNewQOpt4] = useState('');
  const [newQCorrect, setNewQCorrect] = useState(0);

  // Assignment fields
  const [assignTitle, setAssignTitle] = useState('');
  const [assignCourseId, setAssignCourseId] = useState(courses[0]?.id || '');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignDueDate, setAssignDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [assignMaxMarks, setAssignMaxMarks] = useState(100);
  const [assignType, setAssignType] = useState<'code' | 'file' | 'text'>('code');

  const handleAddModule = () => {
    setCourseModules([
      ...courseModules,
      {
        id: `mod-${Date.now()}`,
        title: `Module ${courseModules.length + 1}: Practical Application`,
        description: 'In-depth lecture and hands-on exercises.',
        durationMinutes: 30,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        isFreePreview: false
      }
    ]);
  };

  const handleAddQuestion = () => {
    if (!newQPrompt.trim() || !newQOpt1.trim() || !newQOpt2.trim()) {
      showToast('Please provide a question prompt and at least 2 options.', 'warning');
      return;
    }

    const opts = [newQOpt1, newQOpt2];
    if (newQOpt3.trim()) opts.push(newQOpt3);
    if (newQOpt4.trim()) opts.push(newQOpt4);

    setQuizQuestions([
      ...quizQuestions,
      {
        id: `q-${Date.now()}`,
        category: 'General',
        type: 'mcq',
        prompt: newQPrompt.trim(),
        options: opts,
        correctIndex: Number(newQCorrect),
        explanation: 'Correct answer based on curriculum material.'
      }
    ]);

    setNewQPrompt('');
    setNewQOpt1('');
    setNewQOpt2('');
    setNewQOpt3('');
    setNewQOpt4('');
    setNewQCorrect(0);
    showToast('Question added to quiz.', 'info');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    addNewCourse({
      title: courseTitle.trim(),
      subtitle: courseSubtitle.trim() || 'Comprehensive Course',
      description: courseDesc.trim() || 'In-depth masterclass for learners.',
      category: courseCat,
      price: Number(coursePrice),
      discountedPrice: Math.round(Number(coursePrice) * 0.8),
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      instructorBio: currentUser.bio || 'Platform Administrator & Educator',
      thumbnailUrl: courseThumb,
      level: courseDiff,
      modules: courseModules,
      learningOutcomes: courseObjectives,
      status: 'published',
      submittedAt: new Date().toISOString()
    });

    showToast(`Course "${courseTitle}" created and published successfully!`, 'success');
    onClose();
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    const matchedCourse = courses.find(c => c.id === quizCourseId);

    createQuiz({
      courseId: quizCourseId,
      courseTitle: matchedCourse?.title || 'Masterclass',
      moduleId: 'mod-1',
      moduleTitle: 'Core Concepts',
      title: quizTitle.trim(),
      difficulty: quizDiff,
      totalMarks: Number(quizTotalMarks),
      passingPercentage: Number(quizPassingPct),
      questions: quizQuestions
    });

    showToast(`Quiz "${quizTitle}" created and published!`, 'success');
    onClose();
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    const matchedCourse = courses.find(c => c.id === assignCourseId);

    createAssignment({
      courseId: assignCourseId,
      courseTitle: matchedCourse?.title || 'Masterclass',
      moduleId: 'mod-1',
      moduleTitle: 'Practical Project',
      title: assignTitle.trim(),
      instructions: assignInstructions.trim() || 'Complete the exercise according to technical specifications.',
      dueDate: new Date(assignDueDate).toISOString(),
      maxMarks: Number(assignMaxMarks),
      submissionType: assignType
    });

    showToast(`Assignment "${assignTitle}" created successfully!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-base text-slate-900">Create New LMS Content</h3>
            <p className="text-xs text-slate-500">Add course masterclasses, module quizzes, or project assignments.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* Content Type Selector (Course | Quiz | Assignment) */}
        <div className="px-6 pt-4 flex items-center gap-2 border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => setContentType('course')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              contentType === 'course'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen size={14} />
            <span>Course</span>
          </button>

          <button
            type="button"
            onClick={() => setContentType('quiz')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              contentType === 'quiz'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <HelpCircle size={14} />
            <span>Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => setContentType('assignment')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              contentType === 'assignment'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <FileCheck2 size={14} />
            <span>Assignment</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* 1. COURSE FORM */}
          {contentType === 'course' && (
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Full-Stack AI Architecture & Agentic Workflows"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle / Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Production Masterclass with LangChain and TypeScript"
                  value={courseSubtitle}
                  onChange={e => setCourseSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={courseCat}
                    onChange={e => setCourseCat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    <option value="AI & Engineering">AI & Engineering</option>
                    <option value="Tech">Tech & Web Dev</option>
                    <option value="Java">Java & Enterprise</option>
                    <option value="DSA">Data Structures & Algorithms</option>
                    <option value="Cloud">Cloud & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level</label>
                  <select
                    value={courseDiff}
                    onChange={e => setCourseDiff(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={coursePrice}
                    onChange={e => setCoursePrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive description of syllabus..."
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 resize-none"
                />
              </div>

              {/* Modules Setup */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs">Curriculum Modules ({courseModules.length})</label>
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] hover:bg-blue-100"
                  >
                    + Add Module
                  </button>
                </div>

                {courseModules.map((mod, idx) => (
                  <div key={mod.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <input
                      type="text"
                      placeholder="Module Title"
                      value={mod.title}
                      onChange={e => {
                        const updated = [...courseModules];
                        updated[idx].title = e.target.value;
                        setCourseModules(updated);
                      }}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm">
                  Create & Publish Course
                </button>
              </div>
            </form>
          )}

          {/* 2. QUIZ FORM */}
          {contentType === 'quiz' && (
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems & Concurrency Quiz"
                  value={quizTitle}
                  onChange={e => setQuizTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associated Course</label>
                  <select
                    value={quizCourseId}
                    onChange={e => setQuizCourseId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={quizDiff}
                    onChange={e => setQuizDiff(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passing %</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={quizPassingPct}
                    onChange={e => setQuizPassingPct(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-900 text-xs">Questions ({quizQuestions.length})</label>

                {quizQuestions.map((q, i) => (
                  <div key={q.id || i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-bold">Q{i + 1}: {q.prompt}</strong>
                    <span className="text-[11px] text-emerald-700 font-medium block">
                      Correct Answer: {q.options[q.correctIndex]}
                    </span>
                  </div>
                ))}

                {/* Add Question Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                  <span className="font-bold text-slate-800 text-xs block">+ Add New Question</span>
                  <input
                    type="text"
                    placeholder="Question prompt..."
                    value={newQPrompt}
                    onChange={e => setNewQPrompt(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Option A (Correct)"
                      value={newQOpt1}
                      onChange={e => setNewQOpt1(e.target.value)}
                      className="p-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Option B"
                      value={newQOpt2}
                      onChange={e => setNewQOpt2(e.target.value)}
                      className="p-2 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                  >
                    Add Question to Quiz
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm">
                  Create Quiz
                </button>
              </div>
            </form>
          )}

          {/* 3. ASSIGNMENT FORM */}
          {contentType === 'assignment' && (
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build an Agentic AI Workflow in Next.js"
                  value={assignTitle}
                  onChange={e => setAssignTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associated Course</label>
                  <select
                    value={assignCourseId}
                    onChange={e => setAssignCourseId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Submission Type</label>
                  <select
                    value={assignType}
                    onChange={e => setAssignType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    <option value="code">GitHub / Code Repo</option>
                    <option value="file">File Upload (ZIP/PDF)</option>
                    <option value="text">Text Response</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={assignMaxMarks}
                    onChange={e => setAssignMaxMarks(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={e => setAssignDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions & Problem Statement</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed requirements, test cases, and delivery criteria..."
                  value={assignInstructions}
                  onChange={e => setAssignInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm">
                  Create Assignment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
