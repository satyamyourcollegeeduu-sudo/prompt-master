import React from 'react';
import { Home, BookOpen, Plus, History, User } from 'lucide-react';

interface BottomNavProps {
  onOpenPresets: () => void;
  onOpenHistory: () => void;
  onOpenSaved: () => void;
  onOpenGuide: () => void;
  historyCount: number;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenPresets,
  onOpenHistory,
  onOpenSaved,
  onOpenGuide,
  historyCount,
}) => {
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlusClick = () => {
    const el = document.getElementById('main-prompt-area');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const textarea = el.querySelector('textarea');
      if (textarea) textarea.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/90 bg-[#0A0E1A]/95 backdrop-blur-2xl px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-amber-400 active:scale-95 transition-all py-1 px-2"
        >
          <Home className="h-5 w-5 text-amber-400" />
          <span className="text-[10px] font-bold mt-1 text-slate-300">Home</span>
        </button>

        {/* Library */}
        <button
          type="button"
          onClick={onOpenPresets}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-purple-400 active:scale-95 transition-all py-1 px-2"
        >
          <BookOpen className="h-5 w-5 text-purple-400" />
          <span className="text-[10px] font-bold mt-1 text-slate-300">Library</span>
        </button>

        {/* Floating Plus Button */}
        <button
          type="button"
          onClick={handlePlusClick}
          className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 text-slate-950 shadow-lg shadow-amber-500/30 -mt-5 active:scale-90 transition-transform"
          title="New Prompt"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
        </button>

        {/* History */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="relative flex flex-col items-center justify-center text-slate-400 hover:text-cyan-400 active:scale-95 transition-all py-1 px-2"
        >
          <History className="h-5 w-5 text-cyan-400" />
          {historyCount > 0 && (
            <span className="absolute top-0 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-slate-950">
              {historyCount}
            </span>
          )}
          <span className="text-[10px] font-bold mt-1 text-slate-300">History</span>
        </button>

        {/* Profile / Saved */}
        <button
          type="button"
          onClick={onOpenSaved}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 active:scale-95 transition-all py-1 px-2"
        >
          <User className="h-5 w-5 text-emerald-400" />
          <span className="text-[10px] font-bold mt-1 text-slate-300">Profile</span>
        </button>
      </div>
    </div>
  );
};
