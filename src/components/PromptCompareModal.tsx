import React, { useState } from 'react';
import { X, Copy, Check, Layers, Sparkles } from 'lucide-react';

interface PromptCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  standardPrompt: string;
  advancedPrompt: string;
}

export const PromptCompareModal: React.FC<PromptCompareModalProps> = ({
  isOpen,
  onClose,
  standardPrompt,
  advancedPrompt,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-5xl rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Side-by-Side Prompt Comparison</h3>
              <p className="text-xs text-slate-400">
                Compare the Standard Optimized Prompt vs. the System-Level Advanced Prompt.
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

        {/* Side-by-Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Standard Column */}
          <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                1. Standard Optimized Prompt
              </h4>
              <button
                onClick={() => handleCopy(standardPrompt, 'standard')}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                {copiedKey === 'standard' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'standard' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="h-80 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap pr-1">
              {standardPrompt}
            </div>
          </div>

          {/* Advanced Column */}
          <div className="rounded-xl border border-purple-500/30 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>4. Advanced System Version</span>
              </h4>
              <button
                onClick={() => handleCopy(advancedPrompt, 'advanced')}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                {copiedKey === 'advanced' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'advanced' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="h-80 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap pr-1">
              {advancedPrompt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
