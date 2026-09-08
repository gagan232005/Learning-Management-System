import {
  User,
  Reel,
  Course,
  CourseReel,
  Lesson,
  Quiz,
  Assignment,
  ArticleNote,
  Comment,
  NotificationItem,
  EnrolledStudent,
  AdminAnalytics,
  Badge,
  BadgeDefinition,
  DiscountVoucher,
  ContentApprovalItem,
  MentorApplication,
  CourseFeedback
} from '../types';

export const INITIAL_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'badge-def-1',
    title: 'Java Specialist',
    description: 'Complete Java Fundamentals course with assessment score >= 80%',
    icon: '☕',
    rarity: 'common',
    conditionType: 'quiz_score',
    conditionCourseId: 'course-java',
    conditionThreshold: 80,
    conditionText: 'Complete Java Fundamentals course with score >= 80%',
    isActive: true,
    earnedCount: 0,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'badge-def-2',
    title: 'Speed Learner',
    description: 'Completed your first 5-reel assessment with a passing score!',
    icon: '⚡',
    rarity: 'rare',
    conditionType: 'reels_watched',
    conditionThreshold: 5,
    conditionText: 'Complete all 5 Learn reels and pass the assessment',
    isActive: true,
    earnedCount: 0,
    createdAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'badge-def-3',
    title: 'Streak Master',
    description: 'Maintained a 7-day continuous learning streak.',
    icon: '🔥',
    rarity: 'epic',
    conditionType: 'streak_days',
    conditionThreshold: 7,
    conditionText: 'Maintain 7 consecutive days active streak',
    isActive: true,
    earnedCount: 0,
    createdAt: '2026-08-10T00:00:00Z',
  }
];

export const INITIAL_BADGES: Badge[] = [];
export const INITIAL_VOUCHERS: DiscountVoucher[] = [];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student',
    name: 'Learner',
    email: 'user@lms.ai',
    password: 'password123',
    role: 'student',
    status: 'active',
    points: 0,
    xp: 0,
    streakDays: 0,
    level: 1,
    bio: 'Software engineering learner exploring courses, vertical reels, and assessments.',
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [],
    discountVouchers: [],
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    totalLearningHours: 0,
    quizAverage: 0,
    completedLessonsCount: 0,
    reelsWatchedTotal: 0,
    assignmentsCompletedCount: 0,
    registeredAt: '2026-08-01T00:00:00Z',
    lastActive: '2026-08-31T00:00:00Z',
    recentActivity: []
  },
  {
    id: 'user-mentor',
    name: 'Mentor 001',
    email: 'mentor@lms.ai',
    password: 'password123',
    role: 'mentor',
    status: 'active',
    points: 0,
    xp: 0,
    streakDays: 0,
    level: 1,
    bio: 'Senior Java & AI Systems Architect • Verified Mentor.',
    specialty: 'Java Core & Modern Enterprise Architecture',
    assignedLearnerIds: [],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [],
    discountVouchers: [],
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    registeredAt: '2026-08-01T00:00:00Z',
    lastActive: '2026-08-31T00:00:00Z',
  },
  {
    id: 'user-admin',
    name: 'Administrator',
    email: 'admin@lms.ai',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    points: 0,
    xp: 0,
    streakDays: 0,
    level: 1,
    bio: 'Platform Administrator & Curriculum Governance Lead.',
    specialty: 'Platform Governance & Operations',
    assignedLearnerIds: [],
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [],
    discountVouchers: [],
    weeklyHours: [0, 0, 0, 0, 0, 0, 0],
    registeredAt: '2026-01-01T00:00:00Z',
    lastActive: '2026-08-31T00:00:00Z',
  }
];

