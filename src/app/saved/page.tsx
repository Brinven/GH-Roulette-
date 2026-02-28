'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DownloadSimple, Trash, UploadSimple, ArrowSquareOut } from '@phosphor-icons/react';
import { getSavedRepos, removeSavedRepo, saveRepo, SavedRepo } from '@/lib/storage/localStore';

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

  const handleExport = () => {
    const dataStr = JSON.stringify(saved, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `github-roulette-saved-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'URL', 'Description', 'Saved At'];
    const rows = saved.map(repo => [
      repo.id.toString(),
      repo.full_name,
      repo.html_url,
      repo.description || '',
      new Date(repo.savedAt).toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `github-roulette-saved-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);

        if (!Array.isArray(imported)) {
          alert('Invalid file format. Expected an array of repos.');
          return;
        }

        const validRepos = imported.filter((repo: any) =>
          repo.id && repo.full_name && repo.html_url
        );

        if (validRepos.length === 0) {
          alert('No valid repos found in file.');
          return;
        }

        if (confirm(`Import ${validRepos.length} repos? Duplicates will be skipped.`)) {
          let importedCount = 0;
          validRepos.forEach((repo: any) => {
            if (!saved.find(r => r.id === repo.id)) {
              saveRepo({
                id: repo.id,
                full_name: repo.full_name,
                html_url: repo.html_url,
                description: repo.description || null,
              });
              importedCount++;
            }
          });

          setSaved(getSavedRepos());
          alert(`Imported ${importedCount} new repos. ${validRepos.length - importedCount} were duplicates.`);
        }
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid JSON file.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">Saved Repos</h1>
          <p className="text-zinc-400">{saved.length} {saved.length === 1 ? 'repo' : 'repos'} saved</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to Discover
          </button>
          {saved.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/20"
                title="Export saved repos as JSON"
              >
                <DownloadSimple size={16} weight="bold" />
                Export JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/20"
                title="Export saved repos as CSV"
              >
                <DownloadSimple size={16} weight="bold" />
                Export CSV
              </button>
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
              >
                <Trash size={16} weight="bold" />
                Clear All
              </button>
            </>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">
            <UploadSimple size={16} weight="bold" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-lg mb-2">No saved repos yet</p>
            <p className="text-sm">Start discovering and save repos you like!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {saved.map(repo => (
              <div key={repo.id} className="rounded-lg border border-white/[0.06] bg-zinc-900 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                      {repo.full_name}
                    </h3>
                    {repo.description && (
                      <p className="text-sm text-zinc-400 mb-2">
                        {repo.description}
                      </p>
                    )}
                    <p className="text-xs text-zinc-600">
                      Saved {new Date(repo.savedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white transition-colors hover:bg-emerald-500"
                    >
                      Open
                      <ArrowSquareOut size={14} weight="bold" />
                    </a>
                    <button
                      onClick={() => handleRemove(repo.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      <Trash size={14} weight="bold" />
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
