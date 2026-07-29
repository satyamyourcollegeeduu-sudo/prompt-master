import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GeneratedPromptResult } from '../types';
import { parsePromptMarkdown } from '../utils/markdownParser';
import {
  Copy,
  Check,
  Sparkles,
  Sliders,
  Play,
  Download,
  RefreshCw,
  Send,
  Layers,
  Target,
  Zap,
  GraduationCap,
  Briefcase,
  Award,
  ShieldAlert,
  FileText,
  Code2,
  Layout,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  TestTube2,
  Wand2,
  Gauge,
  Cpu,
  Boxes,
  Eye,
  Rocket,
  BookOpen,
  CheckSquare,
  Compass,
  Wrench,
  Flame,
  User,
  Instagram,
  Bot,
} from 'lucide-react';

interface PromptOutputDisplayProps {
  result: GeneratedPromptResult;
  onRefinePrompt: (instruction: string) => void;
  isRefining: boolean;
  onOpenVariableFiller: (promptText: string, variables: string[]) => void;
  onOpenSandbox: (promptText: string) => void;
  onOpenCompare?: (standardPrompt: string, advancedPrompt: string) => void;
}

export const PromptOutputDisplay: React.FC<PromptOutputDisplayProps> = ({
  result,
  onRefinePrompt,
  isRefining,
  onOpenVariableFiller,
  onOpenSandbox,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [customRefinement, setCustomRefinement] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'structured' | 'raw'>('structured');
  const [activeVariation, setActiveVariation] = useState<'beginner' | 'professional' | 'enterprise'>('professional');

  const parsed = parsePromptMarkdown(result.rawMarkdown);

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([result.rawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PromptForge_P10_Omega_${result.category.replace(/\s+/g, '_')}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickRefinements = [
    'Add strict JSON schema constraints',
    'Enhance security and privacy safeguards',
    'Optimize for Gemini 3.6 / Claude 3.5 / GPT-4o',
    'Include step-by-step reasoning triggers',
    'Make it ultra-concise & high token density',
  ];

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRefinement.trim()) return;
    onRefinePrompt(customRefinement.trim());
    setCustomRefinement('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar for Output */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-amber-500/40 text-amber-400 font-bold shadow-lg shadow-amber-500/10">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">P10 Omega Engine Prompt Specification</h2>
              <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                P10 Omega Engine • {result.category}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
              <span className="line-clamp-1">
                Idea: <span className="italic text-slate-300">"{result.originalIdea}"</span>
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline text-amber-300/80 font-medium">
                Developer: SĀTYĀM (@prince.10x_)
              </span>
            </div>
          </div>
        </div>

        {/* View Toggle & Downloads */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveViewMode('structured')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeViewMode === 'structured'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Structured Cards (18 Sections)
            </button>
            <button
              onClick={() => setActiveViewMode('raw')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeViewMode === 'raw'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <button
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-amber-500 hover:text-amber-300 transition-all"
            title="Download .md file"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export .md</span>
          </button>
        </div>
      </div>

      {activeViewMode === 'structured' ? (
        <div className="space-y-6">
          {/* Row 1: #1 Executive Summary, #2 User Goal, #3 Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* #1 Executive Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 text-xs font-bold shrink-0">
                    1
                  </span>
                  <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    Executive Summary
                  </h3>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-slate-300 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.executiveSummary}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* #2 User Goal */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 text-xs font-bold shrink-0">
                    2
                  </span>
                  <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 shrink-0" />
                    User Goal
                  </h3>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-slate-300 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.userGoal}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* #3 Assumptions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-slate-950 text-xs font-bold shrink-0">
                    3
                  </span>
                  <h3 className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                    Assumptions
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {parsed.assumptions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <Zap className="h-3 w-3 text-teal-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* #4 Optimized Prompt */}
          <div className="rounded-2xl border border-amber-500/40 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden forge-glow">
            <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
                  4
                </span>
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <span>Optimized Prompt</span>
                  <span className="text-xs font-normal text-amber-400/80">(P10 Omega Spec)</span>
                </h3>
                {parsed.variables.length > 0 && (
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    {parsed.variables.length} Variables Detected
                  </span>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {parsed.variables.length > 0 && (
                  <button
                    onClick={() =>
                      onOpenVariableFiller(parsed.optimizedPrompt, parsed.variables)
                    }
                    className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Fill Variables ({parsed.variables.length})</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenSandbox(parsed.optimizedPrompt)}
                  className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                  title="Test execution in Gemini AI Sandbox"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Test in Sandbox</span>
                </button>

                <button
                  onClick={() => handleCopy(parsed.optimizedPrompt, 'optimized')}
                  className="flex items-center gap-1 rounded-lg bg-amber-500 text-slate-950 px-3 py-1 text-xs font-bold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                >
                  {copiedSection === 'optimized' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Block Container */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 leading-relaxed overflow-x-auto selection:bg-amber-500/30">
              <pre className="whitespace-pre-wrap break-words">{parsed.optimizedPrompt}</pre>
            </div>
          </div>

          {/* Row 2: #5 Functional Requirements, #6 Non-Functional Requirements, #7 Recommended AI Model */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* #5 Functional Requirements */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-slate-950 text-xs font-bold">
                  5
                </span>
                <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Functional Requirements
                </h3>
              </div>
              <div className="space-y-2">
                {parsed.functionalRequirements.length > 0 ? (
                  parsed.functionalRequirements.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-xs text-slate-300"
                    >
                      <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Core functional logic & feature rules defined.</p>
                )}
              </div>
            </div>

            {/* #6 Non-Functional Requirements */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-slate-950 text-xs font-bold">
                  6
                </span>
                <h3 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Non-Functional Requirements
                </h3>
              </div>
              <div className="space-y-2">
                {parsed.nonFunctionalRequirements.length > 0 ? (
                  parsed.nonFunctionalRequirements.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-xs text-slate-300"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Reliability, performance, and quality benchmarks.</p>
                )}
              </div>
            </div>

            {/* #7 Recommended AI Model */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-bold">
                  7
                </span>
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Recommended AI Model
                </h3>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-slate-300 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {parsed.recommendedAiModel}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Row 3: #8 Tech Stack (if applicable), #9 UI/UX Suggestions, #10 Security Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* #8 Tech Stack */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 text-xs font-bold">
                  8
                </span>
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Tech Stack (if applicable)
                </h3>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5 text-xs text-slate-300 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {parsed.techStack}
                </ReactMarkdown>
              </div>
            </div>

            {/* #9 UI/UX Suggestions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-slate-950 text-xs font-bold">
                  9
                </span>
                <h3 className="text-sm font-bold text-pink-300 flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  UI/UX Suggestions
                </h3>
              </div>
              <div className="rounded-xl border border-pink-500/20 bg-pink-950/20 p-3.5 text-xs text-slate-300 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {parsed.uiUxSuggestions}
                </ReactMarkdown>
              </div>
            </div>

            {/* #10 Security Recommendations */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-bold">
                  10
                </span>
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Security Recommendations
                </h3>
              </div>
              <div className="space-y-2">
                {parsed.securityRecommendations.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-xs text-slate-300"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: #11 Performance Optimization, #12 Testing Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* #11 Performance Optimization */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-slate-950 text-xs font-bold shrink-0">
                  11
                </span>
                <h3 className="text-xs font-bold text-orange-300 flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 shrink-0" />
                  Performance Optimization
                </h3>
              </div>
              <div className="rounded-xl border border-orange-500/20 bg-orange-950/20 p-3 text-xs text-slate-300 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {parsed.performanceOptimization}
                </ReactMarkdown>
              </div>
            </div>

            {/* #12 Testing Checklist */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-slate-950 text-xs font-bold shrink-0">
                  12
                </span>
                <h3 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <TestTube2 className="h-3.5 w-3.5 shrink-0" />
                  Testing Checklist
                </h3>
              </div>
              <div className="space-y-1.5">
                {parsed.testingChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <Check className="h-3 w-3 text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 5: #13 Risks, #14 Best Practices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* #13 Risks */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-slate-950 text-xs font-bold">
                  13
                </span>
                <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risks & Potential Bottlenecks
                </h3>
              </div>
              <div className="space-y-2">
                {parsed.risks.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-xs text-slate-300"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* #14 Best Practices */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
                  14
                </span>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Best Practices
                </h3>
              </div>
              <div className="space-y-2">
                {parsed.bestPractices.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 text-xs text-slate-300"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sections #15, #16, #17: Beginner, Professional, Enterprise Prompt Versions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-slate-950 text-xs font-bold">
                  15-17
                </span>
                <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Prompt Tier Variations
                </h3>
              </div>

              {/* Variation Tabs */}
              <div className="flex flex-wrap rounded-lg bg-slate-950 p-1 border border-slate-800 gap-1">
                <button
                  onClick={() => setActiveVariation('beginner')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeVariation === 'beginner'
                      ? 'bg-indigo-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>#15 Beginner Version</span>
                </button>

                <button
                  onClick={() => setActiveVariation('professional')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeVariation === 'professional'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>#16 Professional Version</span>
                </button>

                <button
                  onClick={() => setActiveVariation('enterprise')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeVariation === 'enterprise'
                      ? 'bg-purple-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>#17 Enterprise Version</span>
                </button>
              </div>
            </div>

            {/* Display active variation */}
            <div>
              {activeVariation === 'beginner' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>#15 Beginner Version — Simple, direct, easy-to-use prompt</span>
                    <button
                      onClick={() => handleCopy(parsed.beginnerVersion || parsed.optimizedPrompt, 'var_beginner')}
                      className="flex items-center gap-1 font-bold text-indigo-400 hover:underline"
                    >
                      {copiedSection === 'var_beginner' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSection === 'var_beginner' ? 'Copied' : 'Copy Beginner'}</span>
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {parsed.beginnerVersion || parsed.optimizedPrompt}
                  </div>
                </div>
              )}

              {activeVariation === 'professional' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>#16 Professional Version — Balanced, feature-rich prompt with clear rules</span>
                    <button
                      onClick={() => handleCopy(parsed.professionalVersion || parsed.optimizedPrompt, 'var_pro')}
                      className="flex items-center gap-1 font-bold text-amber-400 hover:underline"
                    >
                      {copiedSection === 'var_pro' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSection === 'var_pro' ? 'Copied' : 'Copy Professional'}</span>
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {parsed.professionalVersion || parsed.optimizedPrompt}
                  </div>
                </div>
              )}

              {activeVariation === 'enterprise' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>#17 Enterprise Version — Enterprise-grade prompt with strict validation & edge-case guards</span>
                    <button
                      onClick={() => handleCopy(parsed.enterpriseVersion || parsed.optimizedPrompt, 'var_enterprise')}
                      className="flex items-center gap-1 font-bold text-purple-400 hover:underline"
                    >
                      {copiedSection === 'var_enterprise' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSection === 'var_enterprise' ? 'Copied' : 'Copy Enterprise'}</span>
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {parsed.enterpriseVersion || parsed.optimizedPrompt}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section #18: Final Copy-Paste Prompt */}
          <div className="rounded-2xl border border-purple-500/40 bg-slate-900/90 p-5 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-slate-950 text-xs font-bold">
                  18
                </span>
                <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  #18 Final Copy-Paste Prompt
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(parsed.finalCopyPastePrompt, 'final_copy_paste')}
                  className="flex items-center gap-1 rounded-lg bg-purple-500 text-white px-3 py-1 text-xs font-bold hover:bg-purple-400 transition-all shadow-md shadow-purple-500/20"
                >
                  {copiedSection === 'final_copy_paste' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied Final Prompt!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Final Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto">
              <pre className="whitespace-pre-wrap break-words">{parsed.finalCopyPastePrompt}</pre>
            </div>
          </div>
        </div>
      ) : (
        /* Raw Full Markdown View */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => handleCopy(result.rawMarkdown, 'raw')}
              className="flex items-center gap-1 rounded-lg bg-amber-500 text-slate-950 px-3 py-1.5 text-xs font-bold hover:bg-amber-400 transition-all"
            >
              {copiedSection === 'raw' ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Entire Markdown</span>
                </>
              )}
            </button>
          </div>
          <div className="markdown-body text-slate-200 text-sm leading-relaxed space-y-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.rawMarkdown}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Developer & Credits Bar */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-purple-950/30 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
            <User className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-100">
              <span>Developer: SĀTYĀM</span>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-400">
                Creator
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              PromptForge AI – P10 OMEGA ENGINE (Version: P10 Ultimate Edition)
            </p>
          </div>
        </div>

        <a
          href="https://instagram.com/prince.10x_"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl border border-pink-500/40 bg-pink-500/10 px-3 py-1.5 font-bold text-pink-300 hover:bg-pink-500/20 transition-all"
        >
          <Instagram className="h-3.5 w-3.5 text-pink-400" />
          <span>Instagram: @prince.10x_</span>
        </a>
      </div>

      {/* Refinement Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className={`h-4 w-4 text-amber-400 ${isRefining ? 'animate-spin' : ''}`} />
          <h3 className="text-sm font-bold text-slate-200">Refine & Fine-Tune This P10 Omega Prompt</h3>
        </div>

        {/* Quick Refinement Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {quickRefinements.map((chip, i) => (
            <button
              key={i}
              onClick={() => onRefinePrompt(chip)}
              disabled={isRefining}
              className="rounded-lg border border-slate-700/80 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-amber-500/50 hover:text-amber-300 transition-all disabled:opacity-50"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Custom Refinement Form */}
        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <input
            type="text"
            value={customRefinement}
            onChange={(e) => setCustomRefinement(e.target.value)}
            placeholder="Specify custom edit (e.g., 'Enforce JSON schema output', 'Add privacy guardrails', 'Optimize for Python/Flutter')..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            disabled={isRefining}
          />
          <button
            type="submit"
            disabled={isRefining || !customRefinement.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all shrink-0"
          >
            {isRefining ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Refine</span>
          </button>
        </form>
      </div>
    </div>
  );
};
