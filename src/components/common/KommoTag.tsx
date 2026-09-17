import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';

export type KommoTagColor =
  | 'emerald'
  | 'blue'
  | 'amber'
  | 'rose'
  | 'purple'
  | 'cyan'
  | 'indigo'
  | 'zinc';

export interface TagStyleDefinition {
  bg: string;
  border: string;
  text: string;
  dot: string;
  hover: string;
}

export const KOMMO_TAG_PALETTES: Record<KommoTagColor, TagStyleDefinition> = {
  emerald: {
    bg: 'bg-emerald-500/12',
    border: 'border-emerald-500/35',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    hover: 'hover:border-emerald-400/70 hover:bg-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-500/12',
    border: 'border-blue-500/35',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
    hover: 'hover:border-blue-400/70 hover:bg-blue-500/20',
  },
  amber: {
    bg: 'bg-amber-500/12',
    border: 'border-amber-500/35',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    hover: 'hover:border-amber-400/70 hover:bg-amber-500/20',
  },
  rose: {
    bg: 'bg-rose-500/12',
    border: 'border-rose-500/35',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
    hover: 'hover:border-rose-400/70 hover:bg-rose-500/20',
  },
  purple: {
    bg: 'bg-purple-500/12',
    border: 'border-purple-500/35',
    text: 'text-purple-300',
    dot: 'bg-purple-400',
    hover: 'hover:border-purple-400/70 hover:bg-purple-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/12',
    border: 'border-cyan-500/35',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
    hover: 'hover:border-cyan-400/70 hover:bg-cyan-500/20',
  },
  indigo: {
    bg: 'bg-indigo-500/12',
    border: 'border-indigo-500/35',
    text: 'text-indigo-300',
    dot: 'bg-indigo-400',
    hover: 'hover:border-indigo-400/70 hover:bg-indigo-500/20',
  },
  zinc: {
    bg: 'bg-zinc-700/30',
    border: 'border-zinc-600/40',
    text: 'text-zinc-300',
    dot: 'bg-zinc-400',
    hover: 'hover:border-zinc-500/70 hover:bg-zinc-700/45',
  },
};

/**
 * Intelligent semantic resolver for Kommo tag colors.
 * Maps high-frequency sales, stage, and qualification tags to recognizable colors.
 */
export function resolveKommoTagColor(tag: string): KommoTagColor {
  const lower = tag.toLowerCase().trim();

  // Emerald / Green: positive, high-ticket, decision-makers, approved
  if (
    lower.includes('ticket alto') ||
    lower.includes('decisor') ||
    lower.includes('aprovad') ||
    lower.includes('ganh') ||
    lower.includes('vip') ||
    lower.includes('fechamento')
  ) {
    return 'emerald';
  }

  // Rose / Red: urgency, churn risk, complaints, unattended
  if (
    lower.includes('urgent') ||
    lower.includes('sem atendimento') ||
    lower.includes('risco') ||
    lower.includes('objeç') ||
    lower.includes('reclama') ||
    lower.includes('crític')
  ) {
    return 'rose';
  }

  // Amber / Orange: pending, negotiation, follow-up, analysis
  if (
    lower.includes('negocia') ||
    lower.includes('follow') ||
    lower.includes('análise') ||
    lower.includes('aguardando') ||
    lower.includes('proposta') ||
    lower.includes('orçamento')
  ) {
    return 'amber';
  }

  // Blue / Light Blue: inbound channels, ads, meetings
  if (
    lower.includes('meta') ||
    lower.includes('google') ||
    lower.includes('anúncio') ||
    lower.includes('reuni') ||
    lower.includes('inbound')
  ) {
    return 'blue';
  }

  // Purple / Violet: partnerships, franchises, referrals
  if (
    lower.includes('parcer') ||
    lower.includes('indica') ||
    lower.includes('franqui') ||
    lower.includes('b2b')
  ) {
    return 'purple';
  }

  // Cyan / Teal: recent leads, qualification, warm status
  if (
    lower.includes('recent') ||
    lower.includes('novo') ||
    lower.includes('qualific') ||
    lower.includes('morno')
  ) {
    return 'cyan';
  }

  // Indigo: legal, contracts, direct
  if (lower.includes('contrato') || lower.includes('jurídic') || lower.includes('direto')) {
    return 'indigo';
  }

  // Deterministic fallback based on string hash
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  const colorKeys: KommoTagColor[] = [
    'emerald',
    'blue',
    'amber',
    'purple',
    'cyan',
    'indigo',
    'rose',
    'zinc',
  ];
  return colorKeys[Math.abs(hash) % colorKeys.length];
}

export interface KommoTagProps {
  tag: string;
  color?: KommoTagColor;
  size?: 'xs' | 'sm' | 'md';
  removable?: boolean;
  onRemove?: (tag: string) => void;
  onClick?: (tag: string) => void;
  className?: string;
}

export const KommoTag: React.FC<KommoTagProps> = ({
  tag,
  color,
  size = 'xs',
  removable = false,
  onRemove,
  onClick,
  className = '',
}) => {
  const resolvedColor = color || resolveKommoTagColor(tag);
  const palette = KOMMO_TAG_PALETTES[resolvedColor];

  const sizeClasses = {
    xs: 'text-[10.5px] px-2 py-0.5 gap-1.5 leading-none',
    sm: 'text-[11.5px] px-2.5 py-1 gap-1.5 leading-none',
    md: 'text-xs px-3 py-1.5 gap-2 leading-none',
  }[size];

  const dotSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2 h-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border transition-all duration-150 select-none group/tag ${sizeClasses} ${palette.bg} ${palette.border} ${palette.text} ${palette.hover} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick ? () => onClick(tag) : undefined}
      title={`Tag: ${tag}`}
    >
      <span className={`rounded-full shrink-0 ${dotSize} ${palette.dot} opacity-90`} />
      <span className="truncate max-w-[140px] tracking-tight">{tag}</span>

      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded hover:bg-black/30 text-current opacity-70 hover:opacity-100 transition cursor-pointer"
          title={`Remover tag "${tag}"`}
        >
          <X className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        </button>
      )}
    </span>
  );
};

