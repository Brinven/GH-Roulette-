import { GitHubSearchResponse, GitHubRepo, RateLimitInfo, DiscoverResponse, Filters, Genre } from './types';
import { buildSearchQuery } from './queryBuilder';

const GITHUB_API_BASE = 'https://api.github.com';

export interface DiscoverOptions {
  filters?: Filters;
  genres?: Genre[];
  excludeIds?: number[];
  candidatePoolSize?: number;
  resultCount?: number;
}

/**
 * Fetches repositories from GitHub Search API
 */
export async function discoverRepos(
  token?: string,
  options: DiscoverOptions = {}
): Promise<DiscoverResponse> {
  const {
    filters,
    genres,
    excludeIds = [],
    candidatePoolSize = 50,
    resultCount = 5,
  } = options;

  try {
    const query = buildSearchQuery(filters, genres);
    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${candidatePoolSize}`;

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (token) {
      headers.Authorization = `token ${token}`;
    }

    const response = await fetch(url, { headers });

    // Extract rate limit info from headers
    const rateLimit: RateLimitInfo = {
      remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0', 10),
      limit: parseInt(response.headers.get('x-ratelimit-limit') || '60', 10),
      reset: parseInt(response.headers.get('x-ratelimit-reset') || '0', 10),
      resetAt: new Date(parseInt(response.headers.get('x-ratelimit-reset') || '0', 10) * 1000),
    };

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        const resetTime = new Date(rateLimit.reset * 1000);
        return {
          repos: [],
          rateLimit,
          error: `Rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()}`,
        };
      }
      const errorText = await response.text();
      return {
        repos: [],
        rateLimit,
        error: `GitHub API error: ${response.status} ${errorText}`,
      };
    }

    const data: GitHubSearchResponse = await response.json();

    // Filter out excluded repos and sample
    let candidates = data.items.filter(repo => !excludeIds.includes(repo.id));

    // If we don't have enough candidates, use what we have
    if (candidates.length < resultCount) {
      candidates = data.items; // Fall back to all items if too many exclusions
    }

    // Sample random repos
    const repos = sampleRandom(candidates, resultCount);

    return {
      repos,
      rateLimit,
    };
  } catch (error) {
    return {
      repos: [],
      rateLimit: {
        remaining: 0,
        limit: 60,
        reset: Math.floor(Date.now() / 1000) + 3600,
        resetAt: new Date(Date.now() + 3600 * 1000),
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Samples n random items from an array
 */
function sampleRandom<T>(array: T[], n: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

