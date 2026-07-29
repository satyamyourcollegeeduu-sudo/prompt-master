import React, { useState, useRef, useEffect } from 'react';
import {
  PromptCategory,
  TargetModel,
  PromptTone,
  PromptComplexity,
  PromptGenerationRequest,
} from '../types';
import { FileAttachmentItem } from './AttachmentPanel';
import {
  Flame,
  Sparkles,
  Trash2,
  Paperclip,
  X,
  Plus,
  Mic,
  MicOff,
  Folder,
  Upload,
  Camera,
  Film,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface PromptFormProps {
  onSubmit: (request: PromptGenerationRequest) => void;
  isLoading: boolean;
  onRandomPreset?: () => void;
}

interface SuggestionChip {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

const SUGGESTION_CHIPS: SuggestionChip[] = [
  {
    id: 'website',
    label: 'Website Builder',
    icon: '🌐',
    prompt: 'Build a modern full-stack website specification with React, Tailwind CSS, and Node.js backend',
  },
  {
    id: 'android',
    label: 'Android App',
    icon: '📱',
    prompt: 'Create a modern Android application architecture using Kotlin and Jetpack Compose',
  },
  {
    id: 'chatbot',
    label: 'AI Chatbot',
    icon: '🤖',
    prompt: 'Design an intelligent AI customer support chatbot with custom memory and fallback logic',
  },
  {
    id: 'logo',
    label: 'Logo Design',
    icon: '🎨',
    prompt: 'Generate detailed vector logo design prompts for Midjourney and DALL-E 3',
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: '📄',
    prompt: 'Write a high-impact tech resume tailored for senior software engineering roles',
  },
  {
    id: 'email',
    label: 'Email Writer',
    icon: '📧',
    prompt: 'Draft a compelling sales outreach email campaign with high conversion rates',
  },
  {
    id: 'youtube',
    label: 'YouTube Script',
    icon: '📺',
    prompt: 'Create an engaging 10-minute video script for a tech product review and tutorial',
  },
  {
    id: 'marketing',
    label: 'Marketing Copy',
    icon: '📢',
    prompt: 'Generate high-performing ad copy variations for social media marketing campaigns',
  },
  {
    id: 'landing',
    label: 'Landing Page',
    icon: '🛍',
    prompt: 'Design a high-converting SaaS landing page structure and copywriting guide',
  },
  {
    id: 'study',
    label: 'Study Notes',
    icon: '📚',
    prompt: 'Synthesize complex computer science topics into concise study notes with cheat sheets',
  },
  {
    id: 'python',
    label: 'Python Code',
    icon: '💻',
    prompt: 'Develop a clean, modular Python script for automated web scraping and data processing',
  },
  {
    id: 'flutter',
    label: 'Flutter App',
    icon: '⚛',
    prompt: 'Architect a scalable cross-platform Flutter mobile app with Riverpod state management',
  },
  {
    id: 'game',
    label: 'Game Idea',
    icon: '🎮',
    prompt: 'Design a retro 2D pixel art platformer game mechanic and level progression plan',
  },
  {
    id: 'blog',
    label: 'Blog Article',
    icon: '📰',
    prompt: 'Write an SEO-optimized 1500-word deep-dive article on generative AI technology trends',
  },
  {
    id: 'business',
    label: 'Business Plan',
    icon: '📊',
    prompt: 'Formulate a comprehensive startup business plan with market analysis and revenue models',
  },
];

export const PromptForm: React.FC<PromptFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [idea, setIdea] = useState('');
  const [attachments, setAttachments] = useState<FileAttachmentItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Hidden File Input Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const chipsScrollRef = useRef<HTMLDivElement>(null);

  // Close plus menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setPlusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Chips Mouse Wheel Scroll
  const handleChipsWheel = (e: React.WheelEvent) => {
    if (chipsScrollRef.current) {
      if (e.deltaY !== 0) {
        chipsScrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      chipsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Web Speech API for Microphone
  const handleMicToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your prompt.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setIdea((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // File Handlers
  const handleAddFiles = (files: File[]) => {
    const newItems: FileAttachmentItem[] = files.map((file) => {
      let cat: 'image' | 'video' | 'pdf' | 'other' = 'other';
      if (file.type.startsWith('image/')) cat = 'image';
      else if (file.type.startsWith('video/')) cat = 'video';
      else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) cat = 'pdf';

      let previewUrl: string | undefined = undefined;
      if (cat === 'image' || cat === 'video') {
        previewUrl = URL.createObjectURL(file);
      }

      return {
        id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
        category: cat,
        previewUrl,
      };
    });

    setAttachments((prev) => [...prev, ...newItems]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAddFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleClearAllAttachments = () => {
    attachments.forEach((att) => {
      if (att.previewUrl) URL.revokeObjectURL(att.previewUrl);
    });
    setAttachments([]);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!idea.trim() && attachments.length === 0) return;

    let fullIdea = idea.trim();
    if (attachments.length > 0) {
      const attachmentSummaries = attachments
        .map((a) => `- ${a.name} (${a.category.toUpperCase()}, ${(a.size / 1024).toFixed(1)} KB)`)
        .join('\n');
      fullIdea += `\n\n[Attached Context & Media Files]:\n${attachmentSummaries}`;
    }

    onSubmit({
      idea: fullIdea,
      category: 'Auto-Detect',
      targetModel: 'Auto-Select',
      tone: 'Professional',
      complexity: 'Detailed',
      customConstraints: '',
      attachments: attachments.map((a) => ({
        name: a.name,
        type: a.type,
        size: a.size,
        category: a.category,
      })),
    });
  };

  const handleClear = () => {
    setIdea('');
    handleClearAllAttachments();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div id="main-prompt-area" className="w-full max-w-4xl mx-auto my-6">
      {/* Hidden Native File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf,.pdf,text/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Google AI Studio Modern Prompt Container (24px rounded corners) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-[24px] border transition-all duration-300 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 shadow-amber-500/20 ring-2 ring-amber-400/50 scale-[1.01]'
            : 'border-slate-800/90 bg-[#0C101D]/90 hover:border-slate-700 focus-within:border-amber-500/70 focus-within:ring-2 focus-within:ring-amber-500/20'
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Clean Textarea */}
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your prompt idea and let PROMPT MASTER generate the perfect AI prompt."
              rows={5}
              className="w-full bg-transparent text-base sm:text-lg text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-normal"
              required={attachments.length === 0}
            />

            {/* Clear Button */}
            {idea && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-0 right-0 text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Clear input"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Attached Files Preview Chips */}
          {attachments.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5 text-amber-400" />
                  <span>Attached Context ({attachments.length})</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearAllAttachments}
                  className="text-[11px] text-rose-400 hover:underline font-semibold"
                >
                  Remove All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {attachments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 px-3 py-1.5 text-xs text-slate-200 shadow-sm hover:border-slate-700 transition-all"
                  >
                    {item.category === 'image' && item.previewUrl ? (
                      <img src={item.previewUrl} alt={item.name} className="h-5 w-5 rounded-full object-cover" />
                    ) : item.category === 'video' ? (
                      <Film className="h-3.5 w-3.5 text-pink-400" />
                    ) : item.category === 'pdf' ? (
                      <FileText className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Paperclip className="h-3.5 w-3.5 text-cyan-400" />
                    )}

                    <span className="max-w-[140px] truncate font-medium">{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({formatFileSize(item.size)})</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(item.id)}
                      className="text-slate-400 hover:text-rose-400 p-0.5 ml-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Bar: Plus Button, Microphone Button, and Generate Prompt Button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
            {/* Left Action Buttons: + (Plus Menu) and 🎤 Microphone */}
            <div className="flex items-center gap-2 relative" ref={plusMenuRef}>
              {/* Plus Button */}
              <button
                type="button"
                onClick={() => setPlusMenuOpen(!plusMenuOpen)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                  plusMenuOpen
                    ? 'border-amber-500/80 bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/20 rotate-45'
                    : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900'
                }`}
                title="Add content or upload media"
              >
                <Plus className="h-5 w-5 transition-transform duration-200" />
              </button>

              {/* Microphone Button */}
              <button
                type="button"
                onClick={handleMicToggle}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                  isListening
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse ring-2 ring-rose-500/40'
                    : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900'
                }`}
                title={isListening ? 'Listening... Click to stop' : 'Voice input (Microphone)'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              {/* Plus Popup Menu (Google AI Studio Style) */}
              {plusMenuOpen && (
                <div className="absolute left-0 bottom-12 z-50 w-52 rounded-[24px] border border-slate-800/90 bg-[#0F1424]/95 backdrop-blur-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  {/* Drive */}
                  <button
                    type="button"
                    onClick={() => {
                      setPlusMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[16px] text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-amber-300 transition-all text-left"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      <Folder className="h-3.5 w-3.5" />
                    </div>
                    <span>Drive</span>
                  </button>

                  {/* Upload Files */}
                  <button
                    type="button"
                    onClick={() => {
                      setPlusMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[16px] text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-amber-300 transition-all text-left"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Upload className="h-3.5 w-3.5" />
                    </div>
                    <span>Upload Files</span>
                  </button>

                  {/* Camera */}
                  <button
                    type="button"
                    onClick={() => {
                      setPlusMenuOpen(false);
                      cameraInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[16px] text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-amber-300 transition-all text-left"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30">
                      <Camera className="h-3.5 w-3.5" />
                    </div>
                    <span>Camera</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Action: Primary Generate Prompt Button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isLoading || (!idea.trim() && attachments.length === 0)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:via-orange-400 hover:to-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Forging Prompt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-slate-950 fill-slate-950" />
                  <span>Generate Prompt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Google AI Studio Style Horizontally Scrollable Suggestion Chips */}
      <div className="relative mt-4 group">
        {/* Left Scroll Navigation Button */}
        <button
          type="button"
          onClick={() => scrollChips('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-md"
          title="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={chipsScrollRef}
          onWheel={handleChipsWheel}
          className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 scroll-smooth no-scrollbar select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setIdea(chip.prompt)}
              className="flex items-center gap-2 shrink-0 rounded-full border border-slate-800/90 bg-[#0C101D]/80 backdrop-blur-md px-4 py-2 text-xs font-semibold text-slate-300 shadow-md hover:border-amber-500/50 hover:bg-slate-900/90 hover:text-amber-300 hover:scale-[1.02] active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer group/chip"
            >
              <span className="text-sm transition-transform duration-200 group-hover/chip:scale-110">
                {chip.icon}
              </span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Right Scroll Navigation Button */}
        <button
          type="button"
          onClick={() => scrollChips('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-md"
          title="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
