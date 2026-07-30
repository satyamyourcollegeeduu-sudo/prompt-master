import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Play, RefreshCw, Copy, Check, Terminal, Sparkles, AlertCircle } from 'lucide-react';
import { postApiJson } from '../utils/apiClient';

interface PromptSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPromptText: string;
}

export const PromptSandboxModal: React.FC<PromptSandboxModalProps> = ({
  isOpen,
  onClose,
  initialPromptText,
}) => {
  const [promptText, setPromptText] = useState(initialPromptText);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRunTest = async () => {
    if (!promptText.trim()) return;

    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const data = await postApiJson(
        '/api/test-prompt',
        { promptText },
        'Unable to generate prompt. Please try again.'
      );

      setTestResult(data.testResult || '');
    } catch (err: any) {
      console.error('Sandbox execution error (Detailed):', err);
      setError(err.message || 'Unable to generate prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = () => {
    if (testResult) {
      navigator.clipboard.writeText(testResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Prompt Sandbox Simulator
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Gemini Powered
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Execute your prompt live in a sandbox to test how an AI model interprets and outputs results.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Prompt Input Column */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
              <span>Executable Prompt</span>
              <button
                onClick={() => setPromptText(initialPromptText)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Reset to Original
              </button>
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
            />
            <button
              onClick={handleRunTest}
              disabled={isLoading || !promptText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Executing Prompt in AI Sandbox...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Execute & Preview Output</span>
                </>
              )}
            </button>
          </div>

          {/* Sandbox Output Result Column */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>AI Sandbox Output Preview</span>
              </label>
              {testResult && (
                <button
                  onClick={handleCopyResult}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Result'}</span>
                </button>
              )}
            </div>

            <div className="h-[310px] rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-y-auto font-sans text-xs text-slate-200 leading-relaxed shadow-inner">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                  <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
                  <p className="text-xs text-center font-medium">
                    Simulating AI model response with your forged prompt...
                  </p>
                </div>
              ) : error ? (
                <div className="flex items-start gap-2 text-rose-400 p-3 bg-rose-950/20 border border-rose-900/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : testResult ? (
                <div className="markdown-body space-y-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{testResult}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                  <Play className="h-8 w-8 text-slate-600" />
                  <p className="text-xs text-center">
                    Click <span className="text-emerald-400 font-semibold">Execute & Preview Output</span> above to test how Gemini interprets this prompt in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
