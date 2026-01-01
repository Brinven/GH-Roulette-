'use client';

import { Genre } from '@/lib/github/types';
import { useState } from 'react';

interface GenresEditorProps {
  genres: Genre[];
  onGenresChange: (genres: Genre[]) => void;
}

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
        <h3 className="text-sm font-semibold text-gray-700">Genres</h3>
        <button
          onClick={handleAdd}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Genre
        </button>
      </div>

      <div className="space-y-2">
        {genres.map(genre => (
          <div key={genre.id} className="border rounded p-3 bg-gray-50">
            {editingId === genre.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Genre name"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
                <input
                  type="text"
                  value={editTopics}
                  onChange={(e) => setEditTopics(e.target.value)}
                  placeholder="Topics (comma-separated)"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{genre.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Topics: {genre.topics.length > 0 ? genre.topics.join(', ') : 'None'}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(genre)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(genre.id)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {genres.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No genres yet. Add one to get started!
        </p>
      )}
    </div>
  );
}

