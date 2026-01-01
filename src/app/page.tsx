'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RepoCard from '@/components/RepoCard';
import FiltersPanel from '@/components/FiltersPanel';
import RateLimitPanel from '@/components/RateLimitPanel';
import { GitHubRepo, RateLimitInfo, Filters, Genre } from '@/lib/github/types';
import { getSeenIds, addSeenRepo, getSettings } from '@/lib/storage/localStore';
import { getGenres } from '@/lib/storage/localStore';

export default function DiscoverPage() {
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    setGenres(getGenres());
  }, []);

  const handleDiscover = async () => {
    setLoading(true);
    setError(null);

    try {
      const settings = getSettings();
      const excludeIds = getSeenIds(settings.seenWindowSize);
      const genresParam = genres.length > 0 ? JSON.stringify(genres) : undefined;

      const params = new URLSearchParams();
      if (filters.genre) params.set('genre', filters.genre);
      if (filters.language) params.set('language', filters.language);
      if (filters.os) params.set('os', filters.os);
      if (filters.minStars) params.set('minStars', filters.minStars.toString());
      if (genresParam) params.set('genres', genresParam);
      if (excludeIds.length > 0) params.set('excludeIds', JSON.stringify(excludeIds));

      const headers: HeadersInit = {};
      if (settings.githubToken) {
        headers['x-github-token'] = settings.githubToken;
      }

      const response = await fetch(`/api/discover?${params.toString()}`, { headers });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setRateLimit(data.rateLimit);
      } else {
        setRepos(data.repos);
        setRateLimit(data.rateLimit);
        
        // Mark repos as seen
        data.repos.forEach((repo: GitHubRepo) => {
          addSeenRepo(repo.id);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to discover repos');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const canDiscover = !loading && (!rateLimit || rateLimit.remaining > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GitHub Roulette</h1>
          <p className="text-gray-600">Discover random GitHub repositories</p>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => router.push('/saved')}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Saved Repos
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Settings
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-4">
            <RateLimitPanel rateLimit={rateLimit} />
            
            <FiltersPanel
              filters={filters}
              genres={genres}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />

            <button
              onClick={handleDiscover}
              disabled={!canDiscover}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                canDiscover
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Discovering...' : 'Find 5 Random Repos'}
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            {repos.length === 0 && !loading && !error && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">Ready to discover?</p>
                <p className="text-sm">Click "Find 5 Random Repos" to get started!</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">Discovering repositories...</p>
              </div>
            )}

            {repos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Found {repos.length} {repos.length === 1 ? 'repo' : 'repos'}
                </h2>
                {repos.map(repo => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