export interface KommoTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  availableSuggestions?: string[];
  placeholder?: string;
  size?: 'xs' | 'sm';
  maxTags?: number;
  className?: string;
}

const DEFAULT_POPULAR_TAGS = [
  'Ticket Alto',
  'Decisor',
  'Negociação Final',
  'Follow-up 24h',
  'Orçamento Aprovado',
  'Sem Atendimento',
  'Lead Recente',
  'Urgente',
  'Parceria',
  'Reunião Agendada',
];

export const KommoTagInput: React.FC<KommoTagInputProps> = ({
  tags = [],
  onChange,
  availableSuggestions = [],
  placeholder = 'Adicionar tag...',
  size = 'xs',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine unique suggestions
  const allSuggestions = Array.from(
    new Set([...availableSuggestions, ...DEFAULT_POPULAR_TAGS])
  );

  // Filter out suggestions that are already in tags
  const filteredSuggestions = allSuggestions.filter((item) => {
    const notAlreadySelected = !tags.includes(item);
    if (!inputValue.trim()) return notAlreadySelected;
    return notAlreadySelected && item.toLowerCase().includes(inputValue.toLowerCase().trim());
  });

  const canCreateNew =
    inputValue.trim().length > 0 &&
    !tags.some((t) => t.toLowerCase() === inputValue.trim().toLowerCase()) &&
    !allSuggestions.some((t) => t.toLowerCase() === inputValue.trim().toLowerCase());

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInputValue('');
    setIsOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        if (filteredSuggestions.length > 0 && highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          addTag(filteredSuggestions[highlightedIndex]);
        } else {
          addTag(inputValue);
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % (filteredSuggestions.length + (canCreateNew ? 1 : 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + (filteredSuggestions.length + (canCreateNew ? 1 : 0))) % (filteredSuggestions.length + (canCreateNew ? 1 : 0)));
    }
  };

  return (
    <div ref={containerRef} className={`relative space-y-2 ${className}`}>
      {/* Active Tags Chips Container */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
        {tags.map((tag) => (
          <KommoTag
            key={tag}
            tag={tag}
            size={size}
            removable={true}
            onRemove={removeTag}
          />
        ))}

        {/* Inline trigger button to open tag input */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-v4-muted hover:text-v4-text bg-v4-surface/60 hover:bg-v4-elevated border border-dashed border-v4-border/60 hover:border-v4-border rounded-md px-2 py-0.5 transition cursor-pointer select-none"
            title="Adicionar ou modificar tags"
          >
            <Plus className="w-3 h-3" />
            <span>Tag</span>
          </button>
        )}
      </div>

      {/* Active Input & Autocomplete Dropdown */}
      {isOpen && (
        <div className="space-y-1.5 animate-in fade-in-50 duration-100">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-v4-surface border border-v4-primary/60 rounded-md px-2.5 py-1 text-xs text-v4-text placeholder-v4-muted/70 outline-none focus:ring-1 focus:ring-v4-primary/40 shadow-xs"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-v4-primary text-white text-[10px] font-semibold hover:bg-v4-primary-hover transition cursor-pointer"
              >
                Enter ↵
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Popover */}
          <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-lg bg-v4-elevated border border-v4-border/70 shadow-xl p-1.5 space-y-1">
            {canCreateNew && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium text-v4-primary hover:bg-v4-surface flex items-center justify-between transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar nova tag: &ldquo;<strong>{inputValue.trim()}</strong>&rdquo;</span>
                </span>
                <span className="text-[10px] font-mono text-v4-muted">Enter</span>
              </button>
            )}

            {filteredSuggestions.length > 0 ? (
              <>
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-v4-muted/70 border-b border-v4-border/30 flex justify-between items-center">
                  <span>Tags Sugeridas</span>
                  <span>{filteredSuggestions.length}</span>
                </div>
                <div className="space-y-0.5 max-h-40 overflow-y-auto">
                  {filteredSuggestions.map((item, idx) => {
                    const color = resolveKommoTagColor(item);
                    const palette = KOMMO_TAG_PALETTES[color];
                    const isHighlighted = idx === highlightedIndex;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => addTag(item)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between transition cursor-pointer ${
                          isHighlighted ? 'bg-v4-surface text-v4-text' : 'text-v4-muted hover:text-v4-text hover:bg-v4-surface/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${palette.dot}`} />
                          <span>{item}</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border ${palette.bg} ${palette.border} ${palette.text}`}>
                          Adicionar
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : !canCreateNew ? (
              <div className="p-3 text-center text-xs text-v4-muted">
                Nenhuma outra tag encontrada.
              </div>
            ) : null}

            {/* Quick Helper footer */}
            <div className="px-2 pt-1 border-t border-v4-border/20 text-[10px] text-v4-muted/60 flex items-center justify-between">
              <span>Pressione <kbd className="font-mono bg-v4-surface px-1 py-0.2 rounded">Enter</kbd> para salvar</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="hover:text-v4-text transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
