'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSavedRepos, removeSavedRepo, SavedRepo } from '@/lib/storage/localStore';

export default function SavedPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<SavedRepo[]>([]);

  useEffect(() => {
    setSaved(getSavedRepos());
  }, []);

  const handleRemove = (id: number) => {
    removeSavedRepo(id);
    setSaved(getSavedRepos());
  };

  const handleClearAll = () => {
    if (confirm('Remove all saved repos?')) {
      saved.forEach(repo => removeSavedRepo(repo.id));
      setSaved([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Saved Repos</h1>
          <p className="text-gray-600">{saved.length} {saved.length === 1 ? 'repo' : 'repos'} saved</p>
        </div>

        <div className="mb-4 flex gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ← Back to Discover
          </button>
          {saved.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Clear All
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No saved repos yet</p>
            <p className="text-sm">Start discovering and save repos you like!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {saved.map(repo => (
              <div key={repo.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {repo.full_name}
                    </h3>
                    {repo.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {repo.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Saved {new Date(repo.savedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Open →
                    </a>
                    <button
                      onClick={() => handleRemove(repo.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

