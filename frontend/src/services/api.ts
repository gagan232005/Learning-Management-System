/**
 * LMS Frontend API Client — migrated to Node.js + Express + TypeScript + MySQL backend.
 * Base URL: http://localhost:5000/api (override with VITE_API_URL)
 *
 * Migration notes (Python/Mongo → MySQL backend):
 * - Envelope is now { success, data } / { success:false, message, error }.
 * - Auth uses access + refresh JWT. Tokens stored as lms_access_token / lms_refresh_token
 *   (legacy lms_auth_token is still honored as fallback).
 * - Roles are uppercase: STUDENT | MENTOR | ADMIN.
 * - Core LMS (courses/modules/lessons/enrollment/progress/quizzes/certificates/reviews)
 *   is fully backed by MySQL. Legacy social-layer calls (reels/approvals/AI/rewards-vouchers/
 *   comments/notifications/analytics-settings) are kept as deprecated stubs so existing
 *   imports keep compiling; they throw a descriptive error at runtime. Migrate those
 *   screens to the core APIs or re-introduce them as a separate service.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const ACCESS_KEY = 'lms_access_token';
const REFRESH_KEY = 'lms_refresh_token';
const LEGACY_KEY = 'lms_auth_token';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY) || localStorage.getItem(LEGACY_KEY);
}

function removed(feature: string): never {
  // eslint-disable-next-line no-console
  console.warn(`[API] ${feature} was removed in the MySQL migration (social layer de-scoped).`);
  throw new Error(
    `${feature} is not available on the MySQL backend. Use core LMS APIs (courses/modules/lessons/quizzes/certificates) instead.`,
  );
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = getAccessToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  private unwrap<T>(body: any): ApiResponse<T> {
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) return body as ApiResponse<T>;
    return { success: true, data: body as T };
  }

  private async raw<T>(endpoint: string, options: RequestInit = {}): Promise<{ status: number; body: any }> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, { ...options, headers: { ...this.getHeaders(), ...(options.headers || {}) } });
    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    return { status: response.status, body };
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}, retry = true): Promise<ApiResponse<T>> {
    const { status, body } = await this.raw<T>(endpoint, options);
    if (status === 401 && retry && localStorage.getItem(REFRESH_KEY)) {
      // try refresh once
      try {
        await this.refreshTokens();
        return this.request<T>(endpoint, options, false);
      } catch {
        this.logout();
      }
    }
    if (status < 200 || status >= 300) {
      const msg = body?.message || `Request failed with status ${status}`;
      // eslint-disable-next-line no-console
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, msg);
      throw new Error(msg);
    }
    return this.unwrap<T>(body);
  }

  // ---------- Health ----------
  public async getHealth() {
    return this.request('/health');
  }

  // ---------- Auth (NEW contract) ----------
  public async login(credentials: { email: string; password?: string; role?: string }) {
    const res = await this.request<{ user: any; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const data: any = (res as any).data ?? res;
    const access = data.accessToken || (res as any).token;
    const refresh = data.refreshToken;
    if (access) {
      localStorage.setItem(ACCESS_KEY, access);
      localStorage.setItem(LEGACY_KEY, access);
    }
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    return { ...res, token: access, user: data.user ?? (res as any).user };
  }

  public async register(userData: { name: string; email: string; password?: string; avatar?: string; role?: string }) {
    const role = (userData.role || 'STUDENT').toUpperCase() === 'MENTOR' ? 'MENTOR' : 'STUDENT';
    const res = await this.request<{ user: any; accessToken: string; refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: userData.name, email: userData.email, password: userData.password, avatar: userData.avatar, role }),
    });
    const data: any = (res as any).data ?? res;
    if (data.accessToken) {
      localStorage.setItem(ACCESS_KEY, data.accessToken);
      localStorage.setItem(LEGACY_KEY, data.accessToken);
    }
    if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
    return { ...res, token: data.accessToken, user: data.user };
  }

  public async refreshTokens() {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) throw new Error('No refresh token');
    const { body } = await this.raw('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) });
    const data = body?.data ?? body;
    if (!data?.accessToken) throw new Error('Refresh failed');
    localStorage.setItem(ACCESS_KEY, data.accessToken);
    localStorage.setItem(LEGACY_KEY, data.accessToken);
    if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
    return data;
  }

  public async getMe() {
    return this.request('/auth/me');
  }

  public logout() {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      void fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => undefined);
    }
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(LEGACY_KEY);
  }

  // Removed auth extras (kept for compile-compat)
  public async mentorApply(_data: any): Promise<never> {
    return removed('Mentor applications');
  }
  public async forgotPassword(_email: string): Promise<never> {
    return removed('Forgot-password');
  }
  public async switchRole(_role: string): Promise<never> {
    return removed('Switch-role (use real RBAC roles)');
  }

  // ---------- Users ----------
  public async getUsers(params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/users${qs ? `?${qs}` : ''}`);
  }
  public async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }
  public async updateUser(userId: string, updates: any) {
    return this.request(`/users/${userId}`, { method: 'PATCH', body: JSON.stringify(updates) });
  }
  public async toggleUserStatus(_userId: string): Promise<never> {
    return removed('Toggle-user-status (use PATCH /users/:id {status})');
  }

  // ---------- Courses (NEW: paginated/search/filter/sort) ----------
  public async getCourses(params?: { category?: string; level?: string; status?: string; search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string }) {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/courses${qs ? `?${qs}` : ''}`);
  }
  public async getCourse(courseId: string) {
    return this.request(`/courses/${courseId}`);
  }
  public async createCourse(courseData: any) {
    const payload = { ...courseData };
    if (payload.level) payload.level = String(payload.level).toUpperCase();
    if (payload.status) payload.status = String(payload.status).toUpperCase();
    return this.request('/courses', { method: 'POST', body: JSON.stringify(payload) });
  }
  public async updateCourse(courseId: string, updates: any) {
    return this.request(`/courses/${courseId}`, { method: 'PUT', body: JSON.stringify(updates) });
  }
  public async deleteCourse(courseId: string) {
    return this.request(`/courses/${courseId}`, { method: 'DELETE' });
  }

  // ---------- Modules & lessons (NEW normalized model) ----------
  public async getModules(courseId: string) {
    return this.request(`/courses/${courseId}/modules`);
  }
  public async createModule(courseId: string, data: { title: string; description?: string; order?: number }) {
    return this.request(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) });
  }
  public async getLessons(moduleId: string) {
    return this.request(`/modules/${moduleId}/lessons`);
  }
  public async createLesson(moduleId: string, data: { title: string; content?: string; videoUrl?: string; durationSec?: number; order?: number; isFreePreview?: boolean }) {
    return this.request(`/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(data) });
  }

  // ---------- Enrollment & progress (server-computed) ----------
  public async enrollCourse(courseId: string, _discountCode?: string) {
    return this.request(`/courses/${courseId}/enroll`, { method: 'POST', body: JSON.stringify({}) });
  }
  public async getMyCourses() {
    return this.request('/enrollments/my-courses');
  }
  public async completeLesson(lessonId: string) {
    return this.request(`/lessons/${lessonId}/complete`, { method: 'POST' });
  }
  public async getCourseProgress(courseId: string) {
    return this.request(`/courses/${courseId}/progress`);
  }

  // ---------- Quizzes (answers never exposed pre-submit) ----------
  public async getQuiz(quizId: string) {
    return this.request(`/quizzes/${quizId}`);
  }
  public async getQuizzes(courseId: string) {
    return this.request(`/quizzes?courseId=${encodeURIComponent(courseId)}`);
  }
  public async createQuiz(data: { courseId: string; moduleId?: string; title: string; description?: string; passingPercentage?: number; questions: any[] }) {
    return this.request('/quizzes', { method: 'POST', body: JSON.stringify(data) });
  }
  public async submitQuiz(quizId: string, answers: Record<string, number>) {
    return this.request(`/quizzes/${quizId}/submit`, { method: 'POST', body: JSON.stringify({ answers }) });
  }
  public async getQuizAttempts(quizId: string) {
    return this.request(`/quizzes/${quizId}/attempts`);
  }

  // ---------- Reviews & certificates ----------
  public async submitCourseReview(courseId: string, data: { rating: number; comment?: string }) {
    return this.request(`/courses/${courseId}/reviews`, { method: 'POST', body: JSON.stringify(data) });
  }
  public async getMyCertificates() {
    return this.request('/users/me/certificates');
  }
  public async getCertificate(id: string) {
    return this.request(`/certificates/${id}`);
  }
  public async verifyCertificate(certificateNumber: string) {
    return this.request(`/certificates/verify/${encodeURIComponent(certificateNumber)}`);
  }

  // ---------- Legacy social layer: deprecated stubs (compile-compat) ----------
  public async getReels(_p?: any): Promise<never> { return removed('Reels feed'); }
  public async getReel(_id: string): Promise<never> { return removed('Reels'); }
  public async createReel(_d: any): Promise<never> { return removed('Reels'); }
  public async updateReel(_id: string, _d: any): Promise<never> { return removed('Reels'); }
  public async deleteReel(_id: string): Promise<never> { return removed('Reels'); }
  public async likeReel(_id: string): Promise<never> { return removed('Reel likes'); }
  public async markLearnReelComplete(_r: string, _u?: string): Promise<never> { return removed('Reel progress (use lessons API)'); }
  public async getWatchedStatus(_u: string): Promise<never> { return removed('Reel watch-status (use lessons API)'); }
  public async markCourseReelComplete(_c: string, _r: string, _u?: string): Promise<never> { return removed('Course-reel progress (use lessons API)'); }
  public async checkEligibility(_u: string): Promise<never> { return removed('Assessments eligibility'); }
  public async getAssessmentQuestions(): Promise<never> { return removed('Assessments (use quizzes API)'); }
  public async submitAssessment(_d: any): Promise<never> { return removed('Assessments (use quizzes API)'); }
  public async getAssessmentHistory(_u: string): Promise<never> { return removed('Assessments history (use quiz attempts API)'); }
  public async getApprovals(_p?: any): Promise<never> { return removed('Approvals queue'); }
  public async submitForApproval(_d: any): Promise<never> { return removed('Approvals'); }
  public async processApprovalAction(_id: string, _d: any): Promise<never> { return removed('Approvals'); }
  public async getMentors(): Promise<never> { return removed('Mentors list (use GET /users?role=MENTOR)'); }
  public async getMentorApplications(_s?: string): Promise<never> { return removed('Mentor applications'); }
  public async submitMentorApplication(_d: any): Promise<never> { return removed('Mentor applications (register with role MENTOR)'); }
  public async reviewMentorApplication(_id: string, _d: any): Promise<never> { return removed('Mentor applications'); }
  public async getBadgeDefinitions(): Promise<never> { return removed('Badge definitions'); }
  public async getVouchers(): Promise<never> { return removed('Vouchers'); }
  public async redeemVoucher(_c: string, _p?: number): Promise<never> { return removed('Vouchers'); }
  public async getLeaderboard(): Promise<never> { return removed('Leaderboard'); }
  public async getCourseFeedback(_c: string): Promise<never> { return removed('Course feedback (use reviews via courses API)'); }
  public async submitCourseFeedback(_c: string, _d: any): Promise<never> { return removed('Course feedback (use POST /courses/:id/reviews)'); }
  public async getPlatformFeedback(): Promise<never> { return removed('Platform feedback'); }
  public async submitPlatformFeedback(_d: any): Promise<never> { return removed('Platform feedback'); }
  public async getReelComments(_r: string): Promise<never> { return removed('Reel comments'); }
  public async addReelComment(_r: string, _d: any): Promise<never> { return removed('Reel comments'); }
  public async getNotifications(_u?: string): Promise<never> { return removed('Notifications'); }
  public async markNotificationRead(_id: string): Promise<never> { return removed('Notifications'); }
  public async getAdminAnalytics() { return this.request('/users/analytics'); }
  public async getPlatformOverview() { return this.request('/users/analytics'); }
  public async getAdminSettings(): Promise<never> { return removed('Admin settings'); }
  public async updateAdminSettings(_s: any): Promise<never> { return removed('Admin settings'); }
  public async getAIInsights(_u?: string): Promise<never> { return removed('AI insights'); }
  public async askAITutor(_m: string, _c?: any): Promise<never> { return removed('AI tutor'); }
}

export const api = new ApiService();
export default api;
