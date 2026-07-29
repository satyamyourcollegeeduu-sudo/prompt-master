import React from 'react';
import {
  Anvil,
  Flame,
  Home,
  BookOpen,
  History,
  Bookmark,
  HelpCircle,
  Instagram,
  Sparkles,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  onOpenPresets: () => void;
  onOpenHistory: () => void;
  onOpenSaved: () => void;
  onOpenGuide: () => void;
  historyCount: number;
  savedCount: number;
  activeTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenPresets,
  onOpenHistory,
  onOpenSaved,
  onOpenGuide,
  historyCount,
  savedCount,
  activeTab = 'home',
}) => {
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800/80 bg-[#0A0E1A]/95 p-4 backdrop-blur-2xl min-h-screen sticky top-0 h-screen z-30 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div
          onClick={handleHomeClick}
          className="group flex items-center gap-3 p-2 rounded-[20px] hover:bg-slate-900/60 cursor-pointer transition-all duration-200"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-500 via-orange-500 to-purple-600 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Anvil className="h-5 w-5 text-slate-950" />
            <Flame className="absolute -top-1 -right-1 h-3.5 w-3.5 animate-pulse text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">
                PROMPT<span className="text-amber-400"> MASTER</span>
              </span>
              <span className="rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-black text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate">AI Prompt Studio</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Workspace
          </p>

          {/* Home */}
          <button
            type="button"
            onClick={handleHomeClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-semibold transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="h-4 w-4 text-amber-400" />
              <span>Composer Home</span>
            </div>
          </button>

          {/* Prompt Library / Presets */}
          <button
            type="button"
            onClick={onOpenPresets}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-semibold text-slate-300 hover:bg-slate-900/80 hover:text-white transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <span>Prompt Library</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </button>

          {/* History */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-semibold text-slate-300 hover:bg-slate-900/80 hover:text-white transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <History className="h-4 w-4 text-cyan-400" />
              <span>Prompt History</span>
            </div>
            {historyCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-extrabold text-slate-950 shadow-sm">
                {historyCount}
              </span>
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            )}
          </button>

          {/* Saved Prompts */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-semibold text-slate-300 hover:bg-slate-900/80 hover:text-white transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="h-4 w-4 text-emerald-400" />
              <span>Saved Prompts</span>
            </div>
            {savedCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 text-[10px] font-extrabold">
                {savedCount}
              </span>
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            )}
          </button>

          {/* Guide */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-[16px] text-xs font-semibold text-slate-300 hover:bg-slate-900/80 hover:text-white transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-pink-400" />
              <span>AI Guide & Docs</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </button>
        </div>
      </div>

      {/* Developer Branding Footer */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3">
        <div className="rounded-[18px] border border-slate-800/80 bg-slate-900/60 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Developer
            </span>
            <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Zap className="h-2.5 w-2.5" />
              <span>P10 SPEC</span>
            </span>
          </div>

          <p className="text-xs font-black text-slate-100 flex items-center gap-1.5">
            <span>SĀTYĀM</span>
            <span className="text-[10px] text-amber-400 font-semibold">(@prince.10x_)</span>
          </p>

          <a
            href="https://instagram.com/prince.10x_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-[12px] border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-xs font-bold text-pink-300 hover:bg-pink-500/20 transition-all"
          >
            <Instagram className="h-3.5 w-3.5 text-pink-400" />
            <span>@prince.10x_</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
