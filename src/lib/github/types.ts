export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  reset: number; // Unix timestamp
  resetAt: Date;
}

export interface DiscoverResponse {
  repos: GitHubRepo[];
  rateLimit: RateLimitInfo;
  error?: string;
}

export interface Genre {
  id: string;
  name: string;
  topics: string[];
}

export interface Filters {
  genre?: string;
  language?: string;
  os?: string;
  minStars?: number;
}

