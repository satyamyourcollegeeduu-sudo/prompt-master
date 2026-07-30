export type PromptCategory =
  | 'Website Development'
  | 'Mobile Apps'
  | 'AI Chatbots'
  | 'Flutter'
  | 'React'
  | 'HTML/CSS/JavaScript'
  | 'Python'
  | 'Data Science'
  | 'Design'
  | 'Photo'
  | 'Video'
  | 'Document (PDF)'
  | 'YouTube'
  | 'Marketing'
  | 'Business'
  | 'Writing'
  | 'Games'
  | 'Automation'
  | 'Education'
  | 'Research'
  | 'Images'
  | 'Videos'
  | 'Social Media';

export type TargetModel =
  | 'Auto-Select'
  | 'Gemini 3.1 Pro / Flash'
  | 'ChatGPT / GPT-4o'
  | 'Claude 3.5 Sonnet'
  | 'Midjourney v6 / Flux'
  | 'Sora / Veo Video'
  | 'DeepSeek-R1';

export type PromptTone =
  | 'Professional'
  | 'Creative'
  | 'Technical & Strict'
  | 'Concise & Direct'
  | 'Instructive';

export type PromptComplexity = 'Standard' | 'Detailed' | 'Expert System-Level';

export interface PromptGenerationRequest {
  idea: string;
  category: PromptCategory | 'Auto-Detect';
  targetModel?: TargetModel;
  tone?: PromptTone;
  complexity?: PromptComplexity;
  customConstraints?: string;
  includeVariables?: boolean;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
    category: string;
    summary?: string;
  }>;
}

export interface PromptRefineRequest {
  currentPromptMarkdown: string;
  refinementInstruction: string;
  category: string;
}

export interface PromptTestRequest {
  promptText: string;
  variables?: Record<string, string>;
}

export interface GeneratedPromptResult {
  id: string;
  rawMarkdown: string;
  optimizedPrompt: string;
  suggestedModel: string;
  tips: string[];
  advancedVersion: string;
  category: string;
  originalIdea: string;
  createdAt: number;
  tags?: string[];
  variables?: string[];
}

export interface PresetTemplate {
  id: string;
  title: string;
  category: PromptCategory;
  description: string;
  idea: string;
  iconName: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: number;
  lastLoginAt: number;
  bio?: string;
  role?: string;
}

export interface UserSettings {
  defaultModel: TargetModel;
  defaultTone: PromptTone;
  autoSaveHistory: boolean;
  cloudSyncEnabled: boolean;
  theme: 'dark' | 'dim' | 'cyber';
  notificationsEnabled: boolean;
}

export interface UserActivity {
  id: string;
  title: string;
  action: 'created_prompt' | 'saved_favorite' | 'refined_prompt' | 'tested_sandbox' | 'login' | 'updated_profile';
  timestamp: number;
  details?: string;
}

export interface DashboardStats {
  totalPrompts: number;
  favoritePrompts: number;
  recentActivityCount: number;
  accountStatus: 'Verified' | 'Pending Verification' | 'Guest';
  modelsUsedBreakdown: Record<string, number>;
}

