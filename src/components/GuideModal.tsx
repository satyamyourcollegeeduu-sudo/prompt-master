import React from 'react';
import { X, BookOpen, Sparkles, Wand2, Layers, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-2xl w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100">PromptForge AI Guide</h3>
              <p className="text-xs text-slate-400">P10 Omega Prompt Engineering Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>1. Formulate Raw Concept or Attach Media</span>
            </div>
            <p className="text-slate-400">
              Describe what you want to build or ask AI. You can attach reference images, video clips, or PDF documents. Select the target domain category or rely on Auto-Detect.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-300">
              <Wand2 className="h-4 w-4" />
              <span>2. Configure Advanced Parameters</span>
            </div>
            <p className="text-slate-400">
              Tailor the target model (Gemini, GPT-4o, Claude 3.5, Midjourney, Sora, DeepSeek-R1), creativity, tone, complexity level, and custom constraint rules.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Layers className="h-4 w-4" />
              <span>3. Forge Production-Ready 18-Section Spec</span>
            </div>
            <p className="text-slate-400">
              Click "Forge Professional Prompt" to receive the P10 Omega specification covering executive summary, user intent, deliverables, security, risks, variations, and raw copy-paste prompt.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>4. Refine, Test, & Fill Variables</span>
            </div>
            <p className="text-slate-400">
              Use the live Sandbox to test responses, fill variables (`[VARIABLE_NAME]`), compare standard vs advanced versions, or issue follow-up instruction refinements.
            </p>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-slate-400 text-[11px]">
          <span>Developer: <strong className="text-amber-400 font-bold">SĀTYĀM (@prince.10x_)</strong></span>
          <button
            onClick={onClose}
            className="rounded-xl bg-amber-500 px-4 py-2 font-extrabold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