// 25 CURATED EDUCATIONAL REELS & SHORTS (YOUTUBE SHORTS & INSTAGRAM REELS ONLY)
export const INITIAL_REELS: Reel[] = [
  // ================= TOPIC 1: AI & MACHINE LEARNING (5 REELS) =================
  {
    id: 'reel-ml-1',
    title: 'How Transformers & Self-Attention Work in 60s',
    description: 'The mathematical breakthrough behind ChatGPT and modern LLMs: query-key-value vectors and parallel self-attention computation.',
    category: 'AI & ML',
    subject: 'Artificial Intelligence',
    topic: 'Transformer Architecture & Self-Attention',
    videoUrl: 'https://www.youtube.com/shorts/aircAruvnKk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'aircAruvnKk',
    externalUrl: 'https://www.youtube.com/shorts/aircAruvnKk',
    channelName: '3Blue1Brown',
    creatorId: 'user-mentor',
    creatorName: '3Blue1Brown (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 58,
    likesCount: 11400,
    commentsCount: 420,
    sharesCount: 4100,
    viewsCount: 135000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['AI', 'LLM', 'Transformers', 'YouTubeShorts'],
    createdAt: '2026-08-20T00:00:00Z',
    questions: [
      {
        id: 'q-ml-1',
        category: 'AI & ML',
        type: 'true_false',
        prompt: 'Unlike Recurrent Neural Networks (RNNs) that process text one token at a time, Transformers compute Self-Attention across all tokens in parallel using matrix operations.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Self-attention allows Transformers to evaluate relationships between all words simultaneously via GPU matrix multiplication, eliminating the sequential bottleneck of RNNs.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-ml-2',
    title: 'Gradient Descent & Loss Optimization in 60s',
    description: 'Understand how neural networks minimize error by calculating partial derivatives and stepping along the negative loss gradient vector.',
    category: 'AI & ML',
    subject: 'Machine Learning',
    topic: 'Gradient Descent & Backprop',
    videoUrl: 'https://www.youtube.com/shorts/i_LwzRVP7bg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'i_LwzRVP7bg',
    externalUrl: 'https://www.youtube.com/shorts/i_LwzRVP7bg',
    channelName: 'DeepLearning.AI',
    creatorId: 'user-mentor',
    creatorName: 'Andrew Ng (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 54,
    likesCount: 8900,
    commentsCount: 230,
    sharesCount: 1900,
    viewsCount: 89000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['ML', 'GradientDescent', 'Optimization', 'YouTubeShorts'],
    createdAt: '2026-08-20T01:00:00Z',
    questions: [
      {
        id: 'q-ml-2',
        category: 'AI & ML',
        type: 'mcq',
        prompt: 'What problem occurs if the Learning Rate in Gradient Descent is set too large?',
        options: [
          'The model trains 100x faster without error',
          'The parameter updates overshoot the local/global minimum and the loss diverges',
          'The neural network converts into a decision tree',
          'Memory usage doubles on each epoch'
        ],
        correctIndex: 1,
        explanation: 'An excessively high learning rate causes gradient steps to overshoot the valley floor, causing the loss function to oscillate wildly or diverge to infinity.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-ml-3',
    title: 'Overfitting, L1/L2 Regularization & Dropout in 60s',
    description: 'Learn how to prevent models from memorizing training data noise using weight decay penalties and random neuron deactivation.',
    category: 'AI & ML',
    subject: 'Deep Learning',
    topic: 'Regularization & Generalization',
    videoUrl: 'https://www.youtube.com/shorts/Mus_vwhTCq0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'Mus_vwhTCq0',
    externalUrl: 'https://www.youtube.com/shorts/Mus_vwhTCq0',
    channelName: 'StatQuest',
    creatorId: 'user-mentor',
    creatorName: 'StatQuest (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 56,
    likesCount: 7600,
    commentsCount: 190,
    sharesCount: 1750,
    viewsCount: 78000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['ML', 'Regularization', 'Dropout', 'YouTubeShorts'],
    createdAt: '2026-08-20T02:00:00Z',
    questions: [
      {
        id: 'q-ml-3',
        category: 'AI & ML',
        type: 'mcq',
        prompt: 'What mathematical property distinguishes L1 (Lasso) regularization from L2 (Ridge) regularization?',
        options: [
          'L1 penalizes absolute weights, forcing non-essential weights to exact zero for feature selection',
          'L2 forces all weights to infinity',
          'L1 only applies to unlabelled audio datasets',
          'L2 eliminates the need for activation functions'
        ],
        correctIndex: 0,
        explanation: 'L1 regularization drives coefficients to exactly zero, performing automatic sparse feature selection.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-ml-4',
    title: 'CNNs vs Vision Transformers Visualized in 60s',
    description: 'Convolutional inductive bias vs global patch self-attention for image classification and object detection.',
    category: 'AI & ML',
    subject: 'Computer Vision',
    topic: 'CNN & Vision Transformers',
    videoUrl: 'https://www.instagram.com/reel/C8qXY12v9aB/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C8qXY12v9aB',
    externalUrl: 'https://www.instagram.com/reel/C8qXY12v9aB/',
    channelName: 'AI Revolution',
    creatorId: 'user-mentor',
    creatorName: 'AI Revolution (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 58,
    likesCount: 9200,
    commentsCount: 260,
    sharesCount: 2200,
    viewsCount: 95000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Vision', 'CNN', 'ViT', 'InstagramReels'],
    createdAt: '2026-08-20T03:00:00Z',
    questions: [
      {
        id: 'q-ml-4',
        category: 'AI & ML',
        type: 'true_false',
        prompt: 'Vision Transformers (ViT) divide images into fixed-size 16x16 pixel patches and treat each patch like a word token in NLP self-attention.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! ViT flattens 2D image patches into 1D embedding vectors and processes them through standard Transformer encoder blocks.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-ml-5',
    title: 'LLM Fine-Tuning: LoRA vs Full Parameter Fine-Tuning in 60s',
    description: 'How Low-Rank Adaptation (LoRA) reduces trainable parameters by 99% using low-rank matrix decomposition (A x B).',
    category: 'AI & ML',
    subject: 'Generative AI',
    topic: 'LoRA & LLM Tuning',
    videoUrl: 'https://www.youtube.com/shorts/0ZJgIjIuY7U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: '0ZJgIjIuY7U',
    externalUrl: 'https://www.youtube.com/shorts/0ZJgIjIuY7U',
    channelName: 'AI Explained',
    creatorId: 'user-mentor',
    creatorName: 'AI Explained (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 59,
    likesCount: 14200,
    commentsCount: 450,
    sharesCount: 4600,
    viewsCount: 160000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['LoRA', 'LLM', 'FineTuning', 'YouTubeShorts'],
    createdAt: '2026-08-20T04:00:00Z',
    questions: [
      {
        id: 'q-ml-5',
        category: 'AI & ML',
        type: 'mcq',
        prompt: 'Why is LoRA (Low-Rank Adaptation) significantly more memory efficient than full parameter fine-tuning?',
        options: [
          'It deletes the original foundation model weights completely',
          'It freezes the base model weights and only trains small low-rank rank-r decomposition adapter matrices',
          'It converts floating point math into integer addition only',
          'It eliminates backpropagation'
        ],
        correctIndex: 1,
        explanation: 'LoRA keeps original billion-parameter weights frozen and trains two tiny low-rank matrices (d x r and r x k, where r << d), drastically shrinking GPU VRAM requirements.',
        difficulty: 'Advanced',
        marks: 20
      }
    ]
  },

  // ================= TOPIC 2: PYTHON (5 REELS) =================
  {
    id: 'reel-py-1',
    title: 'Python Variables & Memory References in 60s',
    description: 'Understand mutable vs immutable objects, reference counting, and how Python points variable names to heap memory addresses.',
    category: 'Python',
    subject: 'Python',
    topic: 'Memory Management & References',
    videoUrl: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'k9TUPpGqYTo',
    externalUrl: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    channelName: 'Tech With Tim',
    creatorId: 'user-mentor',
    creatorName: 'Tech With Tim (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Beginner',
    durationSeconds: 50,
    likesCount: 5420,
    commentsCount: 142,
    sharesCount: 1620,
    viewsCount: 68200,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Python', 'Memory', 'Variables', 'YouTubeShorts'],
    createdAt: '2026-08-21T00:00:00Z',
    questions: [
      {
        id: 'q-py-1',
        category: 'Python',
        type: 'mcq',
        prompt: 'In Python, when you assign `a = [1, 2]` and `b = a`, what actually happens in memory?',
        options: [
          'A deep copy of the list is created and stored in a new memory address for b',
          'Both `a` and `b` reference the exact same list object in heap memory',
          'Python freezes variable `a` into an immutable tuple',
          'A compile error occurs unless `copy()` is called explicitly'
        ],
        correctIndex: 1,
        explanation: 'In Python, variables are references to objects in memory. `b = a` assigns the same memory address reference to `b`, so modifying `b` will also affect `a`.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-py-2',
    title: 'Python AsyncIO Event Loop vs Multiprocessing in 60s',
    description: 'When to use async/await cooperative coroutines for I/O bound tasks vs ProcessPoolExecutor for CPU-bound computation.',
    category: 'Python',
    subject: 'Python Engineering',
    topic: 'AsyncIO & Concurrency',
    videoUrl: 'https://www.instagram.com/reel/C9rZ128v1aC/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C9rZ128v1aC',
    externalUrl: 'https://www.instagram.com/reel/C9rZ128v1aC/',
    channelName: 'Python Hub',
    creatorId: 'user-mentor',
    creatorName: 'Python Hub (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 58,
    likesCount: 8400,
    commentsCount: 230,
    sharesCount: 2100,
    viewsCount: 91000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Python', 'AsyncIO', 'Concurrency', 'InstagramReels'],
    createdAt: '2026-08-21T01:00:00Z',
    questions: [
      {
        id: 'q-py-2',
        category: 'Python',
        type: 'mcq',
        prompt: 'In CPython, why does `multiprocessing` bypass the Global Interpreter Lock (GIL) for CPU-heavy tasks while `threading` does not?',
        options: [
          'Multiprocessing converts Python bytecode to raw C code at runtime',
          'Each process spawns an entirely independent CPython interpreter and memory space on a separate OS PID',
          'Threading disables multi-core CPU scheduling',
          'AsyncIO automatically unlocks the GIL for while loops'
        ],
        correctIndex: 1,
        explanation: 'Each multiprocessing worker is an isolated Python process with its own private GIL and memory address space.',
        difficulty: 'Advanced',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-py-3',
    title: 'Python Generators & `yield` Memory Magic in 60s',
    description: 'How lazy evaluation with `yield` streams gigabytes of data with O(1) constant memory instead of huge memory-hogging lists.',
    category: 'Python',
    subject: 'Python Internals',
    topic: 'Generators & Iterators',
    videoUrl: 'https://www.youtube.com/shorts/f1wnYdLEpgI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'f1wnYdLEpgI',
    externalUrl: 'https://www.youtube.com/shorts/f1wnYdLEpgI',
    channelName: 'Corey Schafer',
    creatorId: 'user-mentor',
    creatorName: 'Corey Schafer (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 52,
    likesCount: 6800,
    commentsCount: 160,
    sharesCount: 1400,
    viewsCount: 72000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Python', 'Generators', 'Yield', 'YouTubeShorts'],
    createdAt: '2026-08-21T02:00:00Z',
    questions: [
      {
        id: 'q-py-3',
        category: 'Python',
        type: 'true_false',
        prompt: 'A Python generator function pauses execution state at `yield` and maintains local variable values in memory until `next()` is invoked again.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Generators maintain frame stack execution state across yields, emitting values lazily without storing the entire dataset in RAM.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-py-4',
    title: 'Python Decorators & Closures Explained in 60s',
    description: 'Master first-class functions, higher-order wrappers, `@functools.wraps`, and syntactic sugar for logging and auth.',
    category: 'Python',
    subject: 'Python Advanced',
    topic: 'Decorators & Closures',
    videoUrl: 'https://www.youtube.com/shorts/G3e-cpL7ofc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'G3e-cpL7ofc',
    externalUrl: 'https://www.youtube.com/shorts/G3e-cpL7ofc',
    channelName: 'ArjanCodes',
    creatorId: 'user-mentor',
    creatorName: 'ArjanCodes (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 55,
    likesCount: 7100,
    commentsCount: 180,
    sharesCount: 1600,
    viewsCount: 79000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Python', 'Decorators', 'Closures', 'YouTubeShorts'],
    createdAt: '2026-08-21T03:00:00Z',
    questions: [
      {
        id: 'q-py-4',
        category: 'Python',
        type: 'mcq',
        prompt: 'What is the primary role of `@functools.wraps(func)` inside a custom Python decorator?',
        options: [
          'It compiles the function to C code',
          'It preserves original function metadata such as `__name__` and `__doc__` docstrings',
          'It runs the function on multiple CPU cores',
          'It encrypts arguments passed to the function'
        ],
        correctIndex: 1,
        explanation: '`functools.wraps` copies original function attributes (`__name__`, `__doc__`, `__annotations__`) to the wrapper function, preventing reflection loss.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-py-5',
    title: 'Python 3.13 Free-Threaded Mode (No-GIL) in 60s',
    description: 'The monumental upgrade in Python 3.13: running true multi-threaded CPU parallel code without the Global Interpreter Lock.',
    category: 'Python',
    subject: 'Python 3.13 & Internals',
    topic: 'No-GIL Multi-threading',
    videoUrl: 'https://www.instagram.com/reel/C7nXY99p3bA/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C7nXY99p3bA',
    externalUrl: 'https://www.instagram.com/reel/C7nXY99p3bA/',
    channelName: 'Python Bytes',
    creatorId: 'user-mentor',
    creatorName: 'Python Bytes (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 57,
    likesCount: 10200,
    commentsCount: 310,
    sharesCount: 2900,
    viewsCount: 110000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Python313', 'GIL', 'Threading', 'InstagramReels'],
    createdAt: '2026-08-21T04:00:00Z',
    questions: [
      {
        id: 'q-py-5',
        category: 'Python',
        type: 'true_false',
        prompt: 'In Python 3.13 experimental free-threaded builds (PEP 703), multiple threads in a single process can execute CPU-bound bytecode simultaneously across multiple CPU cores.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! PEP 703 replaces the global interpreter lock with biased reference counting and fine-grained mutexes to enable true parallel CPU execution.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },

  // ================= TOPIC 3: WEB DEV & REACT (5 REELS) =================
  {
    id: 'reel-web-1',
    title: 'JavaScript Event Loop & Microtasks in 60s',
    description: 'Learn how the V8 JavaScript engine orchestrates the Call Stack, Microtask Queue (Promises), and Task Queue (setTimeout).',
    category: 'Web Dev',
    subject: 'JavaScript',
    topic: 'Event Loop & Asynchronous Architecture',
    videoUrl: 'https://www.youtube.com/shorts/Mus_vwhTCq0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-ddb62129a843?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'Mus_vwhTCq0',
    externalUrl: 'https://www.youtube.com/shorts/Mus_vwhTCq0',
    channelName: 'Fireship',
    creatorId: 'user-mentor',
    creatorName: 'Fireship (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 55,
    likesCount: 8930,
    commentsCount: 280,
    sharesCount: 2450,
    viewsCount: 94100,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['JavaScript', 'Async', 'EventLoop', 'YouTubeShorts'],
    createdAt: '2026-08-22T00:00:00Z',
    questions: [
      {
        id: 'q-web-1',
        category: 'Web Dev',
        type: 'mcq',
        prompt: 'In the JavaScript runtime, what runs first when the Call Stack becomes empty: a resolved Promise callback (Microtask) or a setTimeout callback (Macrotask)?',
        options: [
          'The setTimeout callback runs first',
          'All pending Microtasks (Promise callbacks) run before the next Macrotask is dequeued',
          'They run concurrently on two separate CPU threads',
          'Whichever callback was registered earliest in milliseconds'
        ],
        correctIndex: 1,
        explanation: 'The Event Loop drains the entire Microtask queue (Promises, queueMicrotask) immediately after the current synchronous stack empties before picking the next task.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-web-2',
    title: 'React: UseEffect Stale Closures & Dependency Array in 60s',
    description: 'Why your React state is stuck inside useEffect callbacks and how useRef or state updaters solve stale closures.',
    category: 'Web Dev',
    subject: 'React',
    topic: 'React Hooks & Closures',
    videoUrl: 'https://www.youtube.com/shorts/0ZJgIjIuY7U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: '0ZJgIjIuY7U',
    externalUrl: 'https://www.youtube.com/shorts/0ZJgIjIuY7U',
    channelName: 'Web Dev Simplified',
    creatorId: 'user-mentor',
    creatorName: 'Kyle Cook (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 52,
    likesCount: 7890,
    commentsCount: 215,
    sharesCount: 1950,
    viewsCount: 84000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['React', 'WebDev', 'Hooks', 'YouTubeShorts'],
    createdAt: '2026-08-22T01:00:00Z',
    questions: [
      {
        id: 'q-web-2',
        category: 'Web Dev',
        type: 'mcq',
        prompt: 'How do you safely update state based on previous state inside an asynchronous useEffect without causing stale closures?',
        options: [
          'Use `setCount(count + 1)` with an empty dependency array',
          'Pass a functional updater `setCount(prev => prev + 1)`',
          'Call `forceUpdate()` on the window object',
          'Remove the dependency array completely'
        ],
        correctIndex: 1,
        explanation: 'Functional updaters `prev => prev + 1` guarantee access to the latest state value regardless of closure timing.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-web-3',
    title: 'CSS: Modern Flexbox vs Grid Mental Model in 60s',
    description: 'The golden rule of 1-Dimensional (Flexbox) vs 2-Dimensional (CSS Grid) layout orchestration for responsive web apps.',
    category: 'Web Dev',
    subject: 'CSS & Design',
    topic: 'Flexbox & CSS Grid',
    videoUrl: 'https://www.instagram.com/reel/C8kLM12x8aZ/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C8kLM12x8aZ',
    externalUrl: 'https://www.instagram.com/reel/C8kLM12x8aZ/',
    channelName: 'Kevin Powell CSS',
    creatorId: 'user-mentor',
    creatorName: 'Kevin Powell (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Beginner',
    durationSeconds: 50,
    likesCount: 5100,
    commentsCount: 120,
    sharesCount: 1340,
    viewsCount: 62000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['CSS', 'Flexbox', 'Grid', 'InstagramReels'],
    createdAt: '2026-08-22T02:00:00Z',
    questions: [
      {
        id: 'q-web-3',
        category: 'Web Dev',
        type: 'true_false',
        prompt: 'CSS Grid is designed for two-dimensional layouts (rows and columns simultaneously), whereas Flexbox is designed for one-dimensional layouts (either a single row or a single column).',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Grid manages both horizontal and vertical tracks concurrently, while Flexbox aligns items along a single main axis at a time.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-web-4',
    title: 'Virtual DOM Diffing vs Direct Manipulation in 60s',
    description: 'How modern UI engines compute lightweight tree deltas and batch patch operations to avoid expensive browser layout reflows.',
    category: 'Web Dev',
    subject: 'Web Architecture',
    topic: 'Virtual DOM & Diffing',
    videoUrl: 'https://www.youtube.com/shorts/RBSGKlAnoiM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'RBSGKlAnoiM',
    externalUrl: 'https://www.youtube.com/shorts/RBSGKlAnoiM',
    channelName: 'Fireship',
    creatorId: 'user-mentor',
    creatorName: 'Fireship (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 56,
    likesCount: 8200,
    commentsCount: 195,
    sharesCount: 1800,
    viewsCount: 87000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['React', 'VDOM', 'Performance', 'YouTubeShorts'],
    createdAt: '2026-08-22T03:00:00Z',
    questions: [
      {
        id: 'q-web-4',
        category: 'Web Dev',
        type: 'mcq',
        prompt: 'What makes direct real DOM manipulations slower than batch virtual DOM diff updates during frequent state changes?',
        options: [
          'JavaScript cannot communicate with the DOM API',
          'Every immediate direct DOM change forces the browser engine to perform costly synchronous recalculations of layout coordinates and paint trees',
          'The DOM only supports 8-bit text',
          'Virtual DOM saves data to hard disk'
        ],
        correctIndex: 1,
        explanation: 'Direct mutations trigger layout thrashing and synchronous reflows, while Virtual DOM batches updates and applies only the calculated diff in one frame.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-web-5',
    title: 'WebSockets vs Server-Sent Events (SSE) in 60s',
    description: 'When to choose full-duplex bidirectional TCP sockets vs lightweight unidirectional HTTP streaming for real-time dashboards.',
    category: 'Web Dev',
    subject: 'Real-time Web',
    topic: 'WebSockets & SSE',
    videoUrl: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'k9TUPpGqYTo',
    externalUrl: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    channelName: 'Hussein Nasser',
    creatorId: 'user-mentor',
    creatorName: 'Hussein Nasser (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 55,
    likesCount: 9100,
    commentsCount: 240,
    sharesCount: 2100,
    viewsCount: 93000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['WebSockets', 'SSE', 'Realtime', 'YouTubeShorts'],
    createdAt: '2026-08-22T04:00:00Z',
    questions: [
      {
        id: 'q-web-5',
        category: 'Web Dev',
        type: 'true_false',
        prompt: 'Server-Sent Events (SSE) provide native reconnection handling and work over standard HTTP/2 without requiring protocol upgrades like WebSockets.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! SSE operates over standard HTTP, includes automatic browser reconnection logic, and supports HTTP/2 multiplexing out of the box.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },

  // ================= TOPIC 4: DATA STRUCTURES & ALGORITHMS (5 REELS) =================
  {
    id: 'reel-dsa-1',
    title: 'DSA: Two Pointers vs Sliding Window Visualized',
    description: 'Master when to use Fixed Window, Dynamic Window, and Bidirectional Pointers for O(N) linear array & string algorithms.',
    category: 'Data Structures',
    subject: 'DSA',
    topic: 'Array Algorithms & Sliding Window',
    videoUrl: 'https://www.youtube.com/shorts/RBSGKlAnoiM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'RBSGKlAnoiM',
    externalUrl: 'https://www.youtube.com/shorts/RBSGKlAnoiM',
    channelName: 'NeetCode',
    creatorId: 'user-mentor',
    creatorName: 'NeetCode DSA (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 49,
    likesCount: 9810,
    commentsCount: 310,
    sharesCount: 3200,
    viewsCount: 112000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['DSA', 'Algorithms', 'SlidingWindow', 'YouTubeShorts'],
    createdAt: '2026-08-23T00:00:00Z',
    questions: [
      {
        id: 'q-dsa-1',
        category: 'Data Structures',
        type: 'mcq',
        prompt: 'When is a dynamic sliding window algorithm mathematically applicable over a naive O(N^2) nested loop approach?',
        options: [
          'Only on sorted numeric arrays with binary search',
          'When the problem seeks an optimal contiguous subarray/substring with monotonic expand/shrink conditions',
          'When the array contains exclusively negative values',
          'When processing non-contiguous tree traversals'
        ],
        correctIndex: 1,
        explanation: 'Sliding Window transforms nested subsegment evaluations into linear O(N) by expanding the right boundary and contracting the left boundary monotonically.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-dsa-2',
    title: 'Binary Search Invariants & Boundary Conditions in 60s',
    description: 'Master `low <= high` vs `low < high` and prevent infinite loops when searching on monotonic search spaces.',
    category: 'Data Structures',
    subject: 'Algorithms',
    topic: 'Binary Search Invariants',
    videoUrl: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'k9TUPpGqYTo',
    externalUrl: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    channelName: 'Abdul Bari',
    creatorId: 'user-mentor',
    creatorName: 'Abdul Bari (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Beginner',
    durationSeconds: 53,
    likesCount: 11200,
    commentsCount: 340,
    sharesCount: 3100,
    viewsCount: 125000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['DSA', 'BinarySearch', 'Algorithms', 'YouTubeShorts'],
    createdAt: '2026-08-23T01:00:00Z',
    questions: [
      {
        id: 'q-dsa-2',
        category: 'Data Structures',
        type: 'mcq',
        prompt: 'Why should mid index calculation in Binary Search be written as `low + (high - low) / 2` instead of `(low + high) / 2` in fixed-width integer languages like C++ and Java?',
        options: [
          'It computes float precision faster',
          'It prevents 32-bit integer overflow when (low + high) exceeds 2,147,483,647',
          'It automatically rounds up instead of down',
          'It forces loop execution on GPU registers'
        ],
        correctIndex: 1,
        explanation: 'Adding two large 32-bit positive integers can exceed INT_MAX and overflow into a negative integer, causing out-of-bounds array access.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-dsa-3',
    title: 'Graph BFS vs DFS Traversal Patterns in 60s',
    description: 'Level-order queue exploration for unweighted shortest paths vs recursive stack backtracking for cycle detection.',
    category: 'Data Structures',
    subject: 'Graph Theory',
    topic: 'BFS & DFS Patterns',
    videoUrl: 'https://www.instagram.com/reel/C8qXY12v9aB/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C8qXY12v9aB',
    externalUrl: 'https://www.instagram.com/reel/C8qXY12v9aB/',
    channelName: 'LeetCode Daily',
    creatorId: 'user-mentor',
    creatorName: 'LeetCode Daily (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 58,
    likesCount: 8700,
    commentsCount: 220,
    sharesCount: 1950,
    viewsCount: 88000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Graph', 'BFS', 'DFS', 'InstagramReels'],
    createdAt: '2026-08-23T02:00:00Z',
    questions: [
      {
        id: 'q-dsa-3',
        category: 'Data Structures',
        type: 'true_false',
        prompt: 'Breadth-First Search (BFS) using a First-In-First-Out (FIFO) queue guarantees finding the shortest path on unweighted graphs.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Because BFS explores all nodes at distance k before moving to distance k+1, the first time a target vertex is reached represents its shortest path.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-dsa-4',
    title: 'Dynamic Programming Memoization Blueprint in 60s',
    description: 'The 3-step blueprint for mastering DP: recursive base case, overlapping subproblems cache check, and state transitions.',
    category: 'Data Structures',
    subject: 'Dynamic Programming',
    topic: 'DP Memoization Blueprint',
    videoUrl: 'https://www.youtube.com/shorts/0ZJgIjIuY7U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: '0ZJgIjIuY7U',
    externalUrl: 'https://www.youtube.com/shorts/0ZJgIjIuY7U',
    channelName: 'Errichto Algorithms',
    creatorId: 'user-mentor',
    creatorName: 'Errichto (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 56,
    likesCount: 10400,
    commentsCount: 310,
    sharesCount: 2800,
    viewsCount: 105000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['DP', 'Algorithms', 'Memoization', 'YouTubeShorts'],
    createdAt: '2026-08-23T03:00:00Z',
    questions: [
      {
        id: 'q-dsa-4',
        category: 'Data Structures',
        type: 'mcq',
        prompt: 'What two fundamental characteristics must a problem exhibit to be solvable via Dynamic Programming?',
        options: [
          'Randomized inputs and sorting invariants',
          'Optimal Substructure and Overlapping Subproblems',
          'Binary representation and constant stack depth',
          'Graph bipartite topology and tree balance'
        ],
        correctIndex: 1,
        explanation: 'Optimal substructure means optimal solutions to subproblems combine into the global optimum, and overlapping subproblems allow memoization to reuse solved states.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-dsa-5',
    title: 'Monotonic Stack & Next Greater Element in 60s',
    description: 'Solve complex O(N^2) histogram and temperature lookups in clean linear O(N) time with monotonic stacks.',
    category: 'Data Structures',
    subject: 'Advanced DSA',
    topic: 'Monotonic Stack',
    videoUrl: 'https://www.instagram.com/reel/C9rZ128v1aC/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C9rZ128v1aC',
    externalUrl: 'https://www.instagram.com/reel/C9rZ128v1aC/',
    channelName: 'AlgoMaster',
    creatorId: 'user-mentor',
    creatorName: 'AlgoMaster (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 58,
    likesCount: 7900,
    commentsCount: 185,
    sharesCount: 1650,
    viewsCount: 81000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Stack', 'MonotonicStack', 'Algorithms', 'InstagramReels'],
    createdAt: '2026-08-23T04:00:00Z',
    questions: [
      {
        id: 'q-dsa-5',
        category: 'Data Structures',
        type: 'mcq',
        prompt: 'Why does a monotonic stack algorithm execute in overall O(N) linear time despite having a while loop nested inside an array for-loop?',
        options: [
          'Because the CPU executes the while loop in parallel',
          'Because each element is pushed onto the stack exactly once and popped at most once across the entire run',
          'Because stack size is capped at 10 items',
          'Because it uses tail recursion optimization'
        ],
        correctIndex: 1,
        explanation: 'Amortized analysis proves that across all N iterations, at most N push operations and N pop operations occur, ensuring aggregate 2N = O(N) linear runtime.',
        difficulty: 'Advanced',
        marks: 20
      }
    ]
  },

  // ================= TOPIC 5: SYSTEM DESIGN & CLOUD ARCHITECTURE (5 REELS) =================
  {
    id: 'reel-sd-1',
    title: 'System Design: API Gateways vs Load Balancers in 60s',
    description: 'Master Layer 7 routing, rate limiting, authentication, SSL termination, and reverse proxying for high-scale microservices.',
    category: 'System Design',
    subject: 'System Architecture',
    topic: 'API Gateways & Load Balancing',
    videoUrl: 'https://www.instagram.com/reel/C8qXY12v9aB/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C8qXY12v9aB',
    externalUrl: 'https://www.instagram.com/reel/C8qXY12v9aB/',
    channelName: 'ByteByteGo',
    creatorId: 'user-mentor',
    creatorName: 'Alex Xu (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Advanced',
    durationSeconds: 60,
    likesCount: 6740,
    commentsCount: 195,
    sharesCount: 1890,
    viewsCount: 78200,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['SystemDesign', 'Architecture', 'Cloud', 'InstagramReels'],
    createdAt: '2026-08-24T00:00:00Z',
    questions: [
      {
        id: 'q-sd-1',
        category: 'System Design',
        type: 'true_false',
        prompt: 'An API Gateway operates at OSI Layer 7 (Application Layer) and can handle authentication, rate limiting, and request transformation, whereas a standard L4 load balancer only routes raw TCP packets.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! API Gateways inspect HTTP/REST headers and payloads (Layer 7) for auth and orchestration, whereas L4 load balancers forward packets at the TCP/UDP transport layer.',
        difficulty: 'Advanced',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-sd-2',
    title: 'SQL: Clustered vs Non-Clustered Indexes in 60s',
    description: 'Learn B-Tree root/leaf physical data ordering, leaf page lookups, and why a table can have only 1 clustered index.',
    category: 'System Design',
    subject: 'SQL & Database Design',
    topic: 'Indexing & B-Trees',
    videoUrl: 'https://www.instagram.com/reel/C9rZ128v1aC/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C9rZ128v1aC',
    externalUrl: 'https://www.instagram.com/reel/C9rZ128v1aC/',
    channelName: 'Database Masters',
    creatorId: 'user-mentor',
    creatorName: 'Hussein Nasser (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 55,
    likesCount: 6150,
    commentsCount: 160,
    sharesCount: 1420,
    viewsCount: 71400,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['SQL', 'DBMS', 'Indexes', 'InstagramReels'],
    createdAt: '2026-08-24T01:00:00Z',
    questions: [
      {
        id: 'q-sd-2',
        category: 'System Design',
        type: 'mcq',
        prompt: 'Why can a database table have only ONE Clustered Index, while having multiple Non-Clustered Indexes?',
        options: [
          'SQL standards limit index file sizes to 10MB',
          'The clustered index determines the physical on-disk sorting order of actual table row pages',
          'Non-clustered indexes are stored exclusively in temporary RAM caches',
          'Foreign keys automatically convert into secondary clustered indexes'
        ],
        correctIndex: 1,
        explanation: 'Data rows on disk can physically only be sorted in a single sequence, which is governed by the table clustered index.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-sd-3',
    title: 'Docker: Containers vs Virtual Machines in 60s',
    description: 'Understand Hypervisors vs Linux OS-level kernel namespaces and cgroups for lightweight container virtualization.',
    category: 'System Design',
    subject: 'DevOps & Containers',
    topic: 'Docker & Virtualization',
    videoUrl: 'https://www.youtube.com/shorts/G3e-cpL7ofc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'G3e-cpL7ofc',
    externalUrl: 'https://www.youtube.com/shorts/G3e-cpL7ofc',
    channelName: 'NetworkChuck',
    creatorId: 'user-mentor',
    creatorName: 'Chuck Keith (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Beginner',
    durationSeconds: 58,
    likesCount: 12400,
    commentsCount: 380,
    sharesCount: 4200,
    viewsCount: 145000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Docker', 'DevOps', 'Containers', 'YouTubeShorts'],
    createdAt: '2026-08-24T02:00:00Z',
    questions: [
      {
        id: 'q-sd-3',
        category: 'System Design',
        type: 'mcq',
        prompt: 'What is the primary architectural difference between a Docker container and a standard Type-2 Virtual Machine?',
        options: [
          'Containers bundle a complete guest operating system kernel inside every image',
          'Containers share the host operating system kernel via Linux namespaces and cgroups, eliminating guest OS overhead',
          'Virtual machines cannot run on x86 architectures',
          'Containers require dedicated bare-metal hardware for each instance'
        ],
        correctIndex: 1,
        explanation: 'Containers virtualize at the OS kernel level (sharing the host kernel), while VMs virtualize hardware and run entire guest OS instances.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-sd-4',
    title: 'Cloud: S3 Object Storage vs Block Storage in 60s',
    description: 'Learn when to use AWS S3/Cloud Storage object buckets vs EBS block volumes for high throughput cloud architectures.',
    category: 'System Design',
    subject: 'Cloud Engineering',
    topic: 'AWS S3 & Cloud Storage',
    videoUrl: 'https://www.instagram.com/reel/C7nXY99p3bA/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    source: 'instagram',
    platformEmbedId: 'C7nXY99p3bA',
    externalUrl: 'https://www.instagram.com/reel/C7nXY99p3bA/',
    channelName: 'Cloud Academy',
    creatorId: 'user-mentor',
    creatorName: 'Stephane Maarek (Instagram)',
    creatorRole: 'Mentor',
    difficulty: 'Intermediate',
    durationSeconds: 56,
    likesCount: 6890,
    commentsCount: 175,
    sharesCount: 1820,
    viewsCount: 75000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Cloud', 'AWS', 'S3', 'InstagramReels'],
    createdAt: '2026-08-24T03:00:00Z',
    questions: [
      {
        id: 'q-sd-4',
        category: 'System Design',
        type: 'mcq',
        prompt: 'Which feature makes Object Storage (like AWS S3) ideal for media & documents over Block Storage (like AWS EBS)?',
        options: [
          'Object storage can be formatted as a bootable OS root filesystem',
          'Object storage provides flat RESTful key-value HTTP access with infinite scaling and custom metadata tags',
          'Object storage requires dedicated NVMe physical cables',
          'Object storage only stores data in volatile RAM caches'
        ],
        correctIndex: 1,
        explanation: 'Object storage provides HTTP/REST GET/PUT access with arbitrary metadata, massive horizontal elasticity, and 99.999999999% durability.',
        difficulty: 'Intermediate',
        marks: 20
      }
    ]
  },
  {
    id: 'reel-sd-5',
    title: 'Git: Rebase vs Merge Visualized in 60s',
    description: 'Understand linear fast-forward git rebase commit replay vs merge commit graph topology for team pull requests.',
    category: 'System Design',
    subject: 'Git & Version Control',
    topic: 'Git Branching & Rebase',
    videoUrl: 'https://www.youtube.com/shorts/f1wnYdLEpgI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    platformEmbedId: 'f1wnYdLEpgI',
    externalUrl: 'https://www.youtube.com/shorts/f1wnYdLEpgI',
    channelName: 'Git Mastery',
    creatorId: 'user-mentor',
    creatorName: 'Git Mastery (YouTube)',
    creatorRole: 'Mentor',
    difficulty: 'Beginner',
    durationSeconds: 54,
    likesCount: 9450,
    commentsCount: 290,
    sharesCount: 2800,
    viewsCount: 108000,
    isLiked: false,
    isBookmarked: false,
    isPublished: true,
    tags: ['Git', 'DevOps', 'VersionControl', 'YouTubeShorts'],
    createdAt: '2026-08-24T04:00:00Z',
    questions: [
      {
        id: 'q-sd-5',
        category: 'System Design',
        type: 'true_false',
        prompt: '`git rebase` rewrites commit hashes by picking your branch commits and replaying them on top of the latest target branch tip, creating a clean linear commit history.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Rebase replays your commits one by one on the new base, generating new commit SHA hashes and keeping commit logs linear.',
        difficulty: 'Beginner',
        marks: 20
      }
    ]
  }
];

// Helper to generate 5 vertical course reels for Courses (YouTube Shorts & Instagram Reels only)
const createCourseReels = (courseId: string, baseTopic: string, titles: string[]): CourseReel[] => [
  {
    id: `${courseId}-reel-1`,
    courseId,
    order: 1,
    title: `Reel 1: ${titles[0] || 'Fundamentals & Core Concepts'}`,
    description: `Foundations of ${baseTopic}, architectural paradigms, and development environment setup.`,
    topic: `${baseTopic} - Part 1`,
    durationSeconds: 54,
    videoUrl: 'https://www.youtube.com/shorts/k9TUPpGqYTo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    likesCount: 1420,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-2`,
    courseId,
    order: 2,
    title: `Reel 2: ${titles[1] || 'Core Implementation & Deep Dive'}`,
    description: `Hands-on code execution, internals, memory anatomy, and execution lifecycle.`,
    topic: `${baseTopic} - Part 2`,
    durationSeconds: 58,
    videoUrl: 'https://www.instagram.com/reel/C8qXY12v9aB/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    likesCount: 1180,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-3`,
    courseId,
    order: 3,
    title: `Reel 3: ${titles[2] || 'Advanced Patterns & Architecture'}`,
    description: `Resilient architectural patterns, error handling, and production-grade best practices.`,
    topic: `${baseTopic} - Part 3`,
    durationSeconds: 52,
    videoUrl: 'https://www.youtube.com/shorts/Mus_vwhTCq0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    likesCount: 950,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-4`,
    courseId,
    order: 4,
    title: `Reel 4: ${titles[3] || 'Performance Tuning & Optimization'}`,
    description: `Profiling bottlenecks, memory optimization, caching strategies, and latency minimization.`,
    topic: `${baseTopic} - Part 4`,
    durationSeconds: 56,
    videoUrl: 'https://www.instagram.com/reel/C9rZ128v1aC/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    likesCount: 820,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  },
  {
    id: `${courseId}-reel-5`,
    courseId,
    order: 5,
    title: `Reel 5: ${titles[4] || 'Production Deployment & Case Studies'}`,
    description: `Deploying to production, telemetry monitoring, real-world case studies, and certification readiness.`,
    topic: `${baseTopic} - Part 5`,
    durationSeconds: 60,
    videoUrl: 'https://www.youtube.com/shorts/0ZJgIjIuY7U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    likesCount: 1340,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false
  }
];

// COMPREHENSIVE MULTI-PLATFORM COURSES (YouTube, Udemy, Coursera, edX)
export const INITIAL_COURSES: Course[] = [
  // 1. YOUTUBE - CS50 Harvard
  {
    id: 'course-yt-cs50',
    title: 'CS50x: Introduction to Computer Science',
    subtitle: 'Harvard University / Prof. David J. Malan',
    description: 'An introduction to the intellectual enterprises of computer science and the art of programming. Covers C, Python, SQL, HTML, CSS, JavaScript, memory management, algorithms, and data structures.',
    category: 'DSA',
    platform: 'youtube',
    platformUrl: 'https://www.youtube.com/watch?v=8mAITcNt710',
    certificateIncluded: true,
    price: 0,
    discountedPrice: 0,
    instructorId: 'user-mentor',
    instructorName: 'Prof. David J. Malan (Harvard / YouTube)',
    instructorBio: 'Gordon McKay Professor of the Practice of Computer Science at Harvard University.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    level: 'Beginner',
    rating: 4.98,
    reviewsCount: 38400,
    studentsCount: 420000,
    status: 'published',
    progressPercent: 0,
    durationHours: 25,
    lessonsCount: 12,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Master computational thinking, binary algorithms, and algorithmic complexity O(N)',
      'Write robust programs in C with pointers, dynamic memory allocation, and hash tables',
      'Build modern web applications with Python, Flask, and SQLite databases',
      'Earn official Harvard CS50 verification milestone'
    ],
    modules: [],
    createdAt: '2026-08-01T00:00:00Z'
  },

  // 2. YOUTUBE - freeCodeCamp Full Stack
  {
    id: 'course-yt-fullstack',
    title: 'Full Stack Web Development Masterclass 2026',
    subtitle: 'freeCodeCamp / Beau Carnes',
    description: 'Complete hands-on curriculum covering modern React 19, Node.js, Express, PostgreSQL, Prisma ORM, Tailwind CSS, TypeScript, and Docker deployment.',
    category: 'Web Dev',
    platform: 'youtube',
    platformUrl: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
    certificateIncluded: true,
    price: 0,
    discountedPrice: 0,
    instructorId: 'user-mentor',
    instructorName: 'freeCodeCamp Team (YouTube)',
    instructorBio: 'Open-source educator empowering millions of software engineers worldwide.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    level: 'All Levels',
    rating: 4.93,
    reviewsCount: 24500,
    studentsCount: 310000,
    status: 'published',
    progressPercent: 0,
    durationHours: 18,
    lessonsCount: 10,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Build end-to-end full stack SaaS applications with React and Node.js',
      'Implement JWT authentication, role-based access control, and PostgreSQL schemas',
      'Deploy applications with Docker containers and CI/CD pipelines'
    ],
    modules: [],
    createdAt: '2026-08-05T00:00:00Z'
  },

  // 3. YOUTUBE - Machine Learning Stanford
  {
    id: 'course-yt-ml',
    title: 'Machine Learning Specialization: Core Algorithms',
    subtitle: 'Stanford University / Andrew Ng (YouTube)',
    description: 'Learn foundational machine learning principles: Linear Regression, Logistic Regression, Neural Networks, Decision Trees, Random Forests, and Unsupervised Clustering.',
    category: 'AI & Engineering',
    platform: 'youtube',
    platformUrl: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
    certificateIncluded: true,
    price: 0,
    discountedPrice: 0,
    instructorId: 'user-mentor',
    instructorName: 'Prof. Andrew Ng (Stanford / YouTube)',
    instructorBio: 'Adjunct Professor at Stanford University and Founder of DeepLearning.AI.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.96,
    reviewsCount: 19800,
    studentsCount: 185000,
    status: 'published',
    progressPercent: 0,
    durationHours: 14,
    lessonsCount: 8,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Master Gradient Descent, Loss Functions, and Regularization (L1/L2)',
      'Implement multi-layer perceptrons in NumPy and PyTorch from scratch',
      'Evaluate ML models using Precision, Recall, ROC-AUC, and Cross-Validation'
    ],
    modules: [],
    createdAt: '2026-08-08T00:00:00Z'
  },

  // 4. UDEMY - Angela Yu Web Dev Bootcamp
  {
    id: 'course-udemy-web',
    title: 'The Complete 2026 Web Development Bootcamp',
    subtitle: 'Dr. Angela Yu / Udemy Bestseller',
    description: 'The #1 rated web development bootcamp on Udemy. Learn HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Web3 DApps, and build 16 real-world portfolio projects.',
    category: 'Web Dev',
    platform: 'udemy',
    platformUrl: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
    certificateIncluded: true,
    price: 89,
    discountedPrice: 19,
    instructorId: 'user-mentor',
    instructorName: 'Dr. Angela Yu (Udemy)',
    instructorBio: 'Lead Instructor at the London App Brewery and top-rated Udemy author.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
    level: 'Beginner',
    rating: 4.89,
    reviewsCount: 340000,
    studentsCount: 1250000,
    status: 'published',
    progressPercent: 0,
    durationHours: 65,
    lessonsCount: 32,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Build fully functional web applications from scratch with React & Node',
      'Create and deploy RESTful APIs with MongoDB and Express middleware',
      'Master Git version control, GitHub workflows, and production hosting'
    ],
    modules: [],
    createdAt: '2026-08-10T00:00:00Z'
  },

  // 5. UDEMY - Stephane Maarek AWS Solutions Architect
  {
    id: 'course-udemy-aws',
    title: 'Ultimate AWS Certified Solutions Architect Associate (SAA-C03)',
    subtitle: 'Stephane Maarek / Udemy AWS Bestseller',
    description: 'Pass the AWS Certified Solutions Architect exam. Deep-dive into EC2, S3, RDS, DynamoDB, Lambda, VPC networking, IAM security, ECS, and Serverless architectures.',
    category: 'Cloud',
    platform: 'udemy',
    platformUrl: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
    certificateIncluded: true,
    price: 79,
    discountedPrice: 18,
    instructorId: 'user-mentor',
    instructorName: 'Stephane Maarek (Udemy)',
    instructorBio: 'AWS Certified Solutions Architect Professional & Alexa Champion.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.91,
    reviewsCount: 180000,
    studentsCount: 820000,
    status: 'published',
    progressPercent: 0,
    durationHours: 28,
    lessonsCount: 18,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Design highly available, fault-tolerant, and resilient cloud architectures on AWS',
      'Configure VPC subnets, route tables, internet gateways, and security groups',
      'Pass the official AWS SAA-C03 certification exam with confidence'
    ],
    modules: [],
    createdAt: '2026-08-12T00:00:00Z'
  },

  // 6. UDEMY - Abdul Bari DSA
  {
    id: 'course-udemy-dsa',
    title: 'Mastering Data Structures & Algorithms using C and C++',
    subtitle: 'Abdul Bari / Udemy Algorithms Legend',
    description: 'Learn Data Structures & Algorithms visually: Recursion, Arrays, Linked Lists, Stacks, Queues, Binary Trees, AVL Trees, B-Trees, Graphs, Dynamic Programming, and Greedy Algorithms.',
    category: 'DSA',
    platform: 'udemy',
    platformUrl: 'https://www.udemy.com/course/datastructurescncpp/',
    certificateIncluded: true,
    price: 69,
    discountedPrice: 15,
    instructorId: 'user-mentor',
    instructorName: 'Abdul Bari (Udemy)',
    instructorBio: 'World-renowned Computer Science educator with 2M+ algorithm students.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.94,
    reviewsCount: 92000,
    studentsCount: 340000,
    status: 'published',
    progressPercent: 0,
    durationHours: 58,
    lessonsCount: 25,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Master memory pointer manipulation and Big-O asymptotic analysis',
      'Implement all fundamental data structures from scratch in C/C++',
      'Ace technical FAANG/MANG data structures & algorithms coding interviews'
    ],
    modules: [],
    createdAt: '2026-08-14T00:00:00Z'
  },

  // 7. COURSERA - Deep Learning Specialization Andrew Ng
  {
    id: 'course-coursera-dl',
    title: 'Deep Learning Specialization',
    subtitle: 'DeepLearning.AI & Prof. Andrew Ng / Coursera',
    description: 'Master deep learning fundamentals: Neural Networks, Hyperparameter Tuning, Convolutional Neural Networks (CNNs), Sequence Models, Transformers, and LLMs.',
    category: 'AI & Engineering',
    platform: 'coursera',
    platformUrl: 'https://www.coursera.org/specializations/deep-learning',
    certificateIncluded: true,
    price: 49,
    discountedPrice: 49,
    instructorId: 'user-mentor',
    instructorName: 'Prof. Andrew Ng & DeepLearning.AI (Coursera)',
    instructorBio: 'Co-Founder of Coursera and global AI pioneer.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    level: 'Advanced',
    rating: 4.97,
    reviewsCount: 220000,
    studentsCount: 980000,
    status: 'published',
    progressPercent: 0,
    durationHours: 45,
    lessonsCount: 20,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Build and train Deep Neural Networks with Adam, RMSprop, and Batch Normalization',
      'Implement ResNet, YOLO Object Detection, and CNNs for Computer Vision',
      'Develop NLP models with LSTM, GRU, Self-Attention, and Transformer architectures'
    ],
    modules: [],
    createdAt: '2026-08-15T00:00:00Z'
  },

  // 8. COURSERA - Google Cloud Architecture
  {
    id: 'course-coursera-gcp',
    title: 'Google Cloud Architecture Professional Certificate',
    subtitle: 'Google Cloud Training / Coursera',
    description: 'Official Google Cloud professional curriculum covering Compute Engine, Google Kubernetes Engine (GKE), Cloud SQL, BigQuery, Cloud Spanner, and IAM security.',
    category: 'Cloud',
    platform: 'coursera',
    platformUrl: 'https://www.coursera.org/professional-certificates/gcp-cloud-architect',
    certificateIncluded: true,
    price: 49,
    discountedPrice: 49,
    instructorId: 'user-mentor',
    instructorName: 'Google Cloud Training Team (Coursera)',
    instructorBio: 'Google Cloud certified architects and engineers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    level: 'Advanced',
    rating: 4.86,
    reviewsCount: 45000,
    studentsCount: 240000,
    status: 'published',
    progressPercent: 0,
    durationHours: 35,
    lessonsCount: 15,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Architect robust enterprise solutions on Google Cloud Platform',
      'Deploy containerized microservices on Google Kubernetes Engine (GKE)',
      'Prepare for the Google Cloud Professional Cloud Architect certification'
    ],
    modules: [],
    createdAt: '2026-08-16T00:00:00Z'
  },

  // 9. COURSERA - Meta Front-End Developer
  {
    id: 'course-coursera-meta',
    title: 'Meta Front-End Developer Professional Certificate',
    subtitle: 'Meta Staff Engineers / Coursera',
    description: 'Launch your career as a Front-End Developer with official Meta curriculum. Master HTML5, CSS3, JavaScript, React, UI/UX Design, and Version Control with Git.',
    category: 'Web Dev',
    platform: 'coursera',
    platformUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    certificateIncluded: true,
    price: 49,
    discountedPrice: 49,
    instructorId: 'user-mentor',
    instructorName: 'Meta Staff Engineers (Coursera)',
    instructorBio: 'Engineers from Meta (Facebook, Instagram, WhatsApp).',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    level: 'Beginner',
    rating: 4.82,
    reviewsCount: 68000,
    studentsCount: 310000,
    status: 'published',
    progressPercent: 0,
    durationHours: 40,
    lessonsCount: 16,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Create interactive React applications using hooks, state management, and props',
      'Build responsive, mobile-first web pages using modern CSS and Figma designs',
      'Earn the industry-recognized Meta Front-End Developer certificate'
    ],
    modules: [],
    createdAt: '2026-08-17T00:00:00Z'
  },

  // 10. EDX - MIT 6.00.1x Python
  {
    id: 'course-edx-mit',
    title: 'MIT 6.00.1x: Introduction to Computer Science and Programming Using Python',
    subtitle: 'Massachusetts Institute of Technology / Prof. John Guttag',
    description: 'MIT\'s flagship introductory computer science course. Covers algorithmic thinking, data structures, computational complexity, object-oriented programming, and simulation models.',
    category: 'Python',
    platform: 'edx',
    platformUrl: 'https://www.edx.org/learn/computer-science/massachusetts-institute-of-technology-introduction-to-computer-science-and-programming-using-python',
    certificateIncluded: true,
    price: 0,
    discountedPrice: 0,
    instructorId: 'user-mentor',
    instructorName: 'Prof. John Guttag & Eric Grimson (MIT / edX)',
    instructorBio: 'Dugald C. Jackson Professor of Computer Science and Electrical Engineering at MIT.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    level: 'Beginner',
    rating: 4.92,
    reviewsCount: 110000,
    studentsCount: 650000,
    status: 'published',
    progressPercent: 0,
    durationHours: 36,
    lessonsCount: 14,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    learningOutcomes: [
      'Understand computation, Python syntax, control flow, and recursion',
      'Analyze algorithmic complexity and search/sort algorithms (Bisection, Merge Sort)',
      'Apply Object-Oriented Programming (OOP) and stochastic modeling'
    ],
    modules: [],
    createdAt: '2026-08-18T00:00:00Z'
  },

  // 11. VERIFIED LMS - Java Core Masterclass
  {
    id: 'course-java',
    title: 'Java Core & Modern Enterprise Architecture',
    subtitle: 'LMS Verified Faculty / Senior Architects',
    description: 'The definitive 5-reel Java engineering masterclass covering JVM bytecode, garbage collectors (ZGC/G1), Project Loom virtual threads, concurrent data structures, and Spring Boot 3 enterprise best practices.',
    category: 'Java',
    platform: 'lms',
    certificateIncluded: true,
    price: 79,
    discountedPrice: 49,
    instructorId: 'user-mentor',
    instructorName: 'LMS Verified Faculty',
    instructorBio: 'Senior AI Systems Architect with 15+ years enterprise experience.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    rating: 4.95,
    reviewsCount: 420,
    studentsCount: 12400,
    status: 'published',
    progressPercent: 0,
    durationHours: 5,
    lessonsCount: 5,
    reelsCount: 5,
    quizzesCount: 1,
    assignmentsCount: 1,
    reels: createCourseReels('course-java', 'Java Core', [
      'JVM Memory Model & Metaspace Anatomy',
      'Java 21 Pattern Matching & Record Deconstruction',
      'Virtual Threads & Structured Concurrency in Project Loom',
      'Lock-Free Ring Buffers with Atomic VarHandles',
      'Production Spring Boot 3 Reactive Microservices'
    ]),
    learningOutcomes: [
      'Master JVM memory anatomy and optimize Garbage Collection for sub-millisecond pauses',
      'Build scalable I/O services using Java 21 Virtual Threads and Structured Concurrency',
      'Write rock-solid enterprise backend services with Spring Boot 3 and JPA',
      'Earn the verified Java Specialist badge'
    ],
    modules: [],
    createdAt: '2026-08-12T00:00:00Z'
  }
];

export const INITIAL_LESSONS: Lesson[] = [];

// COMPREHENSIVE COMPANY-SPECIFIC INTERVIEW ROUNDS, APTITUDE TESTS & COURSE QUIZZES
export const INITIAL_QUIZZES: Quiz[] = [
  // 1. GOOGLE SWE TECHNICAL INTERVIEW
  {
    id: 'quiz-google-swe',
    title: 'Google Software Engineering: Algorithms & System Internals',
    description: 'Targeted Google technical round questions covering Trie prefix trees, Dynamic Programming memoization, Graph algorithms (Dijkstra), Big-O asymptotic analysis, and distributed MapReduce fundamentals.',
    category: 'Top Tech Giants',
    company: 'Google',
    targetRole: 'Software Engineer (L4/L5)',
    difficulty: 'Advanced',
    durationMinutes: 15,
    totalMarks: 50,
    passingPercentage: 80,
    rewardXp: 250,
    createdAt: '2026-08-25T00:00:00Z',
    questions: [
      {
        id: 'q-goog-1',
        category: 'DSA & Algorithms',
        type: 'mcq',
        prompt: 'In a Google-scale search autocomplete system, which data structure provides optimal O(K) prefix lookup time where K is the prefix length, independent of total dictionary size N?',
        options: [
          'Binary Search Tree (BST)',
          'Trie (Prefix Tree) with top-ranked suggestions cached at each node',
          'Singly Linked List with linear search',
          'Max-Heap sorted by word frequency'
        ],
        correctIndex: 1,
        explanation: 'A Trie explores prefix characters in O(K) steps directly along branch edges. Storing top precomputed search queries at each node yields instant sub-millisecond autocompletion.',
        difficulty: 'Advanced',
        marks: 10
      },
      {
        id: 'q-goog-2',
        category: 'Algorithms',
        type: 'mcq',
        prompt: 'What is the tightest worst-case time complexity of finding the Single Source Shortest Path on a weighted directed graph with non-negative edge weights using Dijkstra with a Min-Indexed Binary Heap?',
        options: [
          'O(V * E)',
          'O((V + E) * log V)',
          'O(V^3)',
          'O(E^2)'
        ],
        correctIndex: 1,
        explanation: 'Dijkstra with a Min-Heap performs |V| vertex extract-min operations (O(V log V)) and at most |E| edge relaxation key updates (O(E log V)), summing to O((V + E) log V).',
        difficulty: 'Advanced',
        marks: 10
      },
      {
        id: 'q-goog-3',
        category: 'System Design',
        type: 'mcq',
        prompt: 'In distributed computing frameworks like Google MapReduce or Apache Spark, what is the purpose of the "Shuffle & Sort" phase between Map and Reduce?',
        options: [
          'To encrypt disk blocks with AES-256',
          'To partition and group intermediate (Key, Value) pairs by key so that all values for a given key arrive at the same Reducer node',
          'To eliminate duplicate web pages from crawling spiders',
          'To compress video streams for YouTube playback'
        ],
        correctIndex: 1,
        explanation: 'The Shuffle phase routes all intermediate outputs sharing identical keys across cluster network partitions to the designated worker node hosting that key reducer.',
        difficulty: 'Advanced',
        marks: 10
      },
      {
        id: 'q-goog-4',
        category: 'Dynamic Programming',
        type: 'true_false',
        prompt: 'Top-Down DP with Memoization and Bottom-Up DP with Tabulation share the same asymptotic asymptotic Big-O time and state space complexities for the 0/1 Knapsack problem.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Both approaches evaluate the exact same subproblem state space grid of O(N * W), with top-down leveraging recursive memoization and bottom-up building the iterative matrix.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-goog-5',
        category: 'Operating Systems',
        type: 'mcq',
        prompt: 'Why do high-performance servers prefer asynchronous non-blocking epoll (Linux) / kqueue (BSD) event polling over traditional select() or poll() syscalls for handling 100,000 concurrent socket connections?',
        options: [
          'epoll runs without any operating system kernel context',
          'epoll is O(1) per ready event by returning only active file descriptors via kernel event queues, whereas select/poll require O(N) linear array scanning of all 100,000 descriptors on every tick',
          'select() limits memory buffers to 64 bytes per request',
          'epoll disables TCP packet checksums'
        ],
        correctIndex: 1,
        explanation: 'epoll uses a kernel-managed ready list (O(1) active event dispatch), avoiding the O(N) descriptor iteration penalty that degrades select() and poll() under high concurrency (C10K/C100K problem).',
        difficulty: 'Advanced',
        marks: 10
      }
    ]
  },

  // 2. AMAZON / AWS CLOUD ARCHITECT & SDE INTERVIEW
  {
    id: 'quiz-amazon-sde',
    title: 'Amazon AWS: Scalable Distributed Systems & Cloud Architecture',
    description: 'Amazon SDE and Solutions Architect interview questions covering the CAP theorem, DynamoDB single-table design, asynchronous SQS/Lambda decoupled pipelines, and multi-region fault tolerance.',
    category: 'Top Tech Giants',
    company: 'Amazon',
    targetRole: 'AWS Solutions Architect / SDE II',
    difficulty: 'Advanced',
    durationMinutes: 15,
    totalMarks: 50,
    passingPercentage: 80,
    rewardXp: 250,
    createdAt: '2026-08-25T00:00:00Z',
    questions: [
      {
        id: 'q-amz-1',
        category: 'Cloud Architecture',
        type: 'mcq',
        prompt: 'According to Eric Brewer\'s CAP Theorem, when an unavoidable network partition (P) occurs between AWS availability zones, what fundamental architectural trade-off must a distributed database make?',
        options: [
          'It must sacrifice storage encryption',
          'It must choose between Consistency (returning latest write or erroring) vs Availability (returning stale data without errors)',
          'It must switch from IPv6 to IPv4',
          'It must convert all relational tables into flat CSV files'
        ],
        correctIndex: 1,
        explanation: 'During a network partition, a distributed system cannot guarantee both immediate strong consistency across isolated nodes and 100% availability for incoming writes.',
        difficulty: 'Advanced',
        marks: 10
      },
      {
        id: 'q-amz-2',
        category: 'Database Design',
        type: 'mcq',
        prompt: 'What is the primary motivation for adopting DynamoDB "Single-Table Design" in high-scale Amazon retail and Prime microservices?',
        options: [
          'To reduce the total number of AWS accounts required',
          'To retrieve multiple heterogeneous related entities (e.g. Order + OrderItems + Customer) in a single ultra-fast indexed query without relational JOIN latency',
          'To prevent DynamoDB from creating secondary indexes',
          'To enforce strict SQL foreign key constraints'
        ],
        correctIndex: 1,
        explanation: 'Single-table design co-locates related items under shared Partition Keys (PK) and composite Sort Keys (SK), fetching full hierarchical documents in a single predictable sub-10ms query.',
        difficulty: 'Advanced',
        marks: 10
      },
      {
        id: 'q-amz-3',
        category: 'System Resilience',
        type: 'mcq',
        prompt: 'How does an Amazon SQS Dead-Letter Queue (DLQ) paired with Exponential Backoff and Jitter protect downstream payment APIs during traffic spikes?',
        options: [
          'It automatically deletes failed transactions without notification',
          'It isolates poison-pill messages after max retry thresholds and desynchronizes retry thundering herds across distributed clients',
          'It bypasses credit card fraud validation rules',
          'It forces all HTTP requests to use port 80'
        ],
        correctIndex: 1,
        explanation: 'DLQs capture unprocessable messages for root cause inspection, while exponential backoff with randomized jitter prevents synchronized retry storms from crashing recovered services.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-amz-4',
        category: 'Cloud Architecture',
        type: 'true_false',
        prompt: 'Amazon S3 provides strong read-after-write consistency for PUT and DELETE requests of objects in all AWS Regions with zero extra latency penalty.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Since December 2020, Amazon S3 delivers automatic strong read-after-write consistency for all HTTP GET, PUT, and LIST operations across all regions.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-amz-5',
        category: 'Distributed Systems',
        type: 'mcq',
        prompt: 'When designing an Idempotent API endpoint for Amazon checkout orders, what is the best practice to prevent double-charging on network retries?',
        options: [
          'Ask the user to refresh their browser after 5 seconds',
          'Include a unique client-generated Idempotency-Key in the request header and verify it against a distributed cache/DB before processing payment',
          'Disable TLS SSL encryption during checkout',
          'Execute charges asynchronously on a random timer'
        ],
        correctIndex: 1,
        explanation: 'An Idempotency Key guarantees that duplicate payment requests containing the same unique token return the original transaction receipt without executing duplicate charges.',
        difficulty: 'Intermediate',
        marks: 10
      }
    ]
  },

  // 3. MICROSOFT ENTERPRISE SOFTWARE ENGINEERING
  {
    id: 'quiz-microsoft-swe',
    title: 'Microsoft Software Engineering: OOP Design Patterns & Concurrency',
    description: 'Microsoft technical interview assessment evaluating SOLID architecture principles, GoF Design Patterns, Thread Pool management, and resilient Cloud Microservices.',
    category: 'Top Tech Giants',
    company: 'Microsoft',
    targetRole: 'Software Engineer II (Azure / Core Apps)',
    difficulty: 'Intermediate',
    durationMinutes: 12,
    totalMarks: 50,
    passingPercentage: 80,
    rewardXp: 200,
    createdAt: '2026-08-25T00:00:00Z',
    questions: [
      {
        id: 'q-ms-1',
        category: 'OOP & Architecture',
        type: 'mcq',
        prompt: 'Which SOLID principle is violated when a derived subclass overrides a base class method with an implementation that throws a `NotSupportedException`?',
        options: [
          'Single Responsibility Principle (SRP)',
          'Liskov Substitution Principle (LSP)',
          'Interface Segregation Principle (ISP)',
          'Open-Closed Principle (OCP)'
        ],
        correctIndex: 1,
        explanation: 'LSP requires that objects of a superclass should be replaceable with objects of a subclass without breaking application correctness or throwing unexpected unsupported exceptions.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-ms-2',
        category: 'Design Patterns',
        type: 'mcq',
        prompt: 'In Microsoft Azure microservice architectures, which design pattern prevents an application from repeatedly attempting an operation that is guaranteed to fail (e.g. downstream service outage)?',
        options: [
          'Singleton Pattern',
          'Circuit Breaker Pattern',
          'Decorator Pattern',
          'Flyweight Pattern'
        ],
        correctIndex: 1,
        explanation: 'The Circuit Breaker pattern trips from CLOSED to OPEN state upon reaching failure thresholds, instantly failing fast and allowing downstream dependencies time to heal before transitioning to HALF-OPEN.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-ms-3',
        category: 'Concurrency',
        type: 'true_false',
        prompt: 'In asynchronous C# (.NET) / TypeScript async-await programming, awaiting an I/O-bound Task releases the current thread back to the runtime Thread Pool while waiting for I/O completion.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Non-blocking async/await registers a continuation callback with the OS I/O completion port and frees the caller thread to handle other CPU work.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-ms-4',
        category: 'Memory Management',
        type: 'mcq',
        prompt: 'What causes a memory leak in a managed runtime environment with automatic Garbage Collection (e.g. .NET CLR or Java JVM)?',
        options: [
          'Using too many integer variables',
          'Unreleased object references remaining rooted in active static fields, global event listeners, or singleton caches',
          'Garbage collectors running out of CPU cycles',
          'Compiling in Release mode instead of Debug'
        ],
        correctIndex: 1,
        explanation: 'Garbage collectors trace reachable objects from GC Roots (static fields, active thread stacks). Retaining unneeded object pointers in event handlers or long-lived caches prevents reclamation.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-ms-5',
        category: 'Design Patterns',
        type: 'mcq',
        prompt: 'Which GoF behavioral design pattern is utilized when creating a decoupled Event Broker where publishers emit domain events without knowing which subscriber components will handle them?',
        options: [
          'Observer / Publish-Subscribe Pattern',
          'Factory Method Pattern',
          'Adapter Pattern',
          'Proxy Pattern'
        ],
        correctIndex: 0,
        explanation: 'The Observer/Pub-Sub pattern defines a one-to-many dependency between objects so that when one object changes state, all its registered dependents are notified automatically without tight coupling.',
        difficulty: 'Beginner',
        marks: 10
      }
    ]
  },

  // 4. META FRONT-END & FULL-STACK ENGINEER INTERVIEW
  {
    id: 'quiz-meta-fe',
    title: 'Meta: Front-End Architecture, React 19 & Web Performance',
    description: 'Meta technical interview round on React 19 Fiber Reconciler, JavaScript V8 Event Loop microtasks, browser DOM rendering pipeline, and high-frequency real-time web optimization.',
    category: 'Top Tech Giants',
    company: 'Meta',
    targetRole: 'Front-End / UI Software Engineer',
    difficulty: 'Advanced',
    durationMinutes: 12,
    totalMarks: 50,
    passingPercentage: 80,
    rewardXp: 200,
    createdAt: '2026-08-25T00:00:00Z',
    questions: [
      {
        id: 'q-meta-1',
        category: 'React Internals',
        type: 'mcq',
        prompt: 'What major capability does the React Fiber reconciler architecture provide over the legacy recursive Virtual DOM stack reconciler?',
        options: [
          'It compiles React code directly into WebAssembly binaries',
          'It enables interruptible incremental rendering by breaking UI render work into prioritizable chunks across requestIdleCallback time slices',
          'It eliminates the need for CSS stylesheets',
          'It forces all state variables into global window scope'
        ],
        correctIndex: 1,
        explanation: 'Fiber models the component tree as a linked-list work loop, allowing React to pause, prioritize, and resume rendering work to keep the browser main thread smooth and responsive at 60/120fps.',
        difficulty: 'Advanced',
        marks: 10
      },
      {
        id: 'q-meta-2',
        category: 'JavaScript Runtime',
        type: 'mcq',
        prompt: 'Given: `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);` — What is the exact output order in modern V8 engines?',
        options: [
          '1, 2, 3, 4',
          '1, 4, 3, 2',
          '1, 4, 2, 3',
          '3, 1, 4, 2'
        ],
        correctIndex: 1,
        explanation: 'Synchronous statements log 1 and 4. The call stack empties and the Event Loop processes all microtasks (Promise -> 3) before executing the next macrotask queue item (setTimeout -> 2). Result: 1, 4, 3, 2.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-meta-3',
        category: 'Web Performance',
        type: 'mcq',
        prompt: 'Which CSS property change triggers ONLY a fast GPU Compositing step without causing expensive Layout (Reflow) or Paint re-calculations?',
        options: [
          '`width` and `height`',
          '`transform: translate3d()` and `opacity`',
          '`top` and `left`',
          '`margin` and `padding`'
        ],
        correctIndex: 1,
        explanation: '`transform` and `opacity` promote elements to dedicated GPU compositor layers, executing smooth hardware-accelerated animations without triggering CPU layout reflows.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-meta-4',
        category: 'Web Architecture',
        type: 'true_false',
        prompt: 'Server-Sent Events (SSE) provide unidirectional server-to-client streaming over HTTP/2, whereas WebSockets establish a full-duplex bidirectional TCP communication channel.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! SSE uses standard HTTP streaming to push notifications from server to browser, while WebSockets establish persistent two-way socket messaging.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-meta-5',
        category: 'React Performance',
        type: 'mcq',
        prompt: 'Why should you avoid using array indices as `key` props on dynamic lists that support reordering, insertion, or deletion in React?',
        options: [
          'Array keys crash modern web browsers',
          'Index keys confuse React DOM reconciliation diffing, causing incorrect component state preservation and broken form input values',
          'React does not allow numeric keys',
          'Indices require 10x more memory'
        ],
        correctIndex: 1,
        explanation: 'When items are inserted or removed, array indices shift. React matches existing elements by key identity, erroneously associating previous component state with the shifted element.',
        difficulty: 'Beginner',
        marks: 10
      }
    ]
  },

  // 5. QUANTITATIVE & LOGICAL APTITUDE (CAMPUS PLACEMENTS / TECH GIANTS)
  {
    id: 'quiz-quant-aptitude',
    title: 'Campus Placement: Quantitative Aptitude & Numerical Reasoning',
    description: 'Essential quantitative aptitude assessment for software engineering recruitment drives (TCS, Infosys, Wipro, Accenture, Cognizant, Google, Amazon). Tests speed math, time & work, probability, and percentages.',
    category: 'Quantitative Aptitude',
    company: 'General / IT Giants',
    targetRole: 'All Engineering Graduates',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    totalMarks: 50,
    passingPercentage: 75,
    rewardXp: 180,
    createdAt: '2026-08-25T00:00:00Z',
    questions: [
      {
        id: 'q-apt-1',
        category: 'Time & Work',
        type: 'mcq',
        prompt: 'Worker A can complete a software sprint module in 12 days, and Worker B can complete it in 24 days. If they collaborate together, how many days will it take to finish the module?',
        options: [
          '6 days',
          '8 days',
          '10 days',
          '18 days'
        ],
        correctIndex: 1,
        explanation: 'Combined 1-day rate = (1/12) + (1/24) = (2 + 1)/24 = 3/24 = 1/8. Total time required = 8 days.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-apt-2',
        category: 'Speed, Time & Distance',
        type: 'mcq',
        prompt: 'A train traveling at a constant speed of 72 km/h crosses an electric pole in 15 seconds. What is the length of the train in meters?',
        options: [
          '200 meters',
          '300 meters',
          '360 meters',
          '450 meters'
        ],
        correctIndex: 1,
        explanation: 'Speed in m/s = 72 * (5/18) = 20 m/s. Distance (Train Length) = Speed * Time = 20 m/s * 15 s = 300 meters.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-apt-3',
        category: 'Probability & Combinatorics',
        type: 'mcq',
        prompt: 'Two fair 6-sided dice are rolled simultaneously. What is the mathematical probability that the sum of the rolled numbers equals exactly 8?',
        options: [
          '5/36',
          '1/6 (6/36)',
          '7/36',
          '1/9 (4/36)'
        ],
        correctIndex: 0,
        explanation: 'Total sample space = 6 * 6 = 36 outcomes. Pairs summing to 8 are: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes. Probability = 5/36.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-apt-4',
        category: 'Percentages & Profit/Loss',
        type: 'mcq',
        prompt: 'An online course is listed with a marked price of $200. The platform applies successive discounts of 20% followed by an additional 10%. What is the final checkout price?',
        options: [
          '$140',
          '$144',
          '$150',
          '$160'
        ],
        correctIndex: 1,
        explanation: 'After 1st discount (20%): $200 * 0.80 = $160. After 2nd discount (10%): $160 * 0.90 = $144.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-apt-5',
        category: 'Permutations & Combinations',
        type: 'mcq',
        prompt: 'In how many distinct ways can the letters of the word "REACT" be arranged such that the vowels (E, A) are always kept together as a single block?',
        options: [
          '24 ways',
          '48 ways',
          '120 ways',
          '240 ways'
        ],
        correctIndex: 1,
        explanation: 'Treat (EA) as 1 unit + 3 consonants (R, C, T) = 4 units arranged in 4! = 24 ways. The vowels (E, A) can internally arrange in 2! = 2 ways. Total = 24 * 2 = 48 ways.',
        difficulty: 'Intermediate',
        marks: 10
      }
    ]
  },

  // 6. LOGICAL REASONING & CRITICAL THINKING
  {
    id: 'quiz-logical-reasoning',
    title: 'Placement Assessment: Logical Reasoning, Data Sufficiency & Puzzles',
    description: 'Comprehensive logical reasoning exam covering Syllogisms, Pattern Sequences, Coding-Decoding, Seating Arrangements, and Critical Deduction for campus and off-campus placements.',
    category: 'Logical Reasoning',
    company: 'General / IT Giants',
    targetRole: 'Software Developer / Analyst',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    totalMarks: 50,
    passingPercentage: 75,
    rewardXp: 180,
    createdAt: '2026-08-25T00:00:00Z',
    questions: [
      {
        id: 'q-log-1',
        category: 'Syllogisms',
        type: 'mcq',
        prompt: 'Statements: "All developers write code." "Some code writers drink coffee." Conclusions: I. All developers drink coffee. II. Some developers may drink coffee.',
        options: [
          'Only Conclusion I follows',
          'Only Conclusion II follows',
          'Both I and II follow',
          'Neither follows'
        ],
        correctIndex: 1,
        explanation: 'Conclusion I is an overgeneralization not supported by "some". Conclusion II represents a valid logical possibility. Hence only Conclusion II follows.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-log-2',
        category: 'Number Series',
        type: 'mcq',
        prompt: 'Identify the next number in the sequence: 3, 7, 15, 31, 63, ?',
        options: [
          '125',
          '127',
          '128',
          '131'
        ],
        correctIndex: 1,
        explanation: 'Pattern is `(previous * 2) + 1`. (3*2)+1=7, (7*2)+1=15, (15*2)+1=31, (31*2)+1=63, (63*2)+1 = 127.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-log-3',
        category: 'Coding-Decoding',
        type: 'mcq',
        prompt: 'If in a certain cryptographic code, "ALGORITHM" is encoded as "BMHPSJUIN" (each letter shifted forward by +1), how is "PYTHON" encoded?',
        options: [
          'QZUIPO',
          'QZUIOP',
          'RAMIPO',
          'QZUJPO'
        ],
        correctIndex: 0,
        explanation: 'P(+1)->Q, Y(+1)->Z, T(+1)->U, H(+1)->I, O(+1)->P, N(+1)->O. Result = QZUIPO.',
        difficulty: 'Beginner',
        marks: 10
      },
      {
        id: 'q-log-4',
        category: 'Blood Relations',
        type: 'mcq',
        prompt: 'Pointing to a portrait of a software engineer, Alex said: "His father is the only son of my father." Who is in the portrait?',
        options: [
          'Alex\'s brother',
          'Alex\'s son',
          'Alex\'s father',
          'Alex himself'
        ],
        correctIndex: 1,
        explanation: '"The only son of my father" = Alex himself. "His father is Alex" means the person in the portrait is Alex\'s son.',
        difficulty: 'Intermediate',
        marks: 10
      },
      {
        id: 'q-log-5',
        category: 'Direction Sense',
        type: 'mcq',
        prompt: 'A robotics engineer walks 20 meters North, turns right and walks 30 meters, turns right again and walks 20 meters. How far and in which direction is she from the starting point?',
        options: [
          '30 meters East',
          '30 meters West',
          '50 meters North-East',
          '20 meters South'
        ],
        correctIndex: 0,
        explanation: 'The North (+20) and South (-20) displacements cancel out, leaving a net displacement of 30 meters directly East.',
        difficulty: 'Beginner',
        marks: 10
      }
    ]
  },

  // 7. CS50x HARVARD MASTERCLASS QUIZ
  {
    id: 'quiz-course-yt-cs50',
    courseId: 'course-yt-cs50',
    courseTitle: 'CS50x: Introduction to Computer Science',
    moduleId: 'mod-cs50-1',
    moduleTitle: 'Module 1: Computer Science Fundamentals',
    title: 'CS50x: Computer Science & Algorithmic Thinking Mastery Quiz',
    description: 'Harvard CS50 mastery assessment covering binary representations, C memory pointer arithmetic, hash collision resolution, and algorithm time complexity.',
    category: 'Course Milestone',
    company: 'Harvard University',
    targetRole: 'Computer Science Fundamentalist',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    totalMarks: 50,
    passingPercentage: 80,
    rewardXp: 150,
    createdAt: '2026-08-25T00:00:00Z',
    questions: [
      {
        id: 'q-cs50-1',
        category: 'DSA',
        type: 'mcq',
        prompt: 'In C programming, what does the dereference operator `*ptr` evaluate to when `ptr` holds a valid memory address?',
        options: [
          'The hexadecimal address where pointer ptr is stored on the stack',
          'The actual value stored in the heap/stack memory location that ptr points to',
          'The size of pointer ptr in bytes',
          'A null pointer exception'
        ],
        correctIndex: 1,
        explanation: 'The asterisk dereferences the pointer, directly accessing or mutating the value stored at the target memory address.',
        marks: 10
      },
      {
        id: 'q-cs50-2',
        category: 'DSA',
        type: 'mcq',
        prompt: 'What is the average lookup time complexity in a well-distributed Hash Table with N keys and B buckets using chaining for collision handling?',
        options: [
          'O(N^2)',
          'O(1) average time',
          'O(N log N)',
          'O(log N)'
        ],
        correctIndex: 1,
        explanation: 'A good hash function distributes keys uniformly across buckets with load factor N/B ≈ 1, achieving constant O(1) expected lookup time.',
        marks: 10
      },
      {
        id: 'q-cs50-3',
        category: 'Algorithms',
        type: 'true_false',
        prompt: 'Merge Sort is a stable sorting algorithm with guaranteed O(N log N) worst-case time complexity, whereas QuickSort can degrade to O(N^2) on poorly chosen pivots.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Merge Sort always halves the array evenly (O(N log N)), while naive QuickSort can degrade to O(N^2) if the pivot is already the minimum/maximum element.',
        marks: 10
      },
      {
        id: 'q-cs50-4',
        category: 'Memory Management',
        type: 'mcq',
        prompt: 'What severe runtime error occurs in C when dynamic memory allocated with `malloc()` is never released with `free()` before pointers lose scope?',
        options: [
          'Segmentation Fault',
          'Memory Leak',
          'Stack Overflow',
          'Bus Error'
        ],
        correctIndex: 1,
        explanation: 'Unfreed heap allocations remain reserved by the process OS memory map, gradually exhausting available system RAM (Memory Leak).',
        marks: 10
      },
      {
        id: 'q-cs50-5',
        category: 'Binary & Architecture',
        type: 'mcq',
        prompt: 'How many distinct integer values can be represented using an 8-bit unsigned binary byte (00000000 to 11111111)?',
        options: [
          '128 values (0 to 127)',
          '256 values (0 to 255)',
          '512 values',
          '1024 values'
        ],
        correctIndex: 1,
        explanation: '2^8 = 256 unique combinations, representing unsigned decimal numbers from 0 to 255.',
        marks: 10
      }
    ]
  },

  // 8. JAVA CORE VERIFIED MASTERCLASS QUIZ
  {
    id: 'quiz-course-java',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    moduleId: 'mod-jv-1',
    moduleTitle: 'Module 1: Java 21, JVM & Concurrency',
    title: 'Java 21 Virtual Threads, Metaspace & Concurrency Quiz',
    description: 'Verified assessment on JVM bytecode, Virtual Threads in Project Loom, ZGC garbage collection, and lock-free concurrency.',
    category: 'Course Milestone',
    company: 'LMS Verified Faculty',
    targetRole: 'Java Systems Architect',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    totalMarks: 50,
    passingPercentage: 80,
    rewardXp: 150,
    createdAt: '2026-08-21T11:00:00Z',
    questions: [
      {
        id: 'q-jv-1',
        category: 'Java',
        type: 'mcq',
        prompt: 'In Java 21 Project Loom, what happens when a Virtual Thread executes a blocking socket read or sleep?',
        options: [
          'The underlying OS kernel thread is halted until the packet arrives',
          'The JVM unmounts the virtual thread from its carrier thread, allowing other virtual tasks to run',
          'An unrecoverable ThreadBlockedException is thrown',
          'The JVM converts the thread into a 1MB native C-stack allocation'
        ],
        correctIndex: 1,
        explanation: 'Virtual Threads are lightweight heap objects. When blocking I/O occurs, the JVM unmounts them from the carrier platform thread so other tasks can execute.',
        marks: 10
      },
      {
        id: 'q-jv-2',
        category: 'Java',
        type: 'mcq',
        prompt: 'Where are class bytecode metadata, runtime constant pools, and method definitions stored in modern JVMs (Java 8+)?',
        options: [
          'PermGen memory space',
          'Off-heap Metaspace backed directly by native OS memory',
          'Young Generation Eden Space',
          'Thread Local Allocation Buffer (TLAB)'
        ],
        correctIndex: 1,
        explanation: 'Metaspace replaced PermGen in Java 8, allocating class metadata directly into native memory up to MaxMetaspaceSize.',
        marks: 10
      },
      {
        id: 'q-jv-3',
        category: 'Java',
        type: 'mcq',
        prompt: 'How does Java 21 Record Pattern Matching enhance type safety and developer productivity?',
        options: [
          'It forces all record fields to be mutable at runtime',
          'It deconstructs record components directly in switch and instanceof expressions without manual casting',
          'It compiles Java records into JavaScript objects dynamically',
          'It eliminates JVM garbage collection cycles'
        ],
        correctIndex: 1,
        explanation: 'Record pattern matching allows developers to test types and extract component variables in one concise syntax block without redundant type casts.',
        marks: 10
      },
      {
        id: 'q-jv-4',
        category: 'Java',
        type: 'true_false',
        prompt: 'StructuredTaskScope in Java 21 guarantees that child subtasks spawned in a scope complete or cancel before the enclosing code block exits.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Structured Concurrency treats groups of related tasks as a single atomic unit of work, preventing thread leaks and orphaned background tasks.',
        marks: 10
      },
      {
        id: 'q-jv-5',
        category: 'Java',
        type: 'mcq',
        prompt: 'What architectural benefit do VarHandle atomic operations provide over traditional synchronized blocks in high-concurrency Java systems?',
        options: [
          'They eliminate CPU memory barriers completely',
          'They execute low-level atomic CAS (Compare-And-Swap) instructions with fine-grained memory fences without thread descheduling',
          'They write data directly to SSD flash sectors',
          'They run bytecode in kernel ring 0'
        ],
        correctIndex: 1,
        explanation: 'VarHandles offer lock-free atomic read/write access and memory barriers (Volatile, Acquire/Release, Opaque) without incurring heavyweight thread context switches.',
        marks: 10
      }
    ]
  }
];

// SINGLE COURSE ASSIGNMENT
export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'ass-course-java',
    courseId: 'course-java',
    courseTitle: 'Java Core & Modern Enterprise Architecture',
    moduleId: 'mod-jv-1',
    moduleTitle: 'Module 1: Java 21 & Concurrency',
    title: 'Java 21 Virtual Threads & High-Throughput I/O Benchmark Assignment',
    instructions: 'Design a concurrent processing pipeline using Java 21 Virtual Threads and StructuredTaskScope. Compare memory footprint and throughput against standard fixed thread pools during simulated 10,000 concurrent HTTP requests. Submit your benchmarking code and performance analysis.',
    dueDate: '2026-09-30T23:59:59Z',
    maxMarks: 100,
    submissionType: 'code',
    submissions: [],
    createdAt: '2026-08-19T11:00:00Z'
  }
];

export const INITIAL_ARTICLES: ArticleNote[] = [];
export const INITIAL_APPROVAL_QUEUE: ContentApprovalItem[] = [];
export const INITIAL_MENTOR_APPLICATIONS: MentorApplication[] = [];
export const INITIAL_COURSE_FEEDBACK: CourseFeedback[] = [];
export const INITIAL_COMMENTS: Comment[] = [];
export const INITIAL_ENROLLED_STUDENTS: EnrolledStudent[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_ANALYTICS: AdminAnalytics = {
  totalUsers: 3,
  activeUsersDAU: 1,
  activeUsersMAU: 3,
  totalReelsWatched: 0,
  totalAssessmentsCompleted: 0,
  overallPassRate: 100,
  totalCourses: 1,
  approvedMentorsCount: 1,
  pendingCourseReviews: 0,
  totalMarketplaceRevenue: 0,
  dailyEngagement: [
    { day: 'Mon', views: 0, assessments: 0 },
    { day: 'Tue', views: 0, assessments: 0 },
    { day: 'Wed', views: 0, assessments: 0 },
    { day: 'Thu', views: 0, assessments: 0 },
    { day: 'Fri', views: 0, assessments: 0 },
    { day: 'Sat', views: 0, assessments: 0 },
    { day: 'Sun', views: 0, assessments: 0 },
  ],
  userGrowthData: [
    { date: 'Aug 31', learners: 1, mentors: 1, activeUsers: 2 },
  ],
  coursePerformanceData: [
    { courseId: 'course-java', title: 'Java Core & Modern Enterprise Architecture (5 Reels)', enrolled: 0, completed: 0, completionRate: 0, avgRating: 5.0 },
  ],
  contentPerformanceData: [
    { reelId: 'reel-1', title: 'Python Variables & Memory References in 60s', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-2', title: 'JavaScript Event Loop & Microtasks in 60s', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-3', title: 'System Design: API Gateways vs Load Balancers in 60s', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-4', title: 'DSA: Two Pointers vs Sliding Window Visualized', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-5', title: 'SQL: Clustered vs Non-Clustered Indexes in 60s', views: 0, completions: 0, likes: 0 },
    { reelId: 'reel-6', title: 'AI & LLMs: How Transformers & Self-Attention Work', views: 0, completions: 0, likes: 0 },
  ],
  learningAnalyticsData: {
    totalHours: 0,
    avgScore: 0,
    quizAccuracy: 0,
    assignmentCompletionRate: 0
  }
};
