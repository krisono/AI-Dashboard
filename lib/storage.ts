import { UserSettings } from './types';

const STORAGE_KEYS = {
  SETTINGS: 'ai_dashboard_settings',
  RECENT_CASES: 'ai_dashboard_recent_cases',
  CHAT_HISTORY: 'ai_dashboard_chat_history',
} as const;

export const storage = {
  getSettings(): UserSettings {
    if (typeof window === 'undefined') {
      return getDefaultSettings();
    }
    
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return getDefaultSettings();
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultSettings();
    }
  },

  saveSettings(settings: UserSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getRecentCases(): string[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_CASES);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  addRecentCase(caseId: string): void {
    if (typeof window === 'undefined') return;
    
    const recent = this.getRecentCases();
    const filtered = recent.filter(id => id !== caseId);
    const updated = [caseId, ...filtered].slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_CASES, JSON.stringify(updated));
  },

  getChatHistory(caseId?: string): any[] {
    if (typeof window === 'undefined') return [];
    
    const key = caseId 
      ? `${STORAGE_KEYS.CHAT_HISTORY}_${caseId}`
      : STORAGE_KEYS.CHAT_HISTORY;
    
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  saveChatHistory(messages: any[], caseId?: string): void {
    if (typeof window === 'undefined') return;
    
    const key = caseId 
      ? `${STORAGE_KEYS.CHAT_HISTORY}_${caseId}`
      : STORAGE_KEYS.CHAT_HISTORY;
    
    localStorage.setItem(key, JSON.stringify(messages));
  },

  clearChatHistory(caseId?: string): void {
    if (typeof window === 'undefined') return;
    
    if (caseId) {
      localStorage.removeItem(`${STORAGE_KEYS.CHAT_HISTORY}_${caseId}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    }
  }
};

function getDefaultSettings(): UserSettings {
  return {
    theme: 'auto',
    notifications: true,
    voiceEnabled: false,
    aiAssistance: true,
    language: 'en',
    manualReviewMode: false,
  };
}
