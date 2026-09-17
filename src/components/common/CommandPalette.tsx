import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Kanban,
  MessageSquare,
  GitFork,
  Bot,
  BarChart3,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';
import { Lead } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAIOnboarding: () => void;
  onOpenQuickCreate: () => void;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAIOnboarding,
  onOpenQuickCreate,
  leads,
  onSelectLead,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'ai-setup',
      title: 'Configurar CRM com IA (Auto-Setup)',
      subtitle: 'Explique seu modelo de negócio e gere pipelines e regras',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onOpenAIOnboarding();
        onClose();
      },
    },
    {
      id: 'new-lead',
      title: 'Criar Novo Lead / Oportunidade',
      subtitle: 'Cadastro manual rápido',
      icon: <Plus className="w-4 h-4 text-zinc-300" />,
      action: () => {
        onOpenQuickCreate();
        onClose();
      },
    },
    {
      id: 'goto-inbox',
      title: 'Ir para Inbox Omnichannel',
      subtitle: 'Atendimento WhatsApp e Instagram',
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onNavigate('inbox');
        onClose();
      },
    },
    {
      id: 'goto-crm',
      title: 'Ir para CRM / Pipeline Kanban',
      subtitle: 'Visualizar funil comercial e negociações',
      icon: <Kanban className="w-4 h-4 text-blue-400" />,
      action: () => {
        onNavigate('crm');
        onClose();
      },
    },
    {
      id: 'goto-automations',
      title: 'Ir para Automações',
      subtitle: 'Construtor visual de fluxos e gatilhos',
      icon: <GitFork className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigate('automations');
        onClose();
      },
    },
  ];

  const filteredLeads = query
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.company.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-zinc-950/80 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-100">
        {/* Search Input */}
        <div className="p-3 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/60">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite uma ação, nome de lead ou tela..."
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <button
            onClick={onClose}
            className="w-6 h-6 rounded hover:bg-zinc-800 text-zinc-500 flex items-center justify-center text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {/* Quick Actions */}
          <div className="px-2 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Ações Rápidas
          </div>

          {quickActions.map((act) => (
            <button
              key={act.id}
              onClick={act.action}
              className="w-full text-left p-2 rounded-lg hover:bg-zinc-900 flex items-center justify-between group transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center shrink-0">
                  {act.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 transition truncate">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">{act.subtitle}</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
            </button>
          ))}

          {/* Search Result Leads */}
          {filteredLeads.length > 0 && (
            <>
              <div className="px-2 pt-2 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Leads Encontrados ({filteredLeads.length})
              </div>
              {filteredLeads.slice(0, 5).map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => {
                    onSelectLead(lead);
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-900 flex items-center justify-between group transition cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-zinc-500">{lead.company}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(lead.value)}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-3 py-2 border-t border-zinc-800/80 bg-zinc-900/40 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Pressione ESC para fechar</span>
          <span className="font-mono">AutoCRM v2.4</span>
        </div>
      </div>
    </div>
  );
};
