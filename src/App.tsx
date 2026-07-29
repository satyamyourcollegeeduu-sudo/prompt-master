import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { PromptOutputDisplay } from './components/PromptOutputDisplay';
import { VariableFillerModal } from './components/VariableFillerModal';
import { PromptSandboxModal } from './components/PromptSandboxModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PresetLibraryModal } from './components/PresetLibraryModal';
import { PromptCompareModal } from './components/PromptCompareModal';
import { GuideModal } from './components/GuideModal';
import { SavedPromptsModal } from './components/SavedPromptsModal';
import {
  PromptGenerationRequest,
  GeneratedPromptResult,
  PresetTemplate,
} from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentResult, setCurrentResult] = useState<GeneratedPromptResult | null>(null);
  const [history, setHistory] = useState<GeneratedPromptResult[]>(() => {
    try {
      const saved = localStorage.getItem('promptforge_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('promptforge_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [variableModal, setVariableModal] = useState<{
    isOpen: boolean;
    promptText: string;
    variables: string[];
  }>({ isOpen: false, promptText: '', variables: [] });

  const [sandboxModal, setSandboxModal] = useState<{
    isOpen: boolean;
    promptText: string;
  }>({ isOpen: false, promptText: '' });

  const [compareModal, setCompareModal] = useState<{
    isOpen: boolean;
    standardPrompt: string;
    advancedPrompt: string;
  }>({ isOpen: false, standardPrompt: '', advancedPrompt: '' });

  // Save history & favorites to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('promptforge_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('promptforge_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  // Handle Initial Prompt Generation
  const handleGenerate = async (request: PromptGenerationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prompt.');
      }

      const newResult: GeneratedPromptResult = {
        id: 'pf_' + Date.now(),
        rawMarkdown: data.markdown,
        optimizedPrompt: '',
        suggestedModel: '',
        tips: [],
        advancedVersion: '',
        category: data.category || request.category,
        originalIdea: request.idea,
        createdAt: Date.now(),
      };

      setCurrentResult(newResult);
      setHistory((prev) => [newResult, ...prev.slice(0, 49)]); // Keep last 50
    } catch (err: any) {
      console.error('Generation Error:', err);
      setError(err.message || 'Something went wrong while forging your prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Prompt Refinement
  const handleRefinePrompt = async (instruction: string) => {
    if (!currentResult) return;

    setIsRefining(true);
    setError(null);

    try {
      const response = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPromptMarkdown: currentResult.rawMarkdown,
          refinementInstruction: instruction,
          category: currentResult.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine prompt.');
      }

      const updatedResult: GeneratedPromptResult = {
        ...currentResult,
        id: 'pf_' + Date.now(),
        rawMarkdown: data.markdown,
        createdAt: Date.now(),
      };

      setCurrentResult(updatedResult);
      setHistory((prev) => [updatedResult, ...prev]);
    } catch (err: any) {
      console.error('Refine Error:', err);
      setError(err.message || 'Failed to refine prompt.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleSelectPreset = (preset: PresetTemplate) => {
    handleGenerate({
      idea: preset.idea,
      category: preset.category,
      tone: 'Professional',
      complexity: 'Detailed',
    });
  };

  // History operations
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire prompt history?')) {
      setHistory([]);
      setFavorites([]);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#070B16] text-slate-100 flex font-sans selection:bg-amber-500/30">
      {/* Sleek Left Sidebar */}
      <Sidebar
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        historyCount={history.length}
        savedCount={favorites.length}
      />

      {/* Main Center Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header for Mobile & Navigation */}
        <Header
          onOpenPresets={() => setIsPresetsOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSaved={() => setIsSavedOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          historyCount={history.length}
          savedCount={favorites.length}
        />

        {/* Minimal Google AI Studio Homepage Workspace */}
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:py-20 flex flex-col justify-center space-y-8">
          {/* Minimal Clean Google AI Studio Center Hero Header */}
          <div className="text-center space-y-4 my-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Build Smarter Prompts for Every AI Model
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide">
              PROMPT MASTER • Dev: •{' '}
              <a
                href="https://instagram.com/prince.10x_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:underline font-bold"
              >
                @prince.10x_
              </a>
            </p>
          </div>

          {/* Single Central Google AI Studio Modern Prompt Box */}
          <PromptForm
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />

          {/* System Error Notification */}
          {error && (
            <div className="rounded-[20px] border border-rose-900/60 bg-rose-950/30 p-4 text-xs text-rose-300 flex items-start gap-3 shadow-lg max-w-3xl mx-auto">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-200">System Notification</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Generated Result Output Display (Appears when generated) */}
          {currentResult && (
            <div className="pt-6">
              <PromptOutputDisplay
                result={currentResult}
                onRefinePrompt={handleRefinePrompt}
                isRefining={isRefining}
                onOpenVariableFiller={(promptText, variables) =>
                  setVariableModal({ isOpen: true, promptText, variables })
                }
                onOpenSandbox={(promptText) => setSandboxModal({ isOpen: true, promptText })}
                onOpenCompare={(standardPrompt, advancedPrompt) =>
                  setCompareModal({ isOpen: true, standardPrompt, advancedPrompt })
                }
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <PresetLibraryModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(res) => setCurrentResult(res)}
        onDeleteResult={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <SavedPromptsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        favorites={favorites}
        history={history}
        onSelectResult={(res) => setCurrentResult(res)}
        onRemoveFavorite={handleToggleFavorite}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <VariableFillerModal
        isOpen={variableModal.isOpen}
        onClose={() => setVariableModal({ ...variableModal, isOpen: false })}
        promptTemplate={variableModal.promptText}
        variables={variableModal.variables}
      />

      <PromptSandboxModal
        isOpen={sandboxModal.isOpen}
        onClose={() => setSandboxModal({ ...sandboxModal, isOpen: false })}
        initialPromptText={sandboxModal.promptText}
      />

      <PromptCompareModal
        isOpen={compareModal.isOpen}
        onClose={() => setCompareModal({ ...compareModal, isOpen: false })}
        standardPrompt={compareModal.standardPrompt}
        advancedPrompt={compareModal.advancedPrompt}
      />
    </div>
  );
}
