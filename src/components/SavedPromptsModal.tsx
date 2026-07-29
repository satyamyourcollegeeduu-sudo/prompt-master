import React from 'react';
import { X, Bookmark, Trash2, Copy, Sparkles, ExternalLink } from 'lucide-react';
import { GeneratedPromptResult } from '../types';

interface SavedPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  history: GeneratedPromptResult[];
  onSelectResult: (res: GeneratedPromptResult) => void;
  onRemoveFavorite: (id: string) => void;
}

export const SavedPromptsModal: React.FC<SavedPromptsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  history,
  onSelectResult,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  const savedResults = history.filter((item) => favorites.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-2xl w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100">Saved & Favorite Prompts</h3>
              <p className="text-xs text-slate-400">{savedResults.length} Bookmarked Prompts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {savedResults.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Bookmark className="h-12 w-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No saved prompts yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the star or bookmark icon on any generated prompt specification to save it here for quick access.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedResults.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 hover:border-amber-500/40 transition-all"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {item.originalIdea}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectResult(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-extrabold text-slate-950 hover:bg-amber-400 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
