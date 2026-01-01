const STORAGE_KEYS = {
  SAVED: 'gh_roulette_saved',
  SEEN: 'gh_roulette_seen',
  GENRES: 'gh_roulette_genres',
  SETTINGS: 'gh_roulette_settings',
} as const;

export interface SavedRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  savedAt: number;
}

export interface SeenRepo {
  id: number;
  seenAt: number;
}

export interface Settings {
  seenWindowSize: number; // How many recent seen repos to exclude
  githubToken?: string;
}

// Saved Repos
export function getSavedRepos(): SavedRepo[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.SAVED);
  return data ? JSON.parse(data) : [];
}

export function saveRepo(repo: { id: number; full_name: string; html_url: string; description: string | null }): void {
  if (typeof window === 'undefined') return;
  const saved = getSavedRepos();
  if (!saved.find(r => r.id === repo.id)) {
    saved.push({
      ...repo,
      savedAt: Date.now(),
    });
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(saved));
  }
}

export function removeSavedRepo(id: number): void {
  if (typeof window === 'undefined') return;
  const saved = getSavedRepos().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(saved));
}

// Seen History
export function getSeenRepos(): SeenRepo[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.SEEN);
  return data ? JSON.parse(data) : [];
}

export function addSeenRepo(id: number): void {
  if (typeof window === 'undefined') return;
  const seen = getSeenRepos();
  seen.push({
    id,
    seenAt: Date.now(),
  });
  localStorage.setItem(STORAGE_KEYS.SEEN, JSON.stringify(seen));
}

export function clearSeenHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SEEN);
}

export function getSeenIds(windowSize?: number): number[] {
  const seen = getSeenRepos();
  if (!windowSize) return seen.map(s => s.id);
  
  // Get most recent N seen repos
  const sorted = seen.sort((a, b) => b.seenAt - a.seenAt);
  return sorted.slice(0, windowSize).map(s => s.id);
}

// Genres
export function getGenres(): Array<{ id: string; name: string; topics: string[] }> {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.GENRES);
  if (data) return JSON.parse(data);
  
  // Default genres
  const defaults = [
    { id: 'llm', name: 'LLM/AI', topics: ['llm', 'ai', 'machine-learning', 'deep-learning'] },
    { id: 'web', name: 'Web Dev', topics: ['web', 'javascript', 'react', 'frontend'] },
    { id: 'game', name: 'Games', topics: ['game', 'gamedev', 'unity', 'game-engine'] },
    { id: 'cli', name: 'CLI Tools', topics: ['cli', 'command-line', 'terminal'] },
  ];
  localStorage.setItem(STORAGE_KEYS.GENRES, JSON.stringify(defaults));
  return defaults;
}

export function saveGenres(genres: Array<{ id: string; name: string; topics: string[] }>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GENRES, JSON.stringify(genres));
}

// Settings
export function getSettings(): Settings {
  if (typeof window === 'undefined') return { seenWindowSize: 100 };
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : { seenWindowSize: 100 };
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

