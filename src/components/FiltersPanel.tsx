'use client';

import { Filters, Genre } from '@/lib/github/types';
import { useState } from 'react';

interface FiltersPanelProps {
  filters: Filters;
  genres: Genre[];
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
}

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'Ruby', 'PHP',
  'Swift', 'Kotlin', 'Dart', 'R', 'Scala', 'Elixir', 'Clojure', 'Haskell',
];

const OS_OPTIONS = [
  { value: 'linux', label: 'Linux' },
  { value: 'windows', label: 'Windows' },
  { value: 'macos', label: 'macOS' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
];

export default function FiltersPanel({ filters, genres, onFiltersChange, onReset }: FiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = !!(
    filters.genre ||
    filters.language ||
    filters.os ||
    filters.minStars
  );

  const handleChange = (key: keyof Filters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Filters (Optional)</h3>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
            >
              Reset to Random
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            {isOpen ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3">
          {/* Genre Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              value={filters.genre || ''}
              onChange={(e) => handleChange('genre', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None (Random)</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={filters.language || ''}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* OS Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              OS / Platform
            </label>
            <select
              value={filters.os || ''}
              onChange={(e) => handleChange('os', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              {OS_OPTIONS.map(os => (
                <option key={os.value} value={os.value}>
                  {os.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min Stars */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Min Stars
            </label>
            <input
              type="number"
              value={filters.minStars || ''}
              onChange={(e) => handleChange('minStars', e.target.value ? parseInt(e.target.value, 10) : undefined)}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {hasActiveFilters && !isOpen && (
        <p className="text-xs text-gray-500 mt-2">
          Filters active: {[
            filters.genre && 'Genre',
            filters.language && 'Language',
            filters.os && 'OS',
            filters.minStars && 'Min Stars',
          ].filter(Boolean).join(', ')}
        </p>
      )}
    </div>
  );
}

