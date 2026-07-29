import React, { useState } from 'react';
import { SAMPLE_PRESETS, CATEGORIES_WITH_ICONS } from '../data/presets';
import { PresetTemplate, PromptCategory } from '../types';
import { X, BookOpen, Flame, ArrowRight, Sparkles } from 'lucide-react';

interface PresetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetTemplate) => void;
}

export const PresetLibraryModal: React.FC<PresetLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filteredPresets =
    selectedCategory === 'All'
      ? SAMPLE_PRESETS
      : SAMPLE_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Professional Prompt Presets Library</h3>
              <p className="text-xs text-slate-400">
                Explore curated idea starters designed to generate world-class prompts across 15 domains.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Presets
          </button>
          {CATEGORIES_WITH_ICONS.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat.name
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5">
                    {preset.category}
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400">{preset.description}</p>
                <div className="rounded-lg bg-slate-900/90 p-2.5 font-mono text-[11px] text-slate-300 border border-slate-800/80 italic">
                  "{preset.idea}"
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 border border-slate-700 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all"
              >
                <span>Load Into PromptForge</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
