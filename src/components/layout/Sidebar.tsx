import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Users,
  GitFork,
  Bot,
  BarChart3,
  Puzzle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'inbox'
  | 'crm'
  | 'contacts'
  | 'automations'
  | 'ai_agents'
  | 'ai_connections'
  | 'reports'
  | 'integrations'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadInboxCount: number;
  slaAlertCount: number;
  onOpenAIOnboarding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  unreadInboxCount,
  slaAlertCount,
  onOpenAIOnboarding,
}) => {
  const menuItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard BI',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'inbox',
      label: 'Inbox Omnichannel',
      icon: <MessageSquare className="w-4 h-4 shrink-0" />,
      badge: unreadInboxCount > 0 ? unreadInboxCount : undefined,
      badgeColor: 'bg-v4-primary text-white font-bold',
    },
    {
      id: 'crm',
      label: 'CRM / Pipeline',
      icon: <Kanban className="w-4 h-4 shrink-0" />,
      badge: slaAlertCount > 0 ? slaAlertCount : undefined,
      badgeColor: 'bg-v4-warning/20 text-v4-warning border border-v4-warning/30 font-bold',
    },
    {
      id: 'contacts',
      label: 'Contatos & Leads',
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'automations',
      label: 'Automações',
      icon: <GitFork className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'ai_agents',
      label: 'Agentes de IA',
      icon: <Bot className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'ai_connections',
      label: 'Conexões de IA & APIs',
      icon: <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'integrations',
      label: 'Integrações',
      icon: <Puzzle className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`border-r border-v4-border bg-v4-dark flex flex-col justify-between transition-all duration-200 shrink-0 z-20 select-none ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Top Navigation Items */}
      <div className="p-2 space-y-1">
        {/* Clean Workspace Indicator */}
        {!collapsed ? (
          <div className="px-2.5 py-2 mb-1 flex items-center justify-between text-xs text-v4-muted font-medium border-b border-v4-border/60">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-v4-muted">
              Operação Comercial
            </span>
            <span className="text-[10px] font-mono text-v4-muted bg-v4-surface px-1.5 py-0.5 rounded border border-v4-border">
              V4 Engine
            </span>
          </div>
        ) : (
          <div className="h-2" />
        )}

        {/* Menu Items */}
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition cursor-pointer relative ${
                  isActive
                    ? 'bg-v4-surface text-v4-text font-semibold border-l-2 border-v4-primary'
                    : 'text-v4-muted hover:text-v4-text hover:bg-v4-surface/60'
                }`}
              >
                <div className={`${isActive ? 'text-v4-text' : 'text-v4-muted'}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-v4-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Collapse Toggle & System Status */}
      <div className="p-2 border-t border-v4-border space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 rounded-md bg-v4-surface/60 border border-v4-border/60 text-[11px] text-v4-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-v4-success" />
              Agentes Operacionais
            </span>
            <span className="text-[10px] font-mono text-v4-muted">3 Ativos</span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-md hover:bg-v4-surface text-v4-muted hover:text-v4-text transition cursor-pointer text-xs"
          title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 w-full px-1">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Recolher Menu</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
