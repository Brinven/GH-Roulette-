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
 * 
 * Note: GitHub's search API has limitations with complex OR queries when
 * combining multiple filter categories. When both genre and OS filters are
 * active, we use the first topic from each to ensure results are returned.
 * Users can reorder topics in genre definitions to prioritize specific topics.
 */
export function buildSearchQuery(filters?: Filters, genres?: Genre[]): string {
  const parts: string[] = [];
  
  // Track if we have multiple topic-based filters
  const hasGenre = !!(filters?.genre && genres);
  const hasOS = !!filters?.os;
  const hasMultipleTopicFilters = hasGenre && hasOS;

  // Add genre topics if specified
  if (filters?.genre && genres) {
    const genre = genres.find(g => g.id === filters.genre);
    if (genre && genre.topics.length > 0) {
      if (hasMultipleTopicFilters) {
        // When multiple topic filters are active, use first topic to avoid
        // GitHub API limitations with complex OR queries across categories
        parts.push(`topic:${genre.topics[0]}`);
      } else {
        // When only one topic filter category, use first topic
        // GitHub's API has issues with OR-only queries, so we use the first topic
        // Users can reorder topics in genre definition to prioritize
        parts.push(`topic:${genre.topics[0]}`);
      }
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
    
    if (hasMultipleTopicFilters) {
      // When multiple topic filters are active, use first topic
      parts.push(`topic:${topics[0]}`);
    } else {
      // When only one topic filter category, use first topic
      // GitHub's API has issues with OR-only queries
      parts.push(`topic:${topics[0]}`);
    }
  }

  // Add min stars
  if (filters?.minStars) {
    parts.push(`stars:>=${filters.minStars}`);
  }

  // Add random seed for variety (if no specific filters)
  if (parts.length === 0) {
    parts.push(generateRandomSeed());
  }

  // Join all parts with space (AND logic between different filter types)
  return parts.join(' ');
}

