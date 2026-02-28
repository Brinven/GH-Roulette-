'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shuffle, BookmarkSimple, GearSix } from '@phosphor-icons/react';
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
  const [resultCount, setResultCount] = useState(5);
  const [hasToken, setHasToken] = useState(false);

  const checkToken = () => {
    const settings = getSettings();
    setHasToken(!!settings.githubToken);
    if (!settings.githubToken) {
      setResultCount(5);
    }
  };

  useEffect(() => {
    setGenres(getGenres());
    checkToken();

    const handleFocus = () => checkToken();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
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
      if (settings.githubToken && resultCount !== 5) {
        params.set('resultCount', resultCount.toString());
      }

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
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shuffle size={32} weight="duotone" className="text-emerald-400" />
            <h1 className="text-4xl font-bold text-zinc-100">GH Roulette</h1>
          </div>
          <p className="text-zinc-400">Discover random GitHub repositories</p>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => router.push('/saved')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            <BookmarkSimple size={16} weight="bold" />
            Saved Repos
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            <GearSix size={16} weight="bold" />
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

            {/* Repo Count Slider */}
            {hasToken && (
              <div className="rounded-lg border border-white/[0.06] bg-zinc-900 p-4">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Number of Repos: <span className="font-bold text-emerald-400">{resultCount}</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="10"
                  value={resultCount}
                  onChange={(e) => setResultCount(parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-800"
                />
                <div className="flex justify-between text-xs text-zinc-600 mt-1">
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Adjust how many repos to discover (requires GitHub token for higher limits)
                </p>
              </div>
            )}

            <button
              onClick={handleDiscover}
              disabled={!canDiscover}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                canDiscover
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Discovering...' : `Find ${resultCount} Random Repos`}
            </button>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            {repos.length === 0 && !loading && !error && (
              <div className="text-center py-12 text-zinc-500">
                <Shuffle size={48} weight="duotone" className="mx-auto mb-3 text-zinc-700" />
                <p className="text-lg mb-2">Ready to discover?</p>
                <p className="text-sm">Click the button to find random repos</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mb-3" />
                <p className="text-zinc-400">Discovering repositories...</p>
              </div>
            )}

            {repos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                  Found {repos.length} {repos.length === 1 ? 'repo' : 'repos'}
                  {repos.length < resultCount && (
                    <span className="text-sm font-normal text-zinc-500 ml-2">
                      (requested {resultCount}, but {resultCount - repos.length} were filtered out)
                    </span>
                  )}
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
