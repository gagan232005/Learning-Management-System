export type UserRole = 'student' | 'mentor' | 'admin' | 'learner' | 'seller' | 'ROLE_ADMIN' | 'ROLE_MENTOR' | 'ROLE_LEARNER';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserActivity {
  id: string;
  type: 'reel' | 'quiz' | 'course' | 'badge' | 'login' | 'assignment';
  title: string;
  description: string;
  timestamp: string;
  scoreOrPoints?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  conditionType: 'quiz_score' | 'reels_watched' | 'course_completion' | 'streak_days' | 'custom';
  conditionCourseId?: string;
  conditionThreshold?: number;
  conditionText: string;
  isActive: boolean;
  earnedCount: number;
  createdAt: string;
}

export interface DiscountVoucher {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  expiresAt: string;
  isUsed: boolean;
}

export type MentorApplicationStatus = 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';

export interface MentorApplication {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar?: string;
  expertise: string;
  skills: string[];
  experienceYears: number;
  bio: string;
  portfolioUrl?: string;
  assessmentsCompleted: number;
  averageScore: number;
  status: MentorApplicationStatus;
  submissionDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  adminFeedback?: string;
}

export interface CourseFeedback {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Question {
  id: string;
  reelId?: string;
  courseId?: string;
  moduleId?: string;
  category: string;
  type: 'mcq' | 'true_false';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  marks?: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  reelIds: string[];
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  passed: boolean;
  completedAt: string;
  rewardsEarned: {
    points: number;
    badge?: Badge;
    voucher?: DiscountVoucher;
    goodie?: string;
  };
}

export interface Comment {
  id: string;
  reelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface Reel {
  id: string;
  title: string;
  description: string;
  category: string;
  subject?: string;
  topic?: string;
  courseId?: string;
  courseTitle?: string;
  videoUrl: string;
  thumbnailUrl: string;
  source?: 'youtube' | 'instagram' | 'direct';
  platformEmbedId?: string;
  externalUrl?: string;
  channelName?: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorRole: 'Mentor' | 'Admin' | 'Creator';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationSeconds: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isPublished: boolean;
  tags?: string[];
  questions: Question[];
  createdAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  learningObjectives: string[];
  supportingContent?: string;
  estimatedDurationMinutes: number;
  order: number;
  viewsCount?: number;
  isFreePreview?: boolean;
  createdAt?: string;
}

export interface CourseModule {
  id: string;
  courseId?: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl?: string;
  isFreePreview?: boolean;
  order?: number;
  lessons?: Lesson[];
}

export interface Quiz {
  id: string;
  courseId?: string;
  courseTitle?: string;
  moduleId?: string;
  moduleTitle?: string;
  title: string;
  description?: string;
  category?: string;
  company?: string;
  targetRole?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes?: number;
  totalMarks: number;
  passingPercentage: number;
  rewardXp?: number;
  questions: Question[];
  createdAt?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  submittedAt: string;
  content: string;
  status: 'pending' | 'graded';
  marksAwarded?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle?: string;
  moduleId: string;
  moduleTitle?: string;
  title: string;
  instructions: string;
  dueDate: string;
  maxMarks: number;
  submissionType: 'code' | 'file' | 'text' | 'quiz';
  submissions?: AssignmentSubmission[];
  createdAt?: string;
}

export interface ArticleNote {
  id: string;
  courseId?: string;
  courseTitle?: string;
  title: string;
  content: string;
  subject: string;
  topic: string;
  tags: string[];
  authorId: string;
  authorName: string;
  readTimeMinutes: number;
  createdAt: string;
  isPublished: boolean;
}

export type ApprovalStatus = 'draft' | 'submitted' | 'under_review' | 'pending_review' | 'changes_requested' | 'approved' | 'rejected' | 'published';

export interface ContentApprovalItem {
  id: string;
  contentType: 'course' | 'reel' | 'lesson' | 'quiz' | 'assignment' | 'article';
  contentId: string;
  title: string;
  categoryOrSubject: string;
  creatorId: string;
  creatorName: string;
  creatorRole: 'Mentor' | 'Admin' | 'Creator';
  status: ApprovalStatus;
  submissionDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  feedbackHistory?: {
    date: string;
    adminName: string;
    action: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requested_changes' | 'published';
    feedback: string;
  }[];
}

export interface CourseReel {
  id: string;
  courseId?: string;
  order: number;
  title: string;
  description: string;
  topic?: string;
  durationSeconds: number;
  videoUrl: string;
  thumbnailUrl: string;
  source?: 'youtube' | 'instagram' | 'direct';
  platformEmbedId?: string;
  externalUrl?: string;
  likesCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  platform?: 'youtube' | 'udemy' | 'coursera' | 'edx' | 'lms';
  platformUrl?: string;
  certificateIncluded?: boolean;
  price: number;
  discountedPrice?: number;
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  instructorBio: string;
  thumbnailUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  modules: CourseModule[];
  reels?: CourseReel[];
  learningOutcomes: string[];
  status: ApprovalStatus;
  rejectionFeedback?: string;
  submittedAt?: string;
  createdAt: string;
  durationHours?: number;
  progressPercent?: number;
  lastLessonTitle?: string;
  lessonsCount?: number;
  reelsCount?: number;
  quizzesCount?: number;
  assignmentsCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  points: number;
  xp: number;
  streakDays: number;
  level: number;
  isEligibleForMentor?: boolean;
  mentorApplicationId?: string;
  bio?: string;
  specialty?: string;
  assignedMentorId?: string;
  assignedMentorName?: string;
  assignedLearnerIds?: string[];
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  badges: Badge[];
  discountVouchers: DiscountVoucher[];
  weeklyHours?: number[];
  recentActivity?: UserActivity[];
  registeredAt: string;
  lastActive: string;
  totalLearningHours?: number;
  quizAverage?: number;
  completedLessonsCount?: number;
  reelsWatchedTotal?: number;
  assignmentsCompletedCount?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assessment' | 'reward' | 'mentor' | 'course' | 'system' | 'seller' | 'approval';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface EnrolledStudent {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  progressPercent: number;
  completedAt?: string;
  lastActive: string;
  quizAverage?: number;
}

export interface AIInsight {
  strongTopics: { topic: string; score: number }[];
  weakTopics: { topic: string; score: number }[];
  recommendedReels: Reel[];
  learningTips: string[];
  predictedEligibilityDate: string;
}

export type PlatformTimeFilter = '7d' | '30d' | '3m' | '6m' | '1y';

export interface AdminAnalytics {
  totalUsers: number;
  activeUsersDAU: number;
  activeUsersMAU: number;
  totalReelsWatched: number;
  totalAssessmentsCompleted: number;
  overallPassRate: number;
  totalCourses: number;
  approvedMentorsCount: number;
  pendingCourseReviews: number;
  totalMarketplaceRevenue: number;
  dailyEngagement: { day: string; views: number; assessments: number }[];
  userGrowthData?: { date: string; learners: number; mentors: number; activeUsers: number }[];
  coursePerformanceData?: { courseId: string; title: string; enrolled: number; completed: number; completionRate: number; avgRating: number }[];
  contentPerformanceData?: { reelId: string; title: string; views: number; completions: number; likes: number }[];
  learningAnalyticsData?: { totalHours: number; avgScore: number; quizAccuracy: number; assignmentCompletionRate: number };
}
