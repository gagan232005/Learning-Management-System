import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import {
  User,
  UserRole,
  UserStatus,
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
  AssessmentResult,
  Badge,
  BadgeDefinition,
  DiscountVoucher,
  ContentApprovalItem,
  ApprovalStatus,
  PlatformTimeFilter,
  MentorApplication,
  CourseFeedback,
  Question,
  AssignmentSubmission,
  UserActivity
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_REELS,
  INITIAL_COURSES,
  INITIAL_APPROVAL_QUEUE,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ENROLLED_STUDENTS,
  INITIAL_ANALYTICS,
  INITIAL_BADGES,
  INITIAL_BADGE_DEFINITIONS,
  INITIAL_VOUCHERS,
  INITIAL_MENTOR_APPLICATIONS,
  INITIAL_COURSE_FEEDBACK,
  INITIAL_QUIZZES,
  INITIAL_ASSIGNMENTS
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AdminSettings {
  passingScoreThreshold: number; // default 80%
  reelsPerAssessment: number;     // EXACTLY 6 reels for prototype
  pointsPerCorrectAnswer: number; // default 50 points
  streakBonusMultiplier: number;  // default 1.5x
  mentorEligibilityMinAssessments: number; // default 3
  mentorEligibilityMinScore: number;       // default 80%
  mentorEligibilityAvgScore: number;       // default 85%
}

export interface PlatformOverviewStats {
  totalLearners: number;
  activeLearners: number;
  totalMentors: number;
  activeMentors: number;
  totalCourses: number;
  publishedCourses: number;
  totalEducationalReels: number;
  overallCourseCompletionRate: number;
}

export interface PlatformFeedbackItem {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  category: string;
  comment: string;
  createdAt: string;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  validateCredentials: (email: string, password: string, role?: string) => { success: boolean; user?: User; error?: string };
  authLogin: (email: string, password: string) => Promise<User>;
  authRegisterLearner: (data: { name: string; email: string; password: string }) => Promise<User>;
  authMentorApply: (data: { name: string; email: string; password: string; expertise?: string; experienceYears?: number; bio?: string; portfolioUrl?: string; skills?: string[] }) => Promise<any>;
  forgotPassword: (email: string) => Promise<string>;
  loginUser: (user: User) => void;
  loginAsRole: (role: UserRole) => void;
  logoutUser: () => void;
  registerUser: (data: { name: string; email: string; password?: string; avatar?: string }) => { success: boolean; message?: string };
  registerLearnerByAdmin: (data: { name: string; email: string; password?: string }) => Promise<User>;
  refreshUsers: () => Promise<void>;
  switchUserRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // RBAC & Permissions
  hasRole: (role: UserRole) => boolean;
  canAccessAdminPortal: () => boolean;
  canManageContent: () => boolean;
  canApproveContent: () => boolean;

  // View As Learner Mode for Admin
  isViewAsLearner: boolean;
  setViewAsLearner: (val: boolean) => void;
  isViewAsMentor: boolean;
  setViewAsMentor: (val: boolean) => void;
  isAuthenticated: boolean;

  // User Management
  toggleUserStatus: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;

  // Dynamic Platform Stats
  platformStats: PlatformOverviewStats;

  // Learn Reels (Exactly 6 Vertical Reels)
  reels: Reel[];
  currentReelIndex: number;
  setCurrentReelIndex: (index: number) => void;
  reelsWatchedCount: number;
  watchedReelIds: string[];
  watchedLearnReelIds: string[];
  markReelWatched: (reelId: string) => void;
  markLearnReelCompleted: (reelId: string) => void;
  unmarkLearnReel: (reelId: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleBookmarkReel: (reelId: string) => void;
  addNewReel: (newReel: Omit<Reel, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'viewsCount' | 'isLiked' | 'isBookmarked'>) => void;
  updateReel: (reelId: string, updates: Partial<Reel>) => void;
  deleteReel: (reelId: string) => void;
  toggleReelPublish: (reelId: string) => void;

  // Courses (5 Vertical Reels per Course)
  courses: Course[];
  createCourse: (courseData: Partial<Course>) => void;
  addNewCourse: (courseData: Omit<Course, 'id' | 'rating' | 'reviewsCount' | 'studentsCount' | 'createdAt'>) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  toggleCoursePublish: (courseId: string) => void;
  updateCourseStatus: (courseId: string, status: ApprovalStatus, feedback?: string) => void;
  approveCourse: (courseId: string, feedback?: string) => void;
  rejectCourse: (courseId: string, reason: string) => void;
  requestChangesCourse: (courseId: string, feedback: string) => void;
  enrollInCourse: (courseId: string, discountCode?: string) => { success: boolean; message: string; finalPrice?: number };
  enrolledStudents: EnrolledStudent[];

  // Course Reels Watch Progress Tracking
  completedCourseReels: Record<string, string[]>;
  markCourseReelCompleted: (courseId: string, reelId: string) => void;
  isCourseReelCompleted: (courseId: string, reelId: string) => boolean;

  // Quizzes & Assignments
  quizzes: Quiz[];
  createQuiz: (quizData: Omit<Quiz, 'id'>) => void;
  deleteQuiz: (quizId: string) => void;
  assignments: Assignment[];
  createAssignment: (assData: Omit<Assignment, 'id' | 'submissions'>) => void;
  deleteAssignment: (assId: string) => void;
  submitAssignment: (assignmentId: string, content: string) => { success: boolean; message: string };
  gradeAssignmentSubmission: (assId: string, subId: string, grade: number, feedback: string) => void;

  // Content Approval Pipeline
  approvalQueue: ContentApprovalItem[];
  submitContentForApproval: (item: Omit<ContentApprovalItem, 'id' | 'submissionDate' | 'status' | 'feedbackHistory'>) => void;
  approveContent: (approvalId: string, publishImmediately?: boolean) => void;
  rejectContent: (approvalId: string, reason: string) => void;
  requestChangesContent: (approvalId: string, feedback: string) => void;
  publishContentDirectly: (approvalId: string) => void;

  // Comments
  comments: Comment[];
  addComment: (reelId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  flagComment: (commentId: string, reason: string) => void;

  // Assessments & 6-Reel Strict Lock
  isAssessmentOpen: boolean;
  openAssessment: () => void;
  closeAssessment: () => void;
  isAssessmentUnlocked: boolean;
  assessmentQueue: Reel[];
  getAssessmentQuestionsForUser: () => Question[];
  submitAssessmentAnswers: (answers: Record<string, number>, customQuestions?: Question[]) => AssessmentResult;
  assessmentHistory: AssessmentResult[];
  latestAssessmentResult: AssessmentResult | null;
  resetAssessmentResult: () => void;

  // Mentor Eligibility & Application Lifecycle
  mentorApplications: MentorApplication[];
  submitMentorApplication: (data: Omit<MentorApplication, 'id' | 'submissionDate' | 'status'>) => void;
  approveMentorApplication: (appId: string, reviewerName?: string) => void;
  rejectMentorApplication: (appId: string, feedback: string, reviewerName?: string) => void;
  requestChangesMentorApplication: (appId: string, feedback: string, reviewerName?: string) => void;
  resubmitMentorApplication: (appId: string, updates: Partial<MentorApplication>) => void;
  isUserEligibleForMentor: (userId?: string) => { isEligible: boolean; completedCount: number; avgScore: number; reason: string };

  // Course & Platform Feedback
  courseFeedback: CourseFeedback[];
  submitCourseFeedback: (courseId: string, rating: number, comment: string) => void;
  platformFeedback: PlatformFeedbackItem[];
  submitPlatformFeedback: (data: { rating: number; category: string; comment: string }) => void;

  // Rewards & Badges
  badges: Badge[];
  badgeDefinitions: BadgeDefinition[];
  awardCourseBadge: (badge: Badge, courseId?: string) => void;
  createBadgeDefinition: (badge: Omit<BadgeDefinition, 'id' | 'earnedCount' | 'createdAt'>) => void;
  updateBadgeDefinition: (id: string, updates: Partial<BadgeDefinition>) => void;
  toggleBadgeActive: (id: string) => void;
  vouchers: DiscountVoucher[];
  redeemVoucher: (code: string) => number;

  // Admin Analytics & Settings
  analytics: AdminAnalytics;
  timeFilter: PlatformTimeFilter;
  setTimeFilter: (filter: PlatformTimeFilter) => void;
  adminSettings: AdminSettings;
  updateAdminSettings: (newSettings: Partial<AdminSettings>) => void;

  // Notifications & Toasts
  notifications: NotificationItem[];
  markNotificationRead: (notifId: string) => void;
  clearAllNotifications: () => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('lms_users_v7');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('lms_current_user_id_v7');
    return saved || 'user-student';
  });

  // Default logged-out on start unless explicitly authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lms_is_authenticated_v7') === 'true' || Boolean(localStorage.getItem('lms_auth_token'));
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isViewAsLearner, setIsViewAsLearner] = useState<boolean>(false);
  const [isViewAsMentor, setIsViewAsMentor] = useState<boolean>(false);

  // Sync users with backend API and merge with persistent local records
  const syncUsersWithBackend = async () => {
    try {
      const res = await api.getUsers();
      if (res && res.success && Array.isArray(res.users)) {
        setUsers(prev => {
          const merged = [...prev];
          res.users.forEach((bu: User) => {
            const idx = merged.findIndex(
              u => u.id === bu.id || (bu.email && u.email.toLowerCase() === bu.email.toLowerCase())
            );
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...bu };
            } else {
              merged.push(bu);
            }
          });
          localStorage.setItem('lms_users_v7', JSON.stringify(merged));
          return merged;
        });
      }
    } catch {
      // Backend offline or unreachable - local state preserved
    }
  };

  const refreshUsers = async () => {
    await syncUsersWithBackend();
    // Reload local storage users if updated in another tab/process
    const saved = localStorage.getItem('lms_users_v7');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(prev => {
            const merged = [...prev];
            parsed.forEach((lu: User) => {
              const idx = merged.findIndex(
                u => u.id === lu.id || (lu.email && u.email.toLowerCase() === lu.email.toLowerCase())
              );
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...lu };
              } else {
                merged.push(lu);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Failed to parse local users:', err);
      }
    }
  };

  // Auto-verify session with backend on mount & subscribe to live roster sync
  useEffect(() => {
    const token = localStorage.getItem('lms_auth_token');
    if (token) {
      api.getMe()
        .then(res => {
          if (res.success && res.user) {
            setUsers(prev => {
              const idx = prev.findIndex(u => u.id === res.user.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = res.user;
                return updated;
              }
              return [res.user, ...prev];
            });
            setCurrentUserId(res.user.id);
            setIsAuthenticated(true);
            localStorage.setItem('lms_is_authenticated_v7', 'true');
          }
        })
        .catch(() => {
          localStorage.removeItem('lms_auth_token');
          setIsAuthenticated(false);
          localStorage.removeItem('lms_is_authenticated_v7');
        });
    }

    // Pull full user list from backend
    syncUsersWithBackend();

    // Cross-tab and global event listeners for instant roster updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lms_users_v7' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setUsers(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    const handleCustomRosterSync = () => {
      const saved = localStorage.getItem('lms_users_v7');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setUsers(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('lms:users_updated', handleCustomRosterSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lms:users_updated', handleCustomRosterSync);
    };
  }, []);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Learn Reels (100% YouTube Shorts & Instagram Reels)
  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('lms_reels_v13');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  
  // Track completed Learn reels per individual reel ID (Starts at 0/5 watched - LOCKED)
  const [watchedLearnReelIds, setWatchedLearnReelIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lms_watched_learn_reels_v9');
    return saved ? JSON.parse(saved) : [];
  });

  // Courses (Multi-Platform Courses: YouTube, Udemy, Coursera, edX)
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lms_courses_v10');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  // Quizzes & Assignments
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('lms_quizzes_v9');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('lms_assignments_v8');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  // Track completed course reels per course: { courseId: [reelId1, reelId2, ...] }
  const [completedCourseReels, setCompletedCourseReels] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('lms_completed_course_reels_v8');
    return saved ? JSON.parse(saved) : {};
  });

  // Approval Queue
  const [approvalQueue, setApprovalQueue] = useState<ContentApprovalItem[]>(() => {
    const saved = localStorage.getItem('lms_approval_queue_v7');
    return saved ? JSON.parse(saved) : INITIAL_APPROVAL_QUEUE;
  });

  // Enrolled Students
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>(() => {
    const saved = localStorage.getItem('lms_enrolled_students_v7');
    return saved ? JSON.parse(saved) : INITIAL_ENROLLED_STUDENTS;
  });

  // Comments
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('lms_comments_v7');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  // Badges & Definitions
  const [badgeDefinitions, setBadgeDefinitions] = useState<BadgeDefinition[]>(() => {
    const saved = localStorage.getItem('lms_badge_definitions_v7');
    return saved ? JSON.parse(saved) : INITIAL_BADGE_DEFINITIONS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('lms_badges_v7');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [vouchers, setVouchers] = useState<DiscountVoucher[]>(() => {
    const saved = localStorage.getItem('lms_vouchers_v7');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  // Mentor Applications
  const [mentorApplications, setMentorApplications] = useState<MentorApplication[]>(() => {
    const saved = localStorage.getItem('lms_mentor_apps_v7');
    return saved ? JSON.parse(saved) : INITIAL_MENTOR_APPLICATIONS;
  });

  // Feedback
  const [courseFeedback, setCourseFeedback] = useState<CourseFeedback[]>(() => {
    const saved = localStorage.getItem('lms_course_feedback_v7');
    return saved ? JSON.parse(saved) : INITIAL_COURSE_FEEDBACK;
  });

  const [platformFeedback, setPlatformFeedback] = useState<PlatformFeedbackItem[]>(() => {
    const saved = localStorage.getItem('lms_platform_feedback_v7');
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications & Toasts
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('lms_notifications_v7');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Assessment Modal & Result
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [latestAssessmentResult, setLatestAssessmentResult] = useState<AssessmentResult | null>(null);

  // Time filter for Platform Analytics
  const [timeFilter, setTimeFilter] = useState<PlatformTimeFilter>('30d');

  // Admin Settings (5 reels per assessment)
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('lms_admin_settings_v9');
    return saved
      ? JSON.parse(saved)
      : {
          passingScoreThreshold: 80,
          reelsPerAssessment: 5, // EXACTLY 5 reels
          pointsPerCorrectAnswer: 50,
          streakBonusMultiplier: 1.5,
          mentorEligibilityMinAssessments: 3,
          mentorEligibilityMinScore: 80,
          mentorEligibilityAvgScore: 85
        };
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('lms_users_v7', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lms_current_user_id_v7', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('lms_is_authenticated_v7', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('lms_reels_v13', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('lms_watched_learn_reels_v9', JSON.stringify(watchedLearnReelIds));
  }, [watchedLearnReelIds]);

  useEffect(() => {
    localStorage.setItem('lms_courses_v10', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('lms_quizzes_v9', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('lms_assignments_v8', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('lms_completed_course_reels_v8', JSON.stringify(completedCourseReels));
  }, [completedCourseReels]);

  useEffect(() => {
    localStorage.setItem('lms_approval_queue_v7', JSON.stringify(approvalQueue));
  }, [approvalQueue]);

  useEffect(() => {
    localStorage.setItem('lms_badge_definitions_v7', JSON.stringify(badgeDefinitions));
  }, [badgeDefinitions]);

  useEffect(() => {
    localStorage.setItem('lms_mentor_apps_v7', JSON.stringify(mentorApplications));
  }, [mentorApplications]);

  useEffect(() => {
    localStorage.setItem('lms_course_feedback_v7', JSON.stringify(courseFeedback));
  }, [courseFeedback]);

  useEffect(() => {
    localStorage.setItem('lms_platform_feedback_v7', JSON.stringify(platformFeedback));
  }, [platformFeedback]);

  useEffect(() => {
    localStorage.setItem('lms_admin_settings_v8', JSON.stringify(adminSettings));
  }, [adminSettings]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Helpers
  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const authLogin = async (email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // 1. Attempt Backend Authentication if online
    try {
      const res = await api.login({ email: trimmedEmail, password });
      if (res && res.success && res.user) {
        const loggedUser = res.user;
        setUsers(prev => {
          const idx = prev.findIndex(u => u.id === loggedUser.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = loggedUser;
            return updated;
          }
          return [loggedUser, ...prev];
        });
        setCurrentUserId(loggedUser.id);
        setIsAuthenticated(true);
        setIsViewAsLearner(false);
        setIsViewAsMentor(false);
        localStorage.setItem('lms_is_authenticated_v7', 'true');
        localStorage.setItem('lms_current_user_id_v7', loggedUser.id);
        closeAuthModal();
        showToast(`Welcome back, ${loggedUser.name}!`, 'success');
        syncUsersWithBackend();
        return loggedUser;
      }
    } catch (err: any) {
      console.warn('Backend login request error / server offline, falling back to local credentials validation:', err);
    }

    // 2. Fallback to Local Authentication (Always allows instant login even if backend is offline)
    const localValidation = validateCredentials(trimmedEmail, password);
    if (localValidation.success && localValidation.user) {
      const localUser = localValidation.user;
      setUsers(prev => {
        const idx = prev.findIndex(u => u.id === localUser.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = localUser;
          return updated;
        }
        return [localUser, ...prev];
      });
      setCurrentUserId(localUser.id);
      setIsAuthenticated(true);
      setIsViewAsLearner(false);
      setIsViewAsMentor(false);
      localStorage.setItem('lms_is_authenticated_v7', 'true');
      localStorage.setItem('lms_current_user_id_v7', localUser.id);
      closeAuthModal();
      showToast(`Welcome back, ${localUser.name}!`, 'success');
      syncUsersWithBackend();
      return localUser;
    }

    const msg = localValidation.error || 'Invalid email or password. Please check your credentials.';
    showToast(msg, 'error');
    throw new Error(msg);
  };

  const authRegisterLearner = async (data: { name: string; email: string; password: string }): Promise<User> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.name.trim();

    // Check existing
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      const msg = 'An account with this email already exists. Please sign in.';
      showToast(msg, 'error');
      throw new Error(msg);
    }

    let newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: trimmedName,
      email: trimmedEmail,
      password: data.password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
      role: 'student',
      status: 'active',
      points: 0,
      xp: 0,
      streakDays: 0,
      level: 1,
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
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          type: 'login',
          title: 'Account Created',
          description: 'Welcome to LMS! Started learning journey.',
          timestamp: 'Just now'
        }
      ]
    };

    // 1. Attempt Backend API Registration
    try {
      const res = await api.register({
        name: trimmedName,
        email: trimmedEmail,
        password: data.password
      });
      if (res && res.success && res.user) {
        newUser = { ...res.user, password: data.password };
      }
    } catch (err: any) {
      console.warn('Backend register request failed or server offline, using local registration fallback:', err);
    }

    // 2. Immediate local & storage persistence
    setUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== trimmedEmail);
      const updated = [newUser, ...filtered];
      localStorage.setItem('lms_users_v7', JSON.stringify(updated));
      return updated;
    });

    setCurrentUserId(newUser.id);
    setIsAuthenticated(true);
    setIsViewAsLearner(false);
    setIsViewAsMentor(false);
    localStorage.setItem('lms_is_authenticated_v7', 'true');
    localStorage.setItem('lms_current_user_id_v7', newUser.id);
    closeAuthModal();

    window.dispatchEvent(new CustomEvent('lms:users_updated'));
    showToast(`Welcome, ${newUser.name}! Your Learner account is ready.`, 'success');
    return newUser;
  };

  const registerLearnerByAdmin = async (data: { name: string; email: string; password?: string }): Promise<User> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.name.trim();

    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      const msg = 'An account with this email already exists in the roster.';
      showToast(msg, 'error');
      throw new Error(msg);
    }

    const defaultPwd = data.password || 'password123';
    let newLearner: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: trimmedName,
      email: trimmedEmail,
      password: defaultPwd,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
      role: 'student',
      status: 'active',
      points: 0,
      xp: 0,
      streakDays: 0,
      level: 1,
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
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          type: 'login',
          title: 'Account Provisioned by Admin',
          description: 'Enrolled into learner directory.',
          timestamp: 'Just now'
        }
      ]
    };

    try {
      const res = await api.register({
        name: trimmedName,
        email: trimmedEmail,
        password: defaultPwd
      });
      if (res && res.success && res.user) {
        newLearner = { ...res.user, password: defaultPwd };
      }
    } catch {
      // Backend offline fallback
    }

    setUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== trimmedEmail);
      const updated = [newLearner, ...filtered];
      localStorage.setItem('lms_users_v7', JSON.stringify(updated));
      return updated;
    });

    window.dispatchEvent(new CustomEvent('lms:users_updated'));
    showToast(`Learner account for ${trimmedName} successfully created.`, 'success');
    return newLearner;
  };

  const authMentorApply = async (data: {
    name: string;
    email: string;
    password: string;
    expertise?: string;
    experienceYears?: number;
    bio?: string;
    portfolioUrl?: string;
    skills?: string[];
  }): Promise<any> => {
    try {
      const res = await api.mentorApply(data);
      if (!res.success) {
        throw new Error(res.message || 'Mentor application failed.');
      }
      closeAuthModal();
      showToast('Mentor application submitted successfully! Your account will be activated once approved by the Admin team.', 'success');
      return res;
    } catch (err: any) {
      // Local fallback for mentor application
      const trimmedEmail = data.email.trim().toLowerCase();
      const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
      if (existing) {
        const msg = 'An account with this email already exists. Please sign in.';
        showToast(msg, 'error');
        throw new Error(msg);
      }
      const newMentor: User = {
        id: `mentor-${Date.now()}`,
        name: data.name.trim(),
        email: trimmedEmail,
        password: data.password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name.trim())}`,
        role: 'mentor',
        status: 'pending',
        points: 0,
        xp: 0,
        streakDays: 0,
        level: 1,
        bio: data.bio?.trim() || 'Mentor applicant.',
        specialty: data.expertise?.trim() || 'Software Engineering',
        mentorApplicationId: `app-${Date.now()}`,
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
        registeredAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        recentActivity: []
      };
      setUsers(prev => [newMentor, ...prev]);
      closeAuthModal();
      showToast('Mentor application submitted successfully! Your account will be activated once approved by the Admin team.', 'success');
      return { success: true, status: 'pending' };
    }
  };

  const forgotPassword = async (email: string): Promise<string> => {
    try {
      const res = await api.forgotPassword(email.trim().toLowerCase());
      const msg = res.message || 'Password reset instructions dispatched.';
      showToast(msg, 'info');
      return msg;
    } catch (err: any) {
      const msg = 'Password reset instructions dispatched to your email address.';
      showToast(msg, 'info');
      return msg;
    }
  };

  const validateCredentials = (email: string, password: string, role?: string): { success: boolean; user?: User; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    let found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      found = INITIAL_USERS.find(u => u.email.toLowerCase() === trimmedEmail);
      if (found) {
        setUsers(prev => [found!, ...prev]);
      }
    }
    if (!found) {
      return { success: false, error: 'Account not found with this email. Please check your email or click "Create Account".' };
    }
    
    // Check password: match stored password or standard default passwords
    const isPasswordValid =
      found.password === password ||
      (found.role === 'admin' && password === 'admin123') ||
      (found.role === 'mentor' && password === 'password123') ||
      (found.role === 'student' && password === 'password123') ||
      (found.email === 'admin@lms.ai' && password === 'admin123') ||
      (found.email === 'user@lms.ai' && password === 'password123') ||
      (found.email === 'mentor@lms.ai' && password === 'password123');

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid password. Please check your password and try again.' };
    }

    if (role) {
      const normalizedRole = role.toLowerCase().replace('role_', '');
      const userNormRole = found.role.toLowerCase().replace('role_', '');
      if (normalizedRole === 'mentor' && userNormRole !== 'mentor') {
        return { success: false, error: 'Access denied: This account does not have approved Mentor credentials.' };
      }
      if (normalizedRole === 'admin' && userNormRole !== 'admin') {
        return { success: false, error: 'Access denied: Administrator privileges required.' };
      }
    }
    return { success: true, user: found };
  };

  const loginUser = (user: User) => {
    setCurrentUserId(user.id);
    setIsViewAsLearner(false);
    setIsViewAsMentor(false);
    setIsAuthenticated(true);
    localStorage.setItem('lms_is_authenticated_v7', 'true');
    localStorage.setItem('lms_current_user_id_v7', user.id);
    showToast(`Welcome back, ${user.name}!`, 'success');
    closeAuthModal();
  };

  const loginAsRole = (role: UserRole) => {
    const roleKey = role.toLowerCase().replace('role_', '');
    let matching = users.find(u => u.role.toLowerCase().replace('role_', '') === roleKey);
    if (!matching) {
      matching = INITIAL_USERS.find(u => u.role.toLowerCase().replace('role_', '') === roleKey);
      if (matching) {
        setUsers(prev => [matching!, ...prev]);
      }
    }
    if (matching) {
      setCurrentUserId(matching.id);
      setIsViewAsLearner(false);
      setIsViewAsMentor(false);
      setIsAuthenticated(true);
      localStorage.setItem('lms_is_authenticated_v7', 'true');
      localStorage.setItem('lms_current_user_id_v7', matching.id);
      showToast(`Logged in as ${matching.name} (${roleKey.toUpperCase()})`, 'success');
      closeAuthModal();
    }
  };

  const logoutUser = () => {
    api.logout();
    setIsAuthenticated(false);
    setIsViewAsLearner(false);
    setIsViewAsMentor(false);
    localStorage.removeItem('lms_is_authenticated_v7');
    localStorage.removeItem('lms_auth_token');
    showToast('Signed out of account.', 'info');
  };

  const registerUser = (data: { name: string; email: string; password?: string; avatar?: string }): { success: boolean; message?: string } => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      showToast('An account with this email address already exists. Please log in.', 'error');
      return { success: false, message: 'Email already registered.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      password: data.password || 'password123',
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      role: 'student', // Public registration is strictly User / Learner
      status: 'active',
      points: 500,
      xp: 1000,
      streakDays: 1,
      level: 1,
      enrolledCourseIds: ['course-java'],
      completedCourseIds: [],
      badges: [INITIAL_BADGES[0]],
      discountVouchers: [INITIAL_VOUCHERS[0]],
      registeredAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      weeklyHours: [1.0, 1.5, 0.5, 2.0, 1.0, 0.0, 0.0],
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          type: 'login',
          title: 'Account Created',
          description: 'Welcome to LMS! Started learning journey.',
          timestamp: 'Just now'
        }
      ]
    };

    setUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== trimmedEmail);
      const updated = [newUser, ...filtered];
      localStorage.setItem('lms_users_v7', JSON.stringify(updated));
      return updated;
    });
    setCurrentUserId(newUser.id);
    setIsAuthenticated(true);
    closeAuthModal();
    window.dispatchEvent(new CustomEvent('lms:users_updated'));
    showToast(`Welcome, ${data.name}! Your Learner account is ready.`, 'success');
    return { success: true };
  };

  const switchUserRole = (newRole: UserRole) => {
    const clean = newRole.toLowerCase().replace('role_', '');
    const matching = users.find(u => u.role.toLowerCase().replace('role_', '') === clean);
    if (matching) {
      setCurrentUserId(matching.id);
      setIsViewAsLearner(false);
      setIsViewAsMentor(false);
      showToast(`Switched to ${matching.name} (${clean})`, 'success');
      syncUsersWithBackend();
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...updates } : u));
    showToast('Profile updated successfully.', 'success');
  };

  // RBAC Helpers
  const hasRole = (role: UserRole): boolean => {
    const cleanRole = role.toLowerCase().replace('role_', '');
    const userRole = currentUser.role.toLowerCase().replace('role_', '');
    if (cleanRole === 'admin') return userRole === 'admin';
    if (cleanRole === 'mentor') return userRole === 'mentor' || userRole === 'admin';
    if (cleanRole === 'learner' || cleanRole === 'student') return true;
    return false;
  };

  const canAccessAdminPortal = (): boolean => {
    const role = (currentUser?.role || '').toLowerCase().replace('role_', '');
    return role === 'admin';
  };

  const canManageContent = (): boolean => {
    const role = (currentUser?.role || '').toLowerCase().replace('role_', '');
    return role === 'admin' || role === 'mentor';
  };

  const canApproveContent = (): boolean => {
    const role = (currentUser?.role || '').toLowerCase().replace('role_', '');
    return role === 'admin';
  };

  // User Management
  const toggleUserStatus = (userId: string) => {
    if (!canAccessAdminPortal()) {
      showToast('Permission denied: Only Admin can activate/deactivate accounts.', 'error');
      return;
    }
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus: UserStatus = u.status === 'active' ? 'inactive' : 'active';
          showToast(`Account for ${u.name} is now ${nextStatus.toUpperCase()}.`, nextStatus === 'active' ? 'success' : 'warning');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    if (!canAccessAdminPortal()) {
      showToast('Permission denied: Admin privileges required.', 'error');
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    showToast('User record updated.', 'success');
  };

  // Dynamic Platform Overview Statistics Calculator
  const platformStats = useMemo<PlatformOverviewStats>(() => {
    const learners = users.filter(u => u.role === 'student' || u.role === 'learner');
    const mentors = users.filter(u => u.role === 'mentor');

    const totalLearners = learners.length;
    const activeLearners = learners.filter(u => u.status === 'active').length;
    const totalMentors = mentors.length;
    const activeMentors = mentors.filter(u => u.status === 'active').length;

    const totalCoursesCount = courses.length;
    const publishedCoursesCount = courses.filter(c => c.status === 'published' || c.status === 'approved').length;
    const totalEducationalReels = reels.length;

    const totalEnrollments = enrolledStudents.length;
    const completedEnrollments = enrolledStudents.filter(e => (e.progressPercent || 0) >= 100).length;
    const overallCourseCompletionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100 * 10) / 10
      : 36.8;

    return {
      totalLearners,
      activeLearners,
      totalMentors,
      activeMentors,
      totalCourses: totalCoursesCount,
      publishedCourses: publishedCoursesCount,
      totalEducationalReels,
      overallCourseCompletionRate: overallCourseCompletionRate > 0 ? overallCourseCompletionRate : 36.8,
    };
  }, [users, courses, reels, enrolledStudents]);

  // Learn Reels Completion System (Exactly 5 Reels)
  const markLearnReelCompleted = (reelId: string) => {
    setWatchedLearnReelIds(prev => {
      if (!prev.includes(reelId)) {
        const next = [...prev, reelId];
        const nextCount = next.length;

        if (nextCount === adminSettings.reelsPerAssessment) {
          showToast(`🎉 All 5 Learn Reels completed! Your assessment is now UNLOCKED.`, 'success');
        } else {
          showToast(`Reel marked as completed (${nextCount}/${adminSettings.reelsPerAssessment})`, 'success');
        }
        return next;
      }
      return prev;
    });

    setReels(prev =>
      prev.map(r => (r.id === reelId ? { ...r, viewsCount: (r.viewsCount || 0) + 1 } : r))
    );

    setUsers(prev =>
      prev.map(u => (u.id === currentUserId ? { ...u, reelsWatchedTotal: (u.reelsWatchedTotal || 0) + 1 } : u))
    );
  };

  const unmarkLearnReel = (reelId: string) => {
    setWatchedLearnReelIds(prev => prev.filter(id => id !== reelId));
    showToast('Reel completion status reset.', 'info');
  };

  const markReelWatched = (reelId: string) => {
    markLearnReelCompleted(reelId);
  };

  // Assessment unlocked condition: EXACTLY requires completing all 5 Learn reels
  const isAssessmentUnlocked = watchedLearnReelIds.length >= adminSettings.reelsPerAssessment;

  const toggleLikeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  const toggleBookmarkReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isBookmarked = !r.isBookmarked;
          showToast(isBookmarked ? 'Reel saved to bookmarks' : 'Reel removed from bookmarks', 'info');
          return { ...r, isBookmarked };
        }
        return r;
      })
    );
  };

  const addNewReel = (newReelData: Omit<Reel, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'viewsCount' | 'isLiked' | 'isBookmarked'>) => {
    const isDirectAdmin = currentUser.role === 'admin';
    const newReel: Reel = {
      ...newReelData,
      id: `reel-${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      isLiked: false,
      isBookmarked: false,
      isPublished: isDirectAdmin ? (newReelData.isPublished ?? true) : false,
      createdAt: new Date().toISOString()
    };

    setReels(prev => [newReel, ...prev]);

    if (!isDirectAdmin) {
      submitContentForApproval({
        contentType: 'reel',
        contentId: newReel.id,
        title: newReel.title,
        categoryOrSubject: newReel.subject || newReel.category,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
        creatorRole: 'Mentor'
      });
      showToast('Educational reel submitted for Admin quality vetting.', 'info');
    } else {
      showToast('Educational reel created and published successfully!', 'success');
    }
  };

  const updateReel = (reelId: string, updates: Partial<Reel>) => {
    setReels(prev => prev.map(r => r.id === reelId ? { ...r, ...updates } : r));
    showToast('Reel details updated.', 'success');
  };

  const deleteReel = (reelId: string) => {
    setReels(prev => prev.filter(r => r.id !== reelId));
    setApprovalQueue(prev => prev.filter(a => a.contentId !== reelId));
    setWatchedLearnReelIds(prev => prev.filter(id => id !== reelId));
    showToast('Reel deleted from platform.', 'info');
  };

  const toggleReelPublish = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const nextPub = !r.isPublished;
          showToast(`Reel "${r.title}" is now ${nextPub ? 'PUBLISHED' : 'UNPUBLISHED'}.`, 'info');
          return { ...r, isPublished: nextPub };
        }
        return r;
      })
    );
  };

  // Course Reels Progress Tracking
  const markCourseReelCompleted = (courseId: string, reelId: string) => {
    setCompletedCourseReels(prev => {
      const courseList = prev[courseId] || [];
      if (!courseList.includes(reelId)) {
        const nextList = [...courseList, reelId];
        const nextProgress = Math.round((nextList.length / 5) * 100);
        
        // Update user progress for enrolled course
        setCourses(cList =>
          cList.map(c => (c.id === courseId ? { ...c, progressPercent: nextProgress } : c))
        );

        setEnrolledStudents(eList =>
          eList.map(e =>
            e.courseId === courseId && e.userId === currentUserId
              ? { ...e, progressPercent: nextProgress, lastActive: new Date().toISOString() }
              : e
          )
        );

        showToast(`Course Reel marked as complete (${nextList.length}/5 Reels)`, 'success');
        return { ...prev, [courseId]: nextList };
      }
      return prev;
    });
  };

  const isCourseReelCompleted = (courseId: string, reelId: string): boolean => {
    return (completedCourseReels[courseId] || []).includes(reelId);
  };

  // Course Creator Workflow (5 Reels Enforcement)
  const createCourse = (courseData: Partial<Course>) => {
    const newCourseId = `course-${Date.now()}`;
    const courseReels = courseData.reels || [];

    const newCourse: Course = {
      id: newCourseId,
      title: courseData.title || 'Untitled Masterclass',
      subtitle: courseData.subtitle || 'Comprehensive Course',
      description: courseData.description || 'Master professional engineering concepts in 5 vertical reels.',
      category: courseData.category || 'Tech',
      price: courseData.price || 49,
      discountedPrice: courseData.discountedPrice || (courseData.price ? Math.round(courseData.price * 0.75) : 39),
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorBio: currentUser.bio || 'Verified LMS Mentor',
      thumbnailUrl: courseData.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      level: courseData.level || 'Intermediate',
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      status: 'submitted',
      modules: [],
      reels: courseReels,
      reelsCount: courseReels.length,
      learningOutcomes: courseData.learningOutcomes || ['Master 5 vertical learning reels', 'Build hands-on production code'],
      createdAt: new Date().toISOString(),
      lessonsCount: courseReels.length,
      quizzesCount: 1,
      assignmentsCount: 1
    };

    setCourses(prev => [newCourse, ...prev]);

    // Add to approval queue
    const queueItem: ContentApprovalItem = {
      id: `appr-${Date.now()}`,
      contentType: 'course',
      contentId: newCourseId,
      title: newCourse.title,
      categoryOrSubject: newCourse.category,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorRole: 'Mentor',
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: 'System Gateway',
          action: 'submitted',
          feedback: `Course submitted with ${courseReels.length} learning reels by ${currentUser.name} for curriculum review.`
        }
      ]
    };
    setApprovalQueue(prev => [queueItem, ...prev]);
    showToast(`Course "${newCourse.title}" (5 Reels) submitted for Admin Approval!`, 'success');
  };

  const addNewCourse = (courseData: Omit<Course, 'id' | 'rating' | 'reviewsCount' | 'studentsCount' | 'createdAt'>) => {
    createCourse(courseData);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
    showToast('Course updated successfully.', 'success');
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setApprovalQueue(prev => prev.filter(a => a.contentId !== courseId));
    showToast('Course deleted from platform.', 'info');
  };

  const toggleCoursePublish = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const isCurrentlyPublished = c.status === 'published' || c.status === 'approved';
          const nextStatus: ApprovalStatus = isCurrentlyPublished ? 'draft' : 'published';
          showToast(`Course "${c.title}" is now ${nextStatus.toUpperCase()}.`, 'info');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const updateCourseStatus = (courseId: string, status: ApprovalStatus, feedback?: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          return { ...c, status, rejectionFeedback: feedback };
        }
        return c;
      })
    );
    showToast(`Course status updated to ${status}.`, 'info');
  };

  const approveCourse = (courseId: string, feedback?: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'published' } : c));
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.contentId === courseId && item.contentType === 'course') {
          return {
            ...item,
            status: 'published' as const,
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: [
              ...(item.feedbackHistory || []),
              {
                date: new Date().toISOString(),
                adminName: currentUser.name,
                action: 'published' as const,
                feedback: feedback || 'All 5 learning reels reviewed and approved. Course is now live in User Courses catalog.'
              }
            ]
          };
        }
        return item;
      })
    );
    showToast('Course APPROVED and PUBLISHED to User Course Catalog!', 'success');
  };

  const rejectCourse = (courseId: string, reason: string) => {
    if (!reason.trim()) {
      showToast('Rejection reason is required.', 'error');
      return;
    }
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'rejected', rejectionFeedback: reason.trim() } : c));
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.contentId === courseId && item.contentType === 'course') {
          return {
            ...item,
            status: 'rejected' as const,
            rejectionReason: reason.trim(),
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: [
              ...(item.feedbackHistory || []),
              {
                date: new Date().toISOString(),
                adminName: currentUser.name,
                action: 'rejected' as const,
                feedback: reason.trim()
              }
            ]
          };
        }
        return item;
      })
    );
    showToast('Course rejected. Feedback sent to mentor.', 'warning');
  };

  const requestChangesCourse = (courseId: string, feedback: string) => {
    if (!feedback.trim()) {
      showToast('Feedback message is required.', 'error');
      return;
    }
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'changes_requested', rejectionFeedback: feedback.trim() } : c));
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.contentId === courseId && item.contentType === 'course') {
          return {
            ...item,
            status: 'changes_requested' as const,
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: [
              ...(item.feedbackHistory || []),
              {
                date: new Date().toISOString(),
                adminName: currentUser.name,
                action: 'requested_changes' as const,
                feedback: feedback.trim()
              }
            ]
          };
        }
        return item;
      })
    );
    showToast('Requested changes sent to creator.', 'info');
  };

  // Course Enrollment / Purchase
  const enrollInCourse = (courseId: string, discountCode?: string): { success: boolean; message: string; finalPrice?: number } => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return { success: false, message: 'Course not found' };
    }

    if (currentUser.enrolledCourseIds.includes(courseId)) {
      showToast('You are already enrolled in this course!', 'info');
      return { success: true, message: 'Already enrolled' };
    }

    let finalPrice = course.discountedPrice || course.price;
    if (discountCode) {
      const discount = redeemVoucher(discountCode);
      if (discount > 0) {
        finalPrice = Math.round(finalPrice * (1 - discount / 100));
      }
    }

    const newEnrollment: EnrolledStudent = {
      id: `enr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar,
      courseId: course.id,
      courseTitle: course.title,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      lastActive: new Date().toISOString(),
      quizAverage: 0
    };

    setEnrolledStudents(prev => [newEnrollment, ...prev]);

    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, studentsCount: (c.studentsCount || 0) + 1 } : c))
    );

    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUserId) {
          return {
            ...u,
            enrolledCourseIds: [...u.enrolledCourseIds, courseId],
            points: u.points + 100,
            xp: u.xp + 250
          };
        }
        // If course belongs to a mentor, update their stats
        if (u.id === course.instructorId) {
          return {
            ...u,
            points: u.points + 50
          };
        }
        return u;
      })
    );

    showToast(`Successfully enrolled in "${course.title}"! (${finalPrice === 0 ? 'FREE' : `$${finalPrice}`})`, 'success');
    return { success: true, message: 'Enrolled successfully', finalPrice };
  };

  // Content Approval Pipeline
  const submitContentForApproval = (item: Omit<ContentApprovalItem, 'id' | 'submissionDate' | 'status' | 'feedbackHistory'>) => {
    const newItem: ContentApprovalItem = {
      ...item,
      id: `appr-${Date.now()}`,
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      feedbackHistory: [
        {
          date: new Date().toISOString(),
          adminName: 'System Gateway',
          action: 'submitted',
          feedback: `Content submitted by ${item.creatorName} for review.`
        }
      ]
    };
    setApprovalQueue(prev => [newItem, ...prev]);
  };

  const approveContent = (approvalId: string, publishImmediately: boolean = true) => {
    if (!canApproveContent()) {
      showToast('Permission denied: Only Admin can approve content.', 'error');
      return;
    }
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.id === approvalId) {
          const nextStatus: ApprovalStatus = publishImmediately ? 'published' : 'approved';
          const nextHistory = [
            ...(item.feedbackHistory || []),
            {
              date: new Date().toISOString(),
              adminName: currentUser.name,
              action: publishImmediately ? ('published' as const) : ('approved' as const),
              feedback: 'Curriculum verified and approved.'
            }
          ];

          if (item.contentType === 'course') {
            setCourses(cList => cList.map(c => c.id === item.contentId ? { ...c, status: nextStatus } : c));
          } else if (item.contentType === 'reel') {
            setReels(rList => rList.map(r => r.id === item.contentId ? { ...r, isPublished: true } : r));
          }

          showToast(`Content "${item.title}" approved and ${publishImmediately ? 'PUBLISHED' : 'ready'}.`, 'success');
          return {
            ...item,
            status: nextStatus,
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: nextHistory
          };
        }
        return item;
      })
    );
  };

  const rejectContent = (approvalId: string, reason: string) => {
    if (!canApproveContent()) {
      showToast('Permission denied: Only Admin can reject content.', 'error');
      return;
    }
    if (!reason.trim()) {
      showToast('Rejection reason is required.', 'error');
      return;
    }
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.id === approvalId) {
          const nextHistory = [
            ...(item.feedbackHistory || []),
            {
              date: new Date().toISOString(),
              adminName: currentUser.name,
              action: 'rejected' as const,
              feedback: reason.trim()
            }
          ];

          if (item.contentType === 'course') {
            setCourses(cList => cList.map(c => c.id === item.contentId ? { ...c, status: 'rejected', rejectionFeedback: reason.trim() } : c));
          } else if (item.contentType === 'reel') {
            setReels(rList => rList.map(r => r.id === item.contentId ? { ...r, isPublished: false } : r));
          }

          showToast(`Content rejected. Feedback sent to creator.`, 'warning');
          return {
            ...item,
            status: 'rejected',
            rejectionReason: reason.trim(),
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: nextHistory
          };
        }
        return item;
      })
    );
  };

  const requestChangesContent = (approvalId: string, feedback: string) => {
    if (!canApproveContent()) {
      showToast('Permission denied.', 'error');
      return;
    }
    setApprovalQueue(prev =>
      prev.map(item => {
        if (item.id === approvalId) {
          const nextHistory = [
            ...(item.feedbackHistory || []),
            {
              date: new Date().toISOString(),
              adminName: currentUser.name,
              action: 'requested_changes' as const,
              feedback: feedback.trim()
            }
          ];
          showToast(`Requested changes from creator.`, 'info');
          return {
            ...item,
            status: 'under_review',
            reviewedBy: currentUser.name,
            reviewedDate: new Date().toISOString(),
            feedbackHistory: nextHistory
          };
        }
        return item;
      })
    );
  };

  const publishContentDirectly = (approvalId: string) => {
    approveContent(approvalId, true);
  };

  // Badges Management
  const createBadgeDefinition = (badgeData: Omit<BadgeDefinition, 'id' | 'earnedCount' | 'createdAt'>) => {
    const newBadge: BadgeDefinition = {
      ...badgeData,
      id: `badge-def-${Date.now()}`,
      earnedCount: 0,
      createdAt: new Date().toISOString()
    };
    setBadgeDefinitions(prev => [...prev, newBadge]);
    showToast(`Badge "${newBadge.title}" defined and active!`, 'success');
  };

  const updateBadgeDefinition = (id: string, updates: Partial<BadgeDefinition>) => {
    setBadgeDefinitions(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast('Badge rule updated.', 'success');
  };

  const awardCourseBadge = (badge: Badge, courseId?: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUserId) {
          const updatedBadges = [...u.badges];
          if (!updatedBadges.some(b => b.id === badge.id || b.title === badge.title)) {
            updatedBadges.push(badge);
          }
          const updatedCompletedCourses = [...u.completedCourseIds];
          if (courseId && !updatedCompletedCourses.includes(courseId)) {
            updatedCompletedCourses.push(courseId);
          }
          const newActivity: UserActivity = {
            id: `act-${Date.now()}`,
            type: 'badge',
            title: `Badge Unlocked: ${badge.title}`,
            description: badge.description,
            timestamp: 'Just now'
          };
          return {
            ...u,
            badges: updatedBadges,
            completedCourseIds: updatedCompletedCourses,
            points: u.points + 100,
            xp: u.xp + 250,
            recentActivity: [newActivity, ...u.recentActivity]
          };
        }
        return u;
      })
    );
    showToast(`🏆 Milestone Badge Awarded: "${badge.title}" credited to your profile!`, 'success');
  };

  const toggleBadgeActive = (id: string) => {
    setBadgeDefinitions(prev =>
      prev.map(b => {
        if (b.id === id) {
          const nextActive = !b.isActive;
          showToast(`Badge "${b.title}" is now ${nextActive ? 'ACTIVE' : 'INACTIVE'}.`, 'info');
          return { ...b, isActive: nextActive };
        }
        return b;
      })
    );
  };

  // Comments
  const addComment = (reelId: string, content: string) => {
    if (!content.trim()) return;
    const newComm: Comment = {
      id: `comm-${Date.now()}`,
      reelId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };
    setComments(prev => [newComm, ...prev]);
    setReels(prev =>
      prev.map(r => (r.id === reelId ? { ...r, commentsCount: (r.commentsCount || 0) + 1 } : r))
    );
    showToast('Comment posted.', 'success');
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    showToast('Comment deleted.', 'info');
  };

  const flagComment = (commentId: string, reason: string) => {
    setComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, isFlagged: true, flagReason: reason } : c))
    );
    showToast('Comment flagged for admin moderation.', 'warning');
  };

  // Dynamic 5-Reel Assessment
  const openAssessment = () => {
    if (!isAssessmentUnlocked) {
      showToast(`Assessment is LOCKED! Please complete all 5 Learn reels first (${watchedLearnReelIds.length}/5 completed).`, 'warning');
      return;
    }
    setIsAssessmentOpen(true);
  };

  const closeAssessment = () => {
    setIsAssessmentOpen(false);
  };

  const assessmentQueue = useMemo(() => {
    return reels.filter(r => r.questions && r.questions.length > 0 && r.isPublished);
  }, [reels]);

  const getAssessmentQuestionsForUser = (): Question[] => {
    const questions: Question[] = [];
    reels.forEach(r => {
      if (r.questions && r.questions[0]) {
        questions.push({ ...r.questions[0], reelId: r.id });
      }
    });
    return questions.slice(0, 5);
  };

  const submitAssessmentAnswers = (answers: Record<string, number>, customQuestions?: Question[]): AssessmentResult => {
    const questions = customQuestions && customQuestions.length > 0 ? customQuestions : getAssessmentQuestionsForUser();
    let correctCount = 0;

    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length || 1;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= adminSettings.passingScoreThreshold;

    const pointsEarned = correctCount * adminSettings.pointsPerCorrectAnswer + (passed ? 50 : 10);
    const newVoucherCode = `LMS-PRO-${Date.now().toString(36).toUpperCase()}`;

    const newVoucher: DiscountVoucher = {
      id: `vouch-${Date.now()}`,
      code: newVoucherCode,
      discountPercent: 25,
      description: '25% OFF Any Masterclass Course (Earned via Assessment)',
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isUsed: false
    };

    const rewardsEarned: AssessmentResult['rewardsEarned'] = {
      points: pointsEarned,
      goodie: passed ? 'Official Assessment Certification & 25% Off Voucher' : undefined
    };

    if (passed) {
      rewardsEarned.voucher = newVoucher;
      if (scorePercentage === 100) {
        rewardsEarned.badge = {
          id: `badge-quiz-champion-${Date.now()}`,
          title: 'Quiz Champion',
          description: 'Achieved a perfect 100% score on the 5-Reel Assessment.',
          icon: '🏆',
          unlockedAt: new Date().toISOString(),
          rarity: 'legendary'
        };
      }
    }

    const result: AssessmentResult = {
      id: `result-${Date.now()}`,
      userId: currentUser.id,
      reelIds: questions.map(q => q.reelId || '').filter(Boolean),
      totalQuestions,
      correctCount,
      scorePercentage,
      passed,
      completedAt: new Date().toISOString(),
      rewardsEarned
    };

    setAssessmentHistory(prev => [result, ...prev]);
    setLatestAssessmentResult(result);

    // Update user stats & evaluate mentor eligibility
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUserId) {
          const nextPoints = u.points + pointsEarned;
          const nextXP = u.xp + (passed ? 200 : 50);
          const nextLevel = Math.floor(nextXP / 1000) + 1;
          const nextStreak = passed ? u.streakDays + 1 : u.streakDays;

          const updatedBadges = [...u.badges];
          if (rewardsEarned.badge && !updatedBadges.some(b => b.id === rewardsEarned.badge?.id || b.title === rewardsEarned.badge?.title)) {
            updatedBadges.push(rewardsEarned.badge);
          }

          const updatedVouchers = [...u.discountVouchers];
          if (rewardsEarned.voucher) {
            updatedVouchers.push(rewardsEarned.voucher);
          }

          // Evaluate mentor eligibility criteria: >=3 assessments, >=80% each, >=85% avg
          const userHistory = [result, ...assessmentHistory.filter(h => h.userId === currentUserId)];
          const passedCount = userHistory.filter(h => h.passed && h.scorePercentage >= adminSettings.mentorEligibilityMinScore).length;
          const avgScore = userHistory.length > 0 ? Math.round(userHistory.reduce((acc, curr) => acc + curr.scorePercentage, 0) / userHistory.length) : 0;
          const isEligible = passedCount >= adminSettings.mentorEligibilityMinAssessments && avgScore >= adminSettings.mentorEligibilityAvgScore;

          return {
            ...u,
            points: nextPoints,
            xp: nextXP,
            level: nextLevel,
            streakDays: nextStreak,
            badges: updatedBadges,
            discountVouchers: updatedVouchers,
            isEligibleForMentor: isEligible
          };
        }
        return u;
      })
    );

    if (rewardsEarned.voucher) {
      setVouchers(prev => [newVoucher, ...prev]);
    }

    showToast(
      passed
        ? `Assessment Passed! Scored ${scorePercentage}%. +${pointsEarned} Points and 25% Voucher credited!`
        : `Assessment Completed (${scorePercentage}%). Scored ${correctCount}/${totalQuestions}. Keep learning!`,
      passed ? 'success' : 'info'
    );

    return result;
  };

  const resetAssessmentResult = () => {
    setLatestAssessmentResult(null);
  };

  // Mentor Eligibility & Application Lifecycle
  const isUserEligibleForMentor = (userId?: string): { isEligible: boolean; completedCount: number; avgScore: number; reason: string } => {
    const targetId = userId || currentUser.id;
    const history = assessmentHistory.filter(h => h.userId === targetId);
    
    const completedCount = history.length;
    const avgScore = completedCount > 0 ? Math.round(history.reduce((a, b) => a + b.scorePercentage, 0) / completedCount) : (currentUser.quizAverage || 0);

    const meetsAssessments = completedCount >= adminSettings.mentorEligibilityMinAssessments;
    const meetsMinScore = history.length === 0 || history.every(h => h.scorePercentage >= adminSettings.mentorEligibilityMinScore);
    const meetsAvgScore = avgScore >= adminSettings.mentorEligibilityAvgScore;
    const isEligible = meetsAssessments && meetsMinScore && meetsAvgScore;

    let reason = '';
    if (!meetsAssessments) {
      reason = `Complete at least ${adminSettings.mentorEligibilityMinAssessments} assessments (${completedCount}/${adminSettings.mentorEligibilityMinAssessments} completed).`;
    } else if (!meetsAvgScore) {
      reason = `Achieve an average score of at least ${adminSettings.mentorEligibilityAvgScore}% (Current avg: ${avgScore}%).`;
    } else {
      reason = 'You have satisfied all mentor eligibility criteria!';
    }

    return { isEligible, completedCount, avgScore, reason };
  };

  const submitMentorApplication = (data: Omit<MentorApplication, 'id' | 'submissionDate' | 'status'>) => {
    const newApp: MentorApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'submitted',
      submissionDate: new Date().toISOString()
    };

    setMentorApplications(prev => [newApp, ...prev]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, mentorApplicationId: newApp.id } : u));
    showToast('Mentor Application submitted successfully! Administrator review pending.', 'success');
  };

  const approveMentorApplication = (appId: string, reviewerName: string = 'Administrator') => {
    setMentorApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          // Promote user to mentor role in real time
          setUsers(uList =>
            uList.map(u => {
              if (u.id === app.userId) {
                return {
                  ...u,
                  role: 'mentor' as const,
                  specialty: app.expertise,
                  bio: app.bio
                };
              }
              return u;
            })
          );

          // Add notification
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            userId: app.userId,
            title: '🎉 Mentor Application Approved!',
            message: 'Congratulations! Your application to become a verified Mentor has been approved. You now have full Mentor access to create courses.',
            type: 'approval',
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(nList => [newNotif, ...nList]);

          showToast(`Application for ${app.applicantName} APPROVED! User promoted to Mentor role.`, 'success');

          return {
            ...app,
            status: 'approved' as const,
            reviewedBy: reviewerName,
            reviewedDate: new Date().toISOString(),
            adminFeedback: 'Application approved with full mentor teaching credentials.'
          };
        }
        return app;
      })
    );
  };

  const rejectMentorApplication = (appId: string, feedback: string, reviewerName: string = 'Administrator') => {
    if (!feedback.trim()) {
      showToast('Mandatory rejection reason required.', 'error');
      return;
    }
    setMentorApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            userId: app.userId,
            title: 'Mentor Application Update',
            message: `Your mentor application was not approved. Feedback: "${feedback.trim()}"`,
            type: 'approval',
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(nList => [newNotif, ...nList]);
          showToast(`Application rejected. Feedback sent to applicant.`, 'warning');
          return {
            ...app,
            status: 'rejected' as const,
            adminFeedback: feedback.trim(),
            reviewedBy: reviewerName,
            reviewedDate: new Date().toISOString()
          };
        }
        return app;
      })
    );
  };

  const requestChangesMentorApplication = (appId: string, feedback: string, reviewerName: string = 'Administrator') => {
    if (!feedback.trim()) {
      showToast('Feedback message is required.', 'error');
      return;
    }
    setMentorApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            userId: app.userId,
            title: 'Mentor Application: Changes Requested',
            message: `The administrator requested updates to your mentor application: "${feedback.trim()}"`,
            type: 'approval',
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications(nList => [newNotif, ...nList]);
          showToast(`Requested changes from ${app.applicantName}.`, 'info');
          return {
            ...app,
            status: 'changes_requested' as const,
            adminFeedback: feedback.trim(),
            reviewedBy: reviewerName,
            reviewedDate: new Date().toISOString()
          };
        }
        return app;
      })
    );
  };

  const resubmitMentorApplication = (appId: string, updates: Partial<MentorApplication>) => {
    setMentorApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, ...updates, status: 'submitted' as const, submissionDate: new Date().toISOString() } : app))
    );
    showToast('Mentor application resubmitted for admin review.', 'success');
  };

  // Feedback Handlers
  const submitCourseFeedback = (courseId: string, rating: number, comment: string) => {
    const targetCourse = courses.find(c => c.id === courseId);
    const newFb: CourseFeedback = {
      id: `fb-${Date.now()}`,
      courseId,
      courseTitle: targetCourse?.title || 'Masterclass Course',
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    setCourseFeedback(prev => [newFb, ...prev]);
    showToast('Review submitted successfully!', 'success');
  };

  const submitPlatformFeedback = (data: { rating: number; category: string; comment: string }) => {
    const newPfb: PlatformFeedbackItem = {
      id: `pfb-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: data.rating,
      category: data.category,
      comment: data.comment.trim(),
      createdAt: new Date().toISOString()
    };
    setPlatformFeedback(prev => [newPfb, ...prev]);
    showToast('Thank you! Platform feedback recorded.', 'success');
  };

  // Redeem Voucher
  const redeemVoucher = (code: string): number => {
    const match = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase() && !v.isUsed);
    if (!match) {
      showToast('Invalid or expired voucher code.', 'error');
      return 0;
    }
    showToast(`Voucher ${match.code} applied: ${match.discountPercent}% Discount!`, 'success');
    return match.discountPercent;
  };

  // Admin Settings
  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Platform settings updated.', 'success');
  };

  // Quizzes & Assignments
  const createQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQ: Quiz = { ...quizData, id: `quiz-${Date.now()}` };
    setQuizzes(prev => [...prev, newQ]);
    showToast(`Quiz "${newQ.title}" created.`, 'success');
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    showToast('Quiz deleted.', 'info');
  };

  const createAssignment = (assData: Omit<Assignment, 'id' | 'submissions'>) => {
    const newA: Assignment = { ...assData, id: `ass-${Date.now()}`, submissions: [] };
    setAssignments(prev => [...prev, newA]);
    showToast(`Assignment "${newA.title}" created.`, 'success');
  };

  const deleteAssignment = (assId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assId));
    showToast('Assignment deleted.', 'info');
  };

  const submitAssignment = (assignmentId: string, content: string) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (!target) return { success: false, message: 'Assignment not found' };

    const existingSubmission = (target.submissions || []).find(s => s.userId === currentUser.id);
    const newSubmission: AssignmentSubmission = {
      id: existingSubmission ? existingSubmission.id : `sub-${Date.now()}`,
      assignmentId,
      userId: currentUser.id,
      userName: currentUser.name,
      submittedAt: new Date().toISOString(),
      content,
      status: 'pending'
    };

    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          const filteredSubs = (a.submissions || []).filter(s => s.userId !== currentUser.id);
          return {
            ...a,
            submissions: [...filteredSubs, newSubmission]
          };
        }
        return a;
      })
    );

    showToast(`Assignment "${target.title}" submitted successfully!`, 'success');
    return { success: true, message: 'Submitted successfully' };
  };

  const gradeAssignmentSubmission = (assId: string, subId: string, grade: number, feedback: string) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assId) {
          return {
            ...a,
            submissions: (a.submissions || []).map(s =>
              s.id === subId ? { ...s, grade, feedback, status: 'graded' as const } : s
            )
          };
        }
        return a;
      })
    );
    showToast('Submission graded.', 'success');
  };

  // Notifications
  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        validateCredentials,
        authLogin,
        authRegisterLearner,
        authMentorApply,
        forgotPassword,
        loginUser,
        loginAsRole,
        logoutUser,
        registerUser,
        registerLearnerByAdmin,
        refreshUsers,
        switchUserRole,
        updateUserProfile,
        hasRole,
        canAccessAdminPortal,
        canManageContent,
        canApproveContent,
        isViewAsLearner,
        setViewAsLearner: setIsViewAsLearner,
        isViewAsMentor,
        setViewAsMentor: setIsViewAsMentor,
        isAuthenticated,
        toggleUserStatus,
        updateUser,
        platformStats,
        reels,
        currentReelIndex,
        setCurrentReelIndex,
        reelsWatchedCount: watchedLearnReelIds.length,
        watchedReelIds: watchedLearnReelIds,
        watchedLearnReelIds,
        markReelWatched,
        markLearnReelCompleted,
        unmarkLearnReel,
        toggleLikeReel,
        toggleBookmarkReel,
        addNewReel,
        updateReel,
        deleteReel,
        toggleReelPublish,
        courses,
        createCourse,
        addNewCourse,
        updateCourse,
        deleteCourse,
        toggleCoursePublish,
        updateCourseStatus,
        approveCourse,
        rejectCourse,
        requestChangesCourse,
        enrollInCourse,
        enrolledStudents,
        completedCourseReels,
        markCourseReelCompleted,
        isCourseReelCompleted,
        quizzes,
        createQuiz,
        deleteQuiz,
        assignments,
        createAssignment,
        deleteAssignment,
        submitAssignment,
        gradeAssignmentSubmission,
        approvalQueue,
        submitContentForApproval,
        approveContent,
        rejectContent,
        requestChangesContent,
        publishContentDirectly,
        comments,
        addComment,
        deleteComment,
        flagComment,
        isAssessmentOpen,
        openAssessment,
        closeAssessment,
        isAssessmentUnlocked,
        assessmentQueue,
        getAssessmentQuestionsForUser,
        submitAssessmentAnswers,
        assessmentHistory,
        latestAssessmentResult,
        resetAssessmentResult,
        mentorApplications,
        submitMentorApplication,
        approveMentorApplication,
        rejectMentorApplication,
        requestChangesMentorApplication,
        resubmitMentorApplication,
        isUserEligibleForMentor,
        courseFeedback,
        submitCourseFeedback,
        platformFeedback,
        submitPlatformFeedback,
        badges,
        badgeDefinitions,
        awardCourseBadge,
        createBadgeDefinition,
        updateBadgeDefinition,
        toggleBadgeActive,
        vouchers,
        redeemVoucher,
        analytics: INITIAL_ANALYTICS,
        timeFilter,
        setTimeFilter,
        adminSettings,
        updateAdminSettings,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
