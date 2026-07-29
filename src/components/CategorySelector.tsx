import React, { useRef } from 'react';
import { PromptCategory } from '../types';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  value: PromptCategory | 'Auto-Detect';
}

const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'auto', label: 'Auto Detect', icon: '✨', value: 'Auto-Detect' },
  { id: 'website', label: 'Website', icon: '🌐', value: 'Website Development' },
  { id: 'mobile', label: 'Mobile App', icon: '📱', value: 'Mobile Apps' },
  { id: 'chatbot', label: 'AI Chatbot', icon: '🤖', value: 'AI Chatbots' },
  { id: 'flutter', label: 'Flutter', icon: '⚛', value: 'Flutter' },
  { id: 'react', label: 'React', icon: '⚛', value: 'React' },
  { id: 'webtech', label: 'HTML/CSS/JS', icon: '💻', value: 'HTML/CSS/JavaScript' },
  { id: 'python', label: 'Python', icon: '🐍', value: 'Python' },
  { id: 'image', label: 'Image', icon: '🖼', value: 'Images' },
  { id: 'video', label: 'Video', icon: '🎥', value: 'Videos' },
  { id: 'pdf', label: 'PDF', icon: '📄', value: 'Document (PDF)' },
  { id: 'youtube', label: 'YouTube', icon: '📺', value: 'YouTube' },
  { id: 'marketing', label: 'Marketing', icon: '📈', value: 'Marketing' },
  { id: 'business', label: 'Business', icon: '💼', value: 'Business' },
  { id: 'writing', label: 'Writing', icon: '✍', value: 'Writing' },
  { id: 'games', label: 'Games', icon: '🎮', value: 'Games' },
  { id: 'automation', label: 'Automation', icon: '⚡', value: 'Automation' },
  { id: 'education', label: 'Education', icon: '🎓', value: 'Education' },
  { id: 'research', label: 'Research', icon: '🔬', value: 'Research' },
];

interface CategorySelectorProps {
  selectedCategory: PromptCategory | 'Auto-Detect';
  onSelectCategory: (category: PromptCategory | 'Auto-Detect') => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      if (e.deltaY !== 0) {
        scrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full group/carousel">
      {/* Left Scroll Gradient & Arrow */}
      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover/carousel:flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 text-slate-300 border border-slate-700/80 shadow-md backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all -ml-1"
        title="Scroll Left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Horizontal Scrollable Chip Slider Container */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-1 text-xs select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORY_ITEMS.map((cat) => {
          const isActive = selectedCategory === cat.value;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.value)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md snap-start transition-all duration-200 border cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40 scale-[1.02]'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/90'
              }`}
            >
              <span className="text-xs">{cat.icon}</span>
              <span className="whitespace-nowrap">{cat.label}</span>
              {isActive && (
                <Sparkles className="h-3 w-3 text-amber-400 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Arrow */}
      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden group-hover/carousel:flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 text-slate-300 border border-slate-700/80 shadow-md backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all -mr-1"
        title="Scroll Right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
