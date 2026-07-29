import React, { useState } from 'react';
import {
  Anvil,
  BookOpen,
  History,
  Flame,
  Instagram,
  Home,
  Bookmark,
  HelpCircle,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenHistory: () => void;
  onOpenSaved?: () => void;
  onOpenGuide?: () => void;
  historyCount: number;
  savedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPresets,
  onOpenHistory,
  onOpenSaved,
  onOpenGuide,
  historyCount,
  savedCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0A0E1A]/90 backdrop-blur-2xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Developer Info */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleHomeClick}>
          <div className="relative flex h-9 w-9 md:hidden items-center justify-center rounded-[12px] bg-gradient-to-br from-amber-500 via-orange-500 to-purple-600 shadow-md shadow-amber-500/25">
            <Anvil className="h-4 w-4 text-slate-950" />
            <Flame className="absolute -top-1 -right-1 h-3 w-3 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                PROMPT<span className="text-amber-400"> MASTER</span>
              </span>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Build Smarter Prompts • Dev: <span className="text-amber-300 font-bold">SĀTYĀM (@prince.10x_)</span>
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Shortcuts */}
        <nav className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-all"
          >
            <BookOpen className="h-3.5 w-3.5 text-purple-400" />
            <span>Library</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-all relative"
          >
            <History className="h-3.5 w-3.5 text-cyan-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-slate-950">
                {historyCount}
              </span>
            )}
          </button>

          {onOpenSaved && (
            <button
              type="button"
              onClick={onOpenSaved}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-all"
            >
              <Bookmark className="h-3.5 w-3.5 text-emerald-400" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold px-1">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          <a
            href="https://instagram.com/prince.10x_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-[12px] border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-xs font-bold text-pink-300 hover:bg-pink-500/20 transition-all"
          >
            <Instagram className="h-3.5 w-3.5 text-pink-400" />
            <span>@prince.10x_</span>
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="https://instagram.com/prince.10x_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-8 w-8 rounded-[10px] border border-pink-500/30 bg-pink-500/10 text-pink-300"
          >
            <Instagram className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-slate-800 bg-slate-900 text-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-[#0A0E1A]/98 px-4 py-4 space-y-2 animate-fade-in">
          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-slate-900/80 text-xs font-bold text-slate-200"
          >
            <Home className="h-4 w-4 text-amber-400" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenPresets();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] bg-slate-900/80 text-xs font-bold text-slate-200"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <span>Prompt Library</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenHistory();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] bg-slate-900/80 text-xs font-bold text-slate-200"
          >
            <div className="flex items-center gap-3">
              <History className="h-4 w-4 text-cyan-400" />
              <span>History</span>
            </div>
            {historyCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-slate-950">
                {historyCount}
              </span>
            )}
          </button>

          {onOpenSaved && (
            <button
              type="button"
              onClick={() => {
                onOpenSaved();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] bg-slate-900/80 text-xs font-bold text-slate-200"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="h-4 w-4 text-emerald-400" />
                <span>Saved Prompts</span>
              </div>
              {savedCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          {onOpenGuide && (
            <button
              type="button"
              onClick={() => {
                onOpenGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-slate-900/80 text-xs font-bold text-slate-200"
            >
              <HelpCircle className="h-4 w-4 text-pink-400" />
              <span>Guide & Documentation</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
