'use client';

import { GitHubRepo } from '@/lib/github/types';
import { saveRepo, removeSavedRepo, getSavedRepos } from '@/lib/storage/localStore';
import { useState, useEffect } from 'react';
import { Star, ArrowSquareOut } from '@phosphor-icons/react';

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
    <div className="rounded-lg border border-white/[0.06] bg-zinc-900 p-4 transition-colors hover:border-white/[0.1]">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">
            {repo.full_name}
          </h3>
          {repo.description && (
            <p className="text-sm text-zinc-400 mb-2 line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          className={`ml-4 rounded-lg p-2 transition-colors ${
            isSaved
              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save repo'}
        >
          <Star size={18} weight={isSaved ? 'fill' : 'regular'} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        {repo.language && (
          <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-400">
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-zinc-300">
          <Star size={12} weight="fill" className="text-amber-400" />
          {repo.stargazers_count.toLocaleString()}
        </span>
        {repo.topics.slice(0, 3).map(topic => (
          <span key={topic} className="rounded-md bg-zinc-800 px-2 py-1 text-zinc-400">
            {topic}
          </span>
        ))}
      </div>

      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
      >
        Open on GitHub
        <ArrowSquareOut size={14} weight="bold" />
      </a>
    </div>
  );
}
