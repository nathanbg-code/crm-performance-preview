import React, { useState } from 'react';
import {
  Lead,
  Pipeline,
  Seller,
  LeadActivity,
} from '../../types';
import { ChannelBadge } from '../common/ChannelBadge';
import { TemperatureBadge } from '../common/TemperatureBadge';
import { SLABadge } from '../common/SLABadge';
import {
  X,
  Phone,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  MessageSquare,
  Plus,
  Send,
  ChevronRight,
  TrendingUp,
  Tag,
  Share2,
  Edit3,
  Bot,
  Zap,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  pipeline: Pipeline;
  sellers: Seller[];
  onClose: () => void;
  onUpdateLeadStage: (leadId: string, stageId: string) => void;
  onOpenInbox: (leadId: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  pipeline,
  sellers,
  onClose,
  onUpdateLeadStage,
  onOpenInbox,
}) => {
  const [activeTimelineFilter, setActiveTimelineFilter] = useState<'all' | 'messages' | 'notes' | 'ai'>('all');
  const [newNoteText, setNewNoteText] = useState('');
  const [activities, setActivities] = useState<LeadActivity[]>([
    {
      id: 'act_1',
      type: 'ai_insight',
      title: 'Atlas IA: Análise de Intenção & Sentimento',
      description:
        'Score de qualificação calculado em 94/100. Lead demonstrou alta probabilidade de fechamento imediato e solicitou parcelamento em 3x da entrada.',
      timestamp: 'Hoje às 15:24',
    },
    {
      id: 'act_2',
      type: 'message',
      title: 'Mensagem WhatsApp Recebida',
      description: 'João, vi a proposta dos R$ 48.500. Conseguimos parcelar a entrada em 3x sem juros?',
      timestamp: 'Hoje às 15:23',
      channel: 'whatsapp',
    },
    {
      id: 'act_3',
      type: 'automation',
      title: 'Automação Executada: Distribuição Round-Robin',
      description: 'Atribuído para João Victor Ribeiro via regra da Campanha Aquecedores & Placas Q3.',
      timestamp: 'Hoje às 10:15',
    },
    {
      id: 'act_4',
      type: 'stage_change',
      title: 'Etapa Alterada',
      description: 'Movido de "Qualificado" para "Proposta Enviada" por João Victor Ribeiro.',
      timestamp: 'Hoje às 14:45',
    },
    {
      id: 'act_5',
      type: 'call',
      title: 'Ligação Realizada (08:42 min)',
      description: 'Alinhamento técnico das especificações do telhado e consumo de energia da fábrica.',
      timestamp: 'Hoje às 11:30',
      authorName: 'João Victor Ribeiro',
    },
  ]);

  if (!lead) return null;

  const currentSeller = sellers.find((s) => s.id === lead.sellerId);
  const currentStageIndex = pipeline.stages.findIndex((s) => s.id === lead.stageId);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const noteActivity: LeadActivity = {
      id: String(Date.now()),
      type: 'note',
      title: 'Nota Interna Comercial',
      description: newNoteText,
      timestamp: 'Agora mesmo',
      authorName: 'Nathan (Você)',
    };

    setActivities([noteActivity, ...activities]);
    setNewNoteText('');
  };

  const filteredActivities = activities.filter((act) => {
    if (activeTimelineFilter === 'messages') return act.type === 'message';
    if (activeTimelineFilter === 'notes') return act.type === 'note';
    if (activeTimelineFilter === 'ai') return act.type === 'ai_insight';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-v4-dark border-l border-v4-border h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header Bar */}
        <div className="p-5 border-b border-v4-border bg-v4-surface flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ChannelBadge channel={lead.channel} size="md" />
              <TemperatureBadge temperature={lead.temperature} />
              <SLABadge minutesRemaining={lead.slaMinutesRemaining} alertText={lead.slaAlert} />
              <span className="text-xs font-mono font-semibold text-v4-text bg-v4-elevated px-2 py-0.5 rounded border border-v4-border">
                {formatCurrency(lead.value)}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-bold text-v4-text truncate">{lead.name}</h2>
              <span className="text-sm text-v4-muted truncate">({lead.company})</span>
            </div>

            {/* Stage Progress Stepper */}
            <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
              {pipeline.stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = stage.id === lead.stageId;
                return (
                  <button
                    key={stage.id}
                    onClick={() => onUpdateLeadStage(lead.id, stage.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? 'bg-v4-primary text-white font-semibold shadow-xs'
                        : isPassed
                        ? 'bg-v4-elevated text-v4-text border border-v4-border hover:bg-zinc-700'
                        : 'bg-v4-surface text-v4-muted border border-v4-border/60 hover:text-v4-text hover:bg-v4-elevated'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{stage.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInbox(lead.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Abrir na Inbox</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-v4-elevated text-v4-muted hover:text-v4-text flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Split Timeline & Context Sidebar */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Middle Column (7 cols): Full Timeline */}
          <div className="md:col-span-7 flex flex-col h-full border-r border-v4-border bg-v4-bg">
            {/* Timeline Filter Tabs */}
            <div className="px-4 py-2.5 border-b border-v4-border bg-v4-dark flex items-center justify-between">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'all', label: 'Tudo' },
                    { id: 'messages', label: 'Mensagens' },
                    { id: 'notes', label: 'Notas' },
                    { id: 'ai', label: 'IA Insights' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTimelineFilter(tab.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                      activeTimelineFilter === tab.id
                        ? 'bg-v4-elevated text-v4-text font-semibold border border-v4-border shadow-xs'
                        : 'text-v4-muted hover:text-v4-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-v4-muted font-mono">{activities.length} eventos</span>
            </div>

            {/* Add internal note form */}
            <form
              onSubmit={handleAddNote}
              className="p-3 border-b border-v4-border bg-v4-surface/60 flex items-center gap-2"
            >
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Adicionar nota comercial rápida para a equipe..."
                className="flex-1 bg-v4-surface border border-v4-border rounded-lg px-3 py-1.5 text-xs text-v4-text placeholder-v4-muted focus:border-v4-primary outline-none transition"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-3 py-1.5 rounded-lg bg-v4-elevated hover:bg-zinc-700 border border-v4-border disabled:opacity-50 text-v4-text text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </form>

            {/* Events Timeline List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 relative group">
                  {/* Icon Indicator */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                      act.type === 'ai_insight'
                        ? 'bg-v4-elevated text-v4-text border-v4-border'
                        : act.type === 'message'
                        ? 'bg-emerald-500/10 text-v4-success border-emerald-500/20'
                        : act.type === 'automation'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : act.type === 'call'
                        ? 'bg-amber-500/10 text-v4-warning border-amber-500/20'
                        : 'bg-v4-surface text-v4-muted border-v4-border'
                    }`}
                  >
                    {act.type === 'ai_insight' && <Sparkles className="w-3.5 h-3.5" />}
                    {act.type === 'message' && <MessageSquare className="w-3.5 h-3.5" />}
                    {act.type === 'automation' && <Zap className="w-3.5 h-3.5" />}
                    {act.type === 'call' && <Phone className="w-3.5 h-3.5" />}
                    {act.type === 'stage_change' && <TrendingUp className="w-3.5 h-3.5" />}
                    {act.type === 'note' && <Edit3 className="w-3.5 h-3.5" />}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-v4-surface border border-v4-border rounded-lg p-3 space-y-1 group-hover:border-zinc-600 transition">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-v4-text">{act.title}</h4>
                      <span className="text-[10px] text-v4-muted font-mono">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-v4-muted leading-relaxed">{act.description}</p>
                    {act.authorName && (
                      <span className="text-[10px] text-v4-muted block pt-1">
                        Por: {act.authorName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar (5 cols): Operational Contact Information */}
          <div className="md:col-span-5 overflow-y-auto p-4 space-y-3.5 bg-v4-dark">
            {/* AI Realtime Intelligence Box */}
            <div className="p-3.5 rounded-lg bg-v4-surface border border-v4-border space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-v4-text">
                  <Sparkles className="w-3.5 h-3.5 text-v4-muted" />
                  <span>Inteligência Comercial</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-v4-text bg-v4-elevated px-1.5 py-0.5 rounded border border-v4-border">
                  Score: {lead.score}/100
                </span>
              </div>

              <div className="text-xs text-v4-text leading-relaxed bg-v4-elevated/70 p-2.5 rounded border border-v4-border">
                {lead.aiSummary}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-v4-elevated/50 p-2 rounded border border-v4-border">
                  <span className="text-v4-muted block text-[10px]">Sentimento:</span>
                  <span className="font-semibold text-v4-text">{lead.sentiment}</span>
                </div>
                <div className="bg-v4-elevated/50 p-2 rounded border border-v4-border">
                  <span className="text-v4-muted block text-[10px]">Intenção de Compra:</span>
                  <span className="font-semibold text-v4-text">{lead.buyingIntent}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[10px] uppercase font-semibold text-v4-muted tracking-wider block mb-1">
                  Próximo Passo Sugerido:
                </span>
                <p className="text-xs text-v4-text bg-v4-elevated p-2.5 rounded border-l-2 border-v4-primary font-medium">
                  {lead.suggestedNextStep}
                </p>
              </div>
            </div>

            {/* Contact & Company Details */}
            <div className="p-3 rounded-lg bg-v4-surface border border-v4-border space-y-2.5">
              <h4 className="text-xs font-semibold text-v4-text">Dados do Contato</h4>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-v4-muted">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-v4-muted" />
                    Telefone:
                  </span>
                  <a
                    href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-v4-text hover:underline font-mono"
                  >
                    {lead.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between text-v4-muted">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-v4-muted" />
                    E-mail:
                  </span>
                  <span className="text-v4-text truncate max-w-[180px]">{lead.email}</span>
                </div>

                <div className="flex items-center justify-between text-v4-muted">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-v4-muted" />
                    Empresa:
                  </span>
                  <span className="text-v4-text font-medium">{lead.company}</span>
                </div>

                <div className="flex items-center justify-between text-v4-muted pt-1 border-t border-v4-border">
                  <span>Vendedor Responsável:</span>
                  <span className="text-v4-text font-medium">
                    {currentSeller?.name || 'Não atribuído'}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Collected Fields */}
            {lead.customFields && lead.customFields.length > 0 && (
              <div className="p-3 rounded-lg bg-v4-surface border border-v4-border space-y-2">
                <h4 className="text-xs font-semibold text-v4-text">Campos Coletados</h4>
                <div className="space-y-1.5 text-xs">
                  {lead.customFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between text-v4-muted">
                      <span>{field.label}:</span>
                      <span className="text-v4-text font-medium">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign & UTMs */}
            {lead.utms && (
              <div className="p-3 rounded-lg bg-v4-surface border border-v4-border space-y-1.5 text-xs text-v4-muted">
                <h4 className="font-semibold text-v4-text">Rastreamento de Tráfego</h4>
                <div className="text-[11px] font-mono space-y-1 text-v4-muted bg-v4-elevated p-2 rounded border border-v4-border">
                  {lead.utms.source && <div>utm_source: {lead.utms.source}</div>}
                  {lead.utms.campaign && <div>utm_campaign: {lead.utms.campaign}</div>}
                  {lead.utms.medium && <div>utm_medium: {lead.utms.medium}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
