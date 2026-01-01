'use client';

import { GitHubRepo } from '@/lib/github/types';
import { saveRepo, removeSavedRepo, getSavedRepos } from '@/lib/storage/localStore';
import { useState, useEffect } from 'react';

interface RepoCardProps {
  repo: GitHubRepo;
  onSaveChange?: () => void;
}

export default function RepoCard({ repo, onSaveChange }: RepoCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = getSavedRepos();
    setIsSaved(saved.some(r => r.id === repo.id));
  }, [repo.id]);

  const handleSave = () => {
    if (isSaved) {
      removeSavedRepo(repo.id);
    } else {
      saveRepo({
        id: repo.id,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
      });
    }
    setIsSaved(!isSaved);
    onSaveChange?.();
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {repo.full_name}
          </h3>
          {repo.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          className={`ml-4 px-3 py-1 text-sm rounded ${
            isSaved
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save repo'}
        >
          {isSaved ? '★' : '☆'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
        {repo.language && (
          <span className="px-2 py-1 bg-blue-50 rounded">{repo.language}</span>
        )}
        <span className="px-2 py-1 bg-gray-50 rounded">
          ⭐ {repo.stargazers_count.toLocaleString()}
        </span>
        {repo.topics.slice(0, 3).map(topic => (
          <span key={topic} className="px-2 py-1 bg-purple-50 rounded">
            {topic}
          </span>
        ))}
      </div>

      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Open on GitHub →
      </a>
    </div>
  );
}

