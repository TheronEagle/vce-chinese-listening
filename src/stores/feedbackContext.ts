import { create } from 'zustand';

interface FeedbackContextState {
  /** Current page context for beta feedback (exerciseId, questionId, etc.) */
  context: Record<string, string>;
  setContext: (ctx: Record<string, string>) => void;
  clearContext: () => void;
}

/**
 * Lightweight singleton store for sharing context with the global
 * FeedbackButton. PracticePage sets context on mount; SettingsPage
 * clears it. This avoids prop-drilling through the Layout component.
 */
export const useFeedbackContext = create<FeedbackContextState>((set) => ({
  context: {},
  setContext: (ctx) => set({ context: ctx }),
  clearContext: () => set({ context: {} }),
}));