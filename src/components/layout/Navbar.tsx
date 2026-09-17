import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Command,
  ChevronDown,
  Sliders,
  FolderKanban,
  Check,
} from 'lucide-react';
import { Pipeline } from '../../types';

interface NavbarProps {
  currentPipeline: Pipeline;
  pipelines?: Pipeline[];
  onSelectPipeline?: (pipelineId: string) => void;
  onOpenFunnelBuilder?: () => void;
  onOpenAIOnboarding: () => void;
  onOpenQuickCreate: () => void;
  onOpenCommandPalette: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPipeline,
  pipelines = [currentPipeline],
  onSelectPipeline,
  onOpenFunnelBuilder,
  onOpenAIOnboarding,
  onOpenQuickCreate,
  onOpenCommandPalette,
  unreadCount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-12 border-b border-v4-border bg-v4-dark px-4 flex items-center justify-between z-30 shrink-0 select-none gap-4">
      {/* Left: Clean Brand & Workspace Identity + Pipeline Switcher */}
      <div className="flex items-center gap-2.5 shrink-0" ref={dropdownRef}>
        <div className="w-6 h-6 rounded bg-v4-surface border border-v4-border flex items-center justify-center text-v4-primary font-bold text-xs">
          <span className="tracking-tighter">V4</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 leading-none px-2 py-1 rounded-md hover:bg-v4-surface transition cursor-pointer text-left group"
          >
            <span className="font-semibold text-v4-text text-xs tracking-tight">AutoCRM</span>
            <span className="text-v4-muted text-xs">•</span>
            <span className="text-xs text-v4-muted group-hover:text-v4-text truncate max-w-[190px] font-medium transition">
              {currentPipeline.name}
            </span>
            <ChevronDown className="w-3 h-3 text-v4-muted group-hover:text-v4-text transition" />
          </button>

          {/* Pipeline Switcher Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-v4-dark border border-v4-border/50 rounded-xl shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1 text-[10px] font-mono text-v4-muted uppercase tracking-wider">
                Alternar Funil Comercial
              </div>

              {pipelines.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (onSelectPipeline) onSelectPipeline(p.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer text-left ${
                    p.id === currentPipeline.id
                      ? 'bg-v4-surface text-v4-text font-semibold'
                      : 'text-v4-muted hover:text-v4-text hover:bg-v4-surface/60'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="block truncate">{p.name}</span>
                    <span className="text-[10px] text-v4-muted block font-mono">
                      {p.stages.length} etapas
                    </span>
                  </div>
                  {p.id === currentPipeline.id && (
                    <Check className="w-3.5 h-3.5 text-v4-primary shrink-0" />
                  )}
                </button>
              ))}

              {onOpenFunnelBuilder && (
                <div className="pt-1 border-t border-v4-border/30 mt-1">
                  <button
                    onClick={() => {
                      onOpenFunnelBuilder();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg text-xs font-medium text-v4-primary hover:bg-v4-primary/10 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Gerenciar Funis & Automações</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Command Search Bar (Fast, Discreet ⌘K) */}
      <div className="flex-1 max-w-sm hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-8 flex items-center justify-between px-3 rounded-md bg-v4-surface border border-v4-border hover:border-zinc-600 text-v4-muted text-xs transition group cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-v4-muted group-hover:text-v4-text shrink-0" />
            <span className="text-v4-muted group-hover:text-v4-text truncate text-xs">
              Buscar leads, contatos ou comandos...
            </span>
          </div>
          <kbd className="shrink-0 text-[10px] bg-v4-elevated text-v4-muted px-1.5 py-0.5 rounded border border-v4-border font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Only essential actions (Primary button + Notifications + Profile) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Primary Action: Novo Lead */}
        <button
          onClick={onOpenQuickCreate}
          className="h-8 flex items-center gap-1.5 px-3 rounded-md bg-v4-primary hover:bg-v4-primary-hover text-white font-medium text-xs transition cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>Novo Lead</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenCommandPalette}
          title={unreadCount > 0 ? `${unreadCount} notificações pendentes` : 'Notificações'}
          className="w-8 h-8 rounded-md bg-v4-surface hover:bg-v4-elevated border border-v4-border flex items-center justify-center text-v4-muted hover:text-v4-text transition cursor-pointer relative"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-v4-primary text-white text-[9px] font-bold flex items-center justify-center border-2 border-v4-dark">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center pl-1 border-l border-v4-border">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Nathan - Gestor Comercial"
            title="Nathan - Gestor Comercial"
            className="w-7 h-7 rounded-full border border-v4-border object-cover cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};
