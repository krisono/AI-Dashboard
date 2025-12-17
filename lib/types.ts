// AI Assist Data Types

export interface Case {
  id: string;
  createdAt: string;
  status: 'pending' | 'in-review' | 'finalized' | 'needs-second-review';
  riskScore: number; // 0-100
  confidence: number; // 0-1
  uncertaintyFlag: boolean;
  patientMaskedId: string;
  modality: 'mammogram' | 'tomosynthesis' | 'ultrasound';
  notes: string;
  // Subgroup attributes for bias monitoring
  ageBand: '40-49' | '50-59' | '60-69' | '70+';
  deviceType: 'vendor-a' | 'vendor-b' | 'vendor-c';
  densityCategory: 'a-fatty' | 'b-scattered' | 'c-heterogeneous' | 'd-dense';
  // Simulated ground truth for bias metrics
  groundTruth?: 'benign' | 'malignant';
}

export interface Finding {
  id: string;
  caseId: string;
  regionId: string;
  label: string;
  rationaleBullets: string[];
  heatmapRegions: HeatmapRegion[];
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface HeatmapRegion {
  x: number; // normalized 0-1
  y: number; // normalized 0-1
  w: number; // normalized 0-1
  h: number; // normalized 0-1
  intensity: number; // 0-1
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  caseId: string;
  action: 'viewed' | 'decision-made' | 'flag-uncertain' | 'manual-review-enabled' | 'chat-query' | 'voice-command' | 'exported';
  details: string;
}

export interface Decision {
  id: string;
  caseId: string;
  decision: 'confirm-finding' | 'reject-finding' | 'request-second-review';
  feedbackTags: string[];
  feedbackNote: string;
  draftReport: string;
  userId: string;
  timestamp: string;
  requiresConfirmation?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  caseId?: string;
  suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
  type: 'toggle-heatmap' | 'next-case' | 'open-case' | 'summarize' | 'go-to-decision';
  label: string;
  payload?: any;
}

export interface VoiceCommand {
  transcript: string;
  action: string;
  confidence: number;
  requiresConfirmation?: boolean;
  payload?: any;
}

export interface BiasMetric {
  id: string;
  metricType: string;
  subgroup: string;
  totalCases: number;
  selectionRate: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  averageConfidence: number;
  disparity: number;
  isFlagged: boolean;
  recommendedActions: string[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  voiceEnabled: boolean;
  aiAssistance: boolean;
  language: string;
  manualReviewMode: boolean;
}

export interface QueueFilters {
  status: Case['status'][];
  riskRange: [number, number];
  confidenceRange: [number, number];
  uncertaintyOnly: boolean;
}

export interface QueueStats {
  totalCases: number;
  highRiskCount: number;
  uncertainCount: number;
  avgRiskScore: number;
}
