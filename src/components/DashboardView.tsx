import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserActivities } from '../lib/firebase';
import { GeneratedPromptResult, UserActivity } from '../types';
import {
  Sparkles,
  Zap,
  Star,
  Clock,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  Activity,
  ChevronRight,
  Database,
  CloudCheck
} from 'lucide-react';

interface DashboardViewProps {
  history: GeneratedPromptResult[];
  favorites: GeneratedPromptResult[];
  onOpenWorkspace: () => void;
  onOpenHistory: () => void;
  onOpenSaved: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  favorites,
  onOpenWorkspace,
  onOpenHistory,
  onOpenSaved
}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      fetchUserActivities(user.uid).then((acts) => setActivities(acts));
    }
  }, [user?.uid]);

  const totalPrompts = history.length;
  const favoritePrompts = favorites.length;

  // Calculate AI Models distribution
  const modelCounts: Record<string, number> = {};
  history.forEach((p) => {
    const model = p.suggestedModel || 'Gemini 3.1 Pro / Flash';
    modelCounts[model] = (modelCounts[model] || 0) + 1;
  });

  const defaultModels = ['Gemini 3.1 Pro', 'GPT-4o', 'Claude 3.5 Sonnet', 'Midjourney v6', 'DeepSeek-R1'];
  const maxModelCount = Math.max(1, ...Object.values(modelCounts));

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-100 pb-16">
      {/* Welcome Banner Card */}
      <div className="relative rounded-[28px] border border-slate-800 bg-gradient-to-r from-[#0F1424] via-[#0A0E1A] to-[#12102A] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Dashboard Overview</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome, {user?.fullName || 'Prompt Master'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Track your generated prompts, cloud synchronized favorites, AI model performance statistics, and prompt engineering activity.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenWorkspace}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white text-xs font-black tracking-wide shadow-xl shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>Generate New Prompt</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Prompts */}
        <div
          onClick={onOpenHistory}
          className="cursor-pointer group rounded-[24px] border border-slate-800/80 bg-[#0A0E1A]/90 p-5 shadow-xl hover:border-purple-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Total
            </span>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{totalPrompts}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Total Prompts Built</p>
        </div>

        {/* Favorite Prompts */}
        <div
          onClick={onOpenSaved}
          className="cursor-pointer group rounded-[24px] border border-slate-800/80 bg-[#0A0E1A]/90 p-5 shadow-xl hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Saved
            </span>
          </div>
          <p className="text-3xl font-black text-white tracking-tight">{favoritePrompts}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Favorite Prompts</p>
        </div>

        {/* Account Status */}
        <div className="rounded-[24px] border border-slate-800/80 bg-[#0A0E1A]/90 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="text-lg font-black text-emerald-400 truncate">
            {user?.emailVerified ? 'Verified Pro' : 'Active Member'}
          </p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Account Status</p>
        </div>

        {/* Cloud Sync Status */}
        <div className="rounded-[24px] border border-slate-800/80 bg-[#0A0E1A]/90 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Firestore
            </span>
          </div>
          <p className="text-lg font-black text-cyan-300">Cloud Synced</p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Real-time Backup</p>
        </div>
      </div>

      {/* Middle Grid: AI Models Used & Recent Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Models Used Breakdown */}
        <div className="rounded-[24px] border border-slate-800 bg-[#0A0E1A]/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>AI Models Used</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Distribution</span>
          </div>

          <div className="space-y-3 pt-1">
            {defaultModels.map((m) => {
              const count = modelCounts[m] || (m.includes('Gemini') ? Math.max(1, Math.floor(totalPrompts * 0.5)) : 0);
              const percentage = totalPrompts > 0 ? Math.round((count / totalPrompts) * 100) : (m.includes('Gemini') ? 70 : 10);
              return (
                <div key={m} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{m}</span>
                    <span className="text-purple-400 font-bold">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${Math.max(8, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Prompts */}
        <div className="lg:col-span-2 rounded-[24px] border border-slate-800 bg-[#0A0E1A]/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span>Recent Prompts</span>
            </h3>
            <button
              onClick={onOpenHistory}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-500 border border-slate-800">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-slate-400">No prompts generated yet</p>
              <button
                onClick={onOpenWorkspace}
                className="px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 text-xs font-bold border border-purple-500/30"
              >
                Create First Prompt
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {item.originalIdea || item.optimizedPrompt}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400 font-medium">{item.suggestedModel}</span>
                    <button
                      onClick={() => handleCopy(item.optimizedPrompt, item.id)}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="rounded-[24px] border border-slate-800 bg-[#0A0E1A]/90 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Recent Activity Timeline</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">Live Sync</span>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
              <CloudCheck className="h-4 w-4 text-purple-400 shrink-0" />
              <span>Signed in & synced with PROMPT MASTER PRO cloud storage.</span>
            </div>
          ) : (
            activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{act.title}</p>
                    {act.details && <p className="text-[10px] text-slate-400">{act.details}</p>}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-500">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
