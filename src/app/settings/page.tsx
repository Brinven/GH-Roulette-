'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage genres, preferences, and options</p>
        </div>

        <div className="mb-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ← Back to Discover
          </button>
        </div>

        <div className="space-y-6">
          {/* Genres Section */}
          <div className="border rounded-lg p-6 bg-white">
            <GenresEditor genres={genres} onGenresChange={handleGenresChange} />
          </div>

          {/* Preferences Section */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seen History Window Size
                </label>
                <input
                  type="number"
                  value={settings.seenWindowSize}
                  onChange={(e) => handleSettingsChange('seenWindowSize', parseInt(e.target.value, 10) || 100)}
                  min="0"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of recently seen repos to exclude from results (0 = no exclusion)
                </p>
              </div>
            </div>
          </div>

          {/* GitHub Token Section */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GitHub Token (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add a personal access token to increase rate limits from 60/hour to 5000/hour.
              Get one at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
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
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTokenSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
            {settings.githubToken && (
              <p className="text-xs text-green-600 mt-2">✓ Token configured</p>
            )}
          </div>

          {/* Info Section */}
          <div className="border rounded-lg p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About Randomness</h3>
            <p className="text-sm text-gray-700">
              GitHub doesn't provide a true "random repo" endpoint. This app uses random search queries
              to approximate randomness. Results may occasionally repeat, especially if you've seen many
              repos recently. Adjust the "Seen History Window Size" to control how many recent repos are
              excluded from results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

