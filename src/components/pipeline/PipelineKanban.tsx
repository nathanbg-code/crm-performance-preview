import React, { useState } from 'react';
import { Pipeline, Lead, Seller, ChannelType, LeadTemperature } from '../../types';
import { LeadCard } from './LeadCard';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  Flame,
  MessageSquare,
  Users,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface PipelineKanbanProps {
  pipeline: Pipeline;
  leads: Lead[];
  sellers: Seller[];
  onLeadClick: (lead: Lead) => void;
  onOpenInbox: (leadId: string) => void;
  onMoveLeadStage: (leadId: string, newStageId: string) => void;
  onQuickAddLead: (stageId: string) => void;
  onOpenAIOnboarding: () => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  pipeline,
  leads,
  sellers,
  onLeadClick,
  onOpenInbox,
  onMoveLeadStage,
  onQuickAddLead,
  onOpenAIOnboarding,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [onlySLAAlerts, setOnlySLAAlerts] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [activeDropStageId, setActiveDropStageId] = useState<string | null>(null);

  const sellersMap = new Map<string, Seller>(sellers.map((s) => [s.id, s]));

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchComp = lead.company.toLowerCase().includes(q);
      const matchPhone = lead.phone.toLowerCase().includes(q);
      const matchTag = lead.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchComp && !matchPhone && !matchTag) return false;
    }

    if (selectedChannel !== 'all' && lead.channel !== selectedChannel) {
      return false;
    }

    if (selectedSeller !== 'all' && lead.sellerId !== selectedSeller) {
      return false;
    }

    if (onlySLAAlerts && lead.slaMinutesRemaining > 0) {
      return false;
    }

    return true;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (activeDropStageId !== stageId) {
      setActiveDropStageId(stageId);
    }
  };

  const handleDragLeave = () => {
    setActiveDropStageId(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      onMoveLeadStage(leadId, stageId);
    }
    setDraggedLeadId(null);
    setActiveDropStageId(null);
  };

  // Pipeline total summary
  const totalPipelineValue = filteredLeads.reduce((acc, l) => acc + l.value, 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-v4-bg">
      {/* Top Filter and Controls Bar - Spacious, Clean & Balanced */}
      <div className="px-5 h-12 border-b border-v4-border bg-v4-dark flex items-center justify-between gap-4 shrink-0 select-none">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Search */}
          <div className="relative w-52 sm:w-60 shrink-0">
            <Search className="w-3.5 h-3.5 text-v4-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filtrar por lead, empresa ou tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 bg-v4-surface border border-v4-border rounded-lg pl-8 pr-3 text-xs text-v4-text placeholder-v4-muted focus:border-v4-primary outline-none transition"
            />
          </div>

          {/* Channel Selector */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="h-8 bg-v4-surface border border-v4-border rounded-lg px-3 text-xs text-v4-text hover:border-zinc-700 focus:border-v4-primary outline-none transition cursor-pointer shrink-0"
          >
            <option value="all">Todos os Canais</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram Direct</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="google_ads">Google Ads</option>
          </select>

          {/* Seller Selector */}
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="h-8 bg-v4-surface border border-v4-border rounded-lg px-3 text-xs text-v4-text hover:border-zinc-700 focus:border-v4-primary outline-none transition cursor-pointer shrink-0"
          >
            <option value="all">Todos os Vendedores</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* SLA Alerts Filter Button */}
          <button
            onClick={() => setOnlySLAAlerts(!onlySLAAlerts)}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium border transition cursor-pointer shrink-0 ${
              onlySLAAlerts
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-v4-surface border-v4-border text-v4-muted hover:text-v4-text hover:border-zinc-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Alerta SLA</span>
          </button>
        </div>

        {/* Right side stats summary - Separated with clean vertical divider */}
        <div className="flex items-center gap-3 text-xs shrink-0 pl-4 border-l border-v4-border">
          <div className="flex items-center gap-1.5">
            <span className="text-v4-muted hidden sm:inline">Total:</span>
            <span className="font-semibold font-mono text-v4-text">
              {formatCurrency(totalPipelineValue)}
            </span>
          </div>
          <span className="text-v4-muted font-mono text-[11px] hidden md:inline">
            ({filteredLeads.length} leads ativos)
          </span>
        </div>
      </div>

      {/* Kanban Board Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-5 flex gap-4">
        {pipeline.stages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stageId === stage.id);
          const stageValue = stageLeads.reduce((acc, l) => acc + l.value, 0);
          const isDropTarget = activeDropStageId === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`w-80 shrink-0 flex flex-col rounded-xl bg-v4-dark border transition-all duration-150 ${
                isDropTarget
                  ? 'border-v4-primary bg-v4-surface ring-2 ring-v4-primary/20'
                  : 'border-v4-border hover:border-zinc-700'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-v4-border flex items-center justify-between shrink-0 bg-v4-surface rounded-t-xl">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <h3 className="text-xs font-semibold text-v4-text truncate">
                    {stage.title}
                  </h3>
                  <span className="text-[10px] font-mono text-v4-muted bg-v4-elevated px-1.5 py-0.5 rounded font-medium border border-v4-border">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-v4-muted">
                    {formatCurrency(stageValue)}
                  </span>
                  <button
                    onClick={() => onQuickAddLead(stage.id)}
                    title={`Adicionar lead em ${stage.title}`}
                    className="w-6 h-6 rounded hover:bg-v4-elevated text-v4-muted hover:text-v4-text flex items-center justify-center transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cards Container with Scroll */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                {stageLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    seller={sellersMap.get(lead.sellerId)}
                    onClick={() => onLeadClick(lead)}
                    onOpenInbox={onOpenInbox}
                    onDragStart={handleDragStart}
                  />
                ))}

                {stageLeads.length === 0 && (
                  <div
                    onClick={() => onQuickAddLead(stage.id)}
                    className="h-28 border border-dashed border-v4-border hover:border-zinc-700 rounded-lg flex flex-col items-center justify-center text-center p-3 text-v4-muted hover:text-v4-text transition cursor-pointer group"
                  >
                    <Plus className="w-4 h-4 mb-1 text-v4-muted group-hover:text-v4-text transition" />
                    <span className="text-xs">Nenhum lead nesta etapa</span>
                    <span className="text-[10px] text-v4-muted">Arraste ou clique para criar</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
