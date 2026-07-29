import React, { useState } from 'react';
import { X, Check, Copy, Sliders, ArrowRight } from 'lucide-react';

interface VariableFillerModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptTemplate: string;
  variables: string[];
}

export const VariableFillerModal: React.FC<VariableFillerModalProps> = ({
  isOpen,
  onClose,
  promptTemplate,
  variables,
}) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variables.forEach((v) => {
      initial[v] = '';
    });
    return initial;
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Compute filled prompt
  let filledPrompt = promptTemplate;
  Object.entries(values).forEach(([key, val]) => {
    if (val.trim()) {
      const regex = new RegExp(`\\[${key}\\]|\\[${key.replace(/\s+/g, '_')}\\]`, 'gi');
      filledPrompt = filledPrompt.replace(regex, val.trim());
    }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(filledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">Interactive Prompt Variable Filler</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Fill in the detected placeholder variables below to dynamically generate your ready-to-use prompt:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
            {variables.map((varName) => (
              <div key={varName} className="space-y-1">
                <label className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                  [{varName}]
                </label>
                <input
                  type="text"
                  value={values[varName] || ''}
                  onChange={(e) => setValues({ ...values, [varName]: e.target.value })}
                  placeholder={`Enter value for ${varName}...`}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Live Filled Prompt Preview</span>
            <span className="text-[10px] text-slate-500">Auto-updates as you type</span>
          </label>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 max-h-48 overflow-y-auto whitespace-pre-wrap">
            {filledPrompt}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setValues({})}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Reset All
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Done
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied Filled Prompt!' : 'Copy Filled Prompt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
