import React from 'react';
import {
  Search,
  Plus,
  Bell,
  Command,
} from 'lucide-react';
import { Pipeline } from '../../types';

interface NavbarProps {
  currentPipeline: Pipeline;
  onOpenAIOnboarding: () => void;
  onOpenQuickCreate: () => void;
  onOpenCommandPalette: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPipeline,
  onOpenAIOnboarding,
  onOpenQuickCreate,
  onOpenCommandPalette,
  unreadCount,
}) => {
  return (
    <header className="h-12 border-b border-v4-border bg-v4-dark px-4 flex items-center justify-between z-30 shrink-0 select-none gap-4">
      {/* Left: Clean Brand & Workspace Identity */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-6 h-6 rounded bg-v4-surface border border-v4-border flex items-center justify-center text-v4-primary font-bold text-xs">
          <span className="tracking-tighter">V4</span>
        </div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-semibold text-v4-text text-xs tracking-tight">AutoCRM</span>
          <span className="text-v4-muted text-xs">•</span>
          <span className="text-xs text-v4-muted truncate max-w-[180px]">
            {currentPipeline.name}
          </span>
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
        {/* Primary Action: Novo Lead (Clear, uncluttered focus in V4 Red) */}
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

