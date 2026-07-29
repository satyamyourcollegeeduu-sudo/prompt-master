import React, { useState } from 'react';
import { GeneratedPromptResult } from '../types';
import {
  X,
  History,
  Trash2,
  Star,
  Search,
  ExternalLink,
  Calendar,
  Sparkles,
  Flame,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedPromptResult[];
  onSelectResult: (result: GeneratedPromptResult) => void;
  onDeleteResult: (id: string) => void;
  onClearAll: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onDeleteResult,
  onClearAll,
  favorites,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(history.map((h) => h.category)))];

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.originalIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rawMarkdown.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesFavorite = !showOnlyFavorites || favorites.includes(item.id);

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Forged Prompt History</h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400 font-semibold">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-950/40">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts or topics..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Category dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Favorite toggle */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                showOnlyFavorites
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star
                className={`h-3.5 w-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`}
              />
              <span>Favorites Only</span>
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 space-y-2">
              <History className="h-8 w-8 text-slate-600" />
              <p className="text-xs">No prompts match your history filter.</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isFav = favorites.includes(item.id);
              const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-amber-500/40 transition-all space-y-2 group relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold px-2 py-0.5 border border-amber-500/20">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className="text-slate-500 hover:text-amber-400 p-1"
                        title="Star Favorite"
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => onDeleteResult(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete Prompt"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-200 line-clamp-2">
                    "{item.originalIdea}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {dateStr}
                    </span>

                    <button
                      onClick={() => {
                        onSelectResult(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300"
                    >
                      <span>Load Prompt</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-950">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-xs text-slate-500">Stored Locally</span>
          </div>
        )}
      </div>
    </div>
  );
};
