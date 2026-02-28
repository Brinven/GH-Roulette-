'use client';

import { Genre } from '@/lib/github/types';
import { useState } from 'react';
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react';

interface GenresEditorProps {
  genres: Genre[];
  onGenresChange: (genres: Genre[]) => void;
}

const inputClasses =
  'w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500';

export default function GenresEditor({ genres, onGenresChange }: GenresEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTopics, setEditTopics] = useState('');

  const handleAdd = () => {
    const newId = `genre-${Date.now()}`;
    const newGenres = [
      ...genres,
      { id: newId, name: 'New Genre', topics: [] },
    ];
    onGenresChange(newGenres);
    setEditingId(newId);
    setEditName('New Genre');
    setEditTopics('');
  };

  const handleEdit = (genre: Genre) => {
    setEditingId(genre.id);
    setEditName(genre.name);
    setEditTopics(genre.topics.join(', '));
  };

  const handleSave = () => {
    if (!editingId) return;

    const updated = genres.map(g => {
      if (g.id === editingId) {
        return {
          ...g,
          name: editName,
          topics: editTopics.split(',').map(t => t.trim()).filter(Boolean),
        };
      }
      return g;
    });

    onGenresChange(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this genre?')) {
      onGenresChange(genres.filter(g => g.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-zinc-400">Genres</h3>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white transition-colors hover:bg-emerald-500"
        >
          <Plus size={14} weight="bold" />
          Add Genre
        </button>
      </div>

      <div className="space-y-2">
        {genres.map(genre => (
          <div key={genre.id} className="rounded-lg border border-white/[0.06] bg-zinc-800 p-3">
            {editingId === genre.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Genre name"
                  className={inputClasses}
                />
                <input
                  type="text"
                  value={editTopics}
                  onChange={(e) => setEditTopics(e.target.value)}
                  placeholder="Topics (comma-separated) - first topic is used"
                  className={inputClasses}
                />
                <p className="text-xs text-zinc-500">
                  Note: The first topic in the list is used when searching. Order matters!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white transition-colors hover:bg-emerald-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="rounded-lg border border-white/[0.06] bg-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-zinc-100">{genre.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Topics: {genre.topics.length > 0 ? genre.topics.join(', ') : 'None'}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(genre)}
                    className="rounded-lg bg-zinc-700 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-600 hover:text-zinc-200"
                  >
                    <PencilSimple size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(genre.id)}
                    className="rounded-lg bg-red-500/10 p-1.5 text-red-400 transition-colors hover:bg-red-500/20"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {genres.length === 0 && (
        <p className="text-sm text-zinc-500 text-center py-4">
          No genres yet. Add one to get started!
        </p>
      )}
    </div>
  );
}
