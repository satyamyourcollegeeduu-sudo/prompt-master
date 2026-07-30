import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  CloudCheck,
  ShieldCheck,
  LogIn
} from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onOpenHistory: () => void;
  onOpenSaved?: () => void;
  onOpenGuide?: () => void;
  onOpenDashboard?: () => void;
  onOpenProfile?: () => void;
  onOpenLogin?: () => void;
  historyCount: number;
  savedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPresets,
  onOpenHistory,
  onOpenSaved,
  onOpenGuide,
  onOpenDashboard,
  onOpenProfile,
  onOpenLogin,
  historyCount,
  savedCount = 0,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-purple-600/10 border border-purple-500/30 text-xs font-bold text-purple-300 hover:bg-purple-600/20 transition-all"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-purple-400" />
              <span>Dashboard</span>
            </button>
          )}

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

          {/* User Auth Profile Dropdown / Login Button */}
          {user ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-purple-500/50 transition-all active:scale-95"
              >
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                  alt={user.fullName}
                  className="h-7 w-7 rounded-full object-cover bg-slate-800"
                />
                <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-11 z-50 w-64 rounded-2xl border border-slate-800 bg-[#0F1424]/98 backdrop-blur-2xl p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Badge Info */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                    <p className="text-xs font-black text-white truncate">{user.fullName}</p>
                    <p className="text-[10px] text-cyan-400 font-semibold truncate">@{user.username}</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold pt-1">
                      <CloudCheck className="h-3 w-3" />
                      <span>Cloud Sync Enabled</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenDashboard) onOpenDashboard();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-purple-300 transition-all text-left"
                  >
                    <LayoutDashboard className="h-4 w-4 text-purple-400" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-all text-left"
                  >
                    <UserIcon className="h-4 w-4 text-amber-400" />
                    <span>My Profile</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 transition-all text-left"
                  >
                    <LogOut className="h-4 w-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="ml-2 flex items-center gap-2 px-4 py-1.5 rounded-[12px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </nav>

        {/* Mobile Hamburger Toggle & User Avatar */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-purple-500/40 bg-purple-600/20 text-purple-300"
            >
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                alt={user.fullName}
                className="h-7 w-7 rounded-full object-cover"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
            >
              Sign In
            </button>
          )}

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
          {user && (
            <div className="p-3 rounded-[14px] bg-purple-600/10 border border-purple-500/30 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-xs font-bold text-white">{user.fullName}</p>
                  <p className="text-[10px] text-cyan-400">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className="text-[10px] font-bold text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded-lg"
              >
                Profile
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleHomeClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-slate-900/80 text-xs font-bold text-slate-200"
          >
            <Home className="h-4 w-4 text-amber-400" />
            <span>Home</span>
          </button>

          {onOpenDashboard && (
            <button
              type="button"
              onClick={() => {
                onOpenDashboard();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-slate-900/80 text-xs font-bold text-slate-200"
            >
              <LayoutDashboard className="h-4 w-4 text-purple-400" />
              <span>Dashboard</span>
            </button>
          )}

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

          {user ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-rose-500/10 text-xs font-bold text-rose-300"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenLogin) onOpenLogin();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-purple-600 text-xs font-bold text-white"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

