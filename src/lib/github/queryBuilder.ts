import { Filters, Genre } from './types';

/**
 * Generates random seed strings for query variety
 */
export function generateRandomSeed(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 3) + 1; // 1-3 chars
  let seed = '';
  for (let i = 0; i < length; i++) {
    seed += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return seed;
}

/**
 * Builds a GitHub search query with optional filters
 */
export function buildSearchQuery(filters?: Filters, genres?: Genre[]): string {
  const parts: string[] = [];

  // Add genre topics if specified
  if (filters?.genre && genres) {
    const genre = genres.find(g => g.id === filters.genre);
    if (genre && genre.topics.length > 0) {
      const topicQueries = genre.topics.map(topic => `topic:${topic}`).join(' ');
      parts.push(topicQueries);
    }
  }

  // Add language filter
  if (filters?.language) {
    parts.push(`language:${filters.language}`);
  }

  // Add OS topic filter (best-effort)
  if (filters?.os) {
    const osTopics: Record<string, string[]> = {
      linux: ['linux', 'ubuntu', 'debian'],
      windows: ['windows', 'win32'],
      macos: ['macos', 'darwin'],
      android: ['android'],
      ios: ['ios', 'swift'],
    };
    const topics = osTopics[filters.os.toLowerCase()] || [filters.os];
    parts.push(topics.map(t => `topic:${t}`).join(' '));
  }

  // Add min stars
  if (filters?.minStars) {
    parts.push(`stars:>=${filters.minStars}`);
  }

  // Add random seed for variety (if no specific filters)
  if (parts.length === 0) {
    parts.push(generateRandomSeed());
  }

  return parts.join(' ');
}

