'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import GenresEditor from '@/components/GenresEditor';
import { getGenres, saveGenres, getSettings, saveSettings, Settings } from '@/lib/storage/localStore';
import { Genre } from '@/lib/github/types';

export default function SettingsPage() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [settings, setSettings] = useState<Settings>({ seenWindowSize: 100 });
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    setGenres(getGenres());
    const currentSettings = getSettings();
    setSettings(currentSettings);
    setGithubToken(currentSettings.githubToken || '');
  }, []);

  const handleGenresChange = (newGenres: Genre[]) => {
    setGenres(newGenres);
    saveGenres(newGenres);
  };

  const handleSettingsChange = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleTokenSave = () => {
    handleSettingsChange('githubToken', githubToken || undefined);
    alert('Token saved! (Note: This is stored locally only)');
  };

  const inputClasses =
    'w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">Settings</h1>
          <p className="text-zinc-400">Manage genres, preferences, and options</p>
        </div>

        <div className="mb-4">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to Discover
          </button>
        </div>

        <div className="space-y-6">
          {/* Genres Section */}
          <div className="rounded-lg border border-white/[0.06] bg-zinc-900 p-6">
            <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-300">
                <strong>Tip:</strong> Topic order matters! The <strong>first topic</strong> in each genre&apos;s list is used when searching.
                Put the most common or broadest topic first for best results. This is due to GitHub&apos;s search API limitations.
              </p>
            </div>
            <GenresEditor genres={genres} onGenresChange={handleGenresChange} />
          </div>

          {/* Preferences Section */}
          <div className="rounded-lg border border-white/[0.06] bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Preferences</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Seen History Window Size
                </label>
                <input
                  type="number"
                  value={settings.seenWindowSize}
                  onChange={(e) => handleSettingsChange('seenWindowSize', parseInt(e.target.value, 10) || 100)}
                  min="0"
                  className={inputClasses}
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Number of recently seen repos to exclude from results (0 = no exclusion)
                </p>
              </div>
            </div>
          </div>

          {/* GitHub Token Section */}
          <div className="rounded-lg border border-white/[0.06] bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">GitHub Token (Optional)</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Add a personal access token to increase rate limits from 60/hour to 5000/hour.
              Get one at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                github.com/settings/tokens
              </a>
              . Token is stored locally only.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className={`flex-1 ${inputClasses}`}
              />
              <button
                onClick={handleTokenSave}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-500"
              >
                Save
              </button>
            </div>
            {settings.githubToken && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-400">
                <Check size={14} weight="bold" />
                Token configured
              </p>
            )}
          </div>

          {/* Info Section */}
          <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">About Randomness</h3>
            <p className="text-sm text-zinc-400">
              GitHub doesn&apos;t provide a true &quot;random repo&quot; endpoint. This app uses random search queries
              to approximate randomness. Results may occasionally repeat, especially if you&apos;ve seen many
              repos recently. Adjust the &quot;Seen History Window Size&quot; to control how many recent repos are
              excluded from results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
