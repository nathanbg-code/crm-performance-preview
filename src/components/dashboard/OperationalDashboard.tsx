import React from 'react';
import {
  Clock,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Users,
  Flame,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Lead, Seller, Pipeline } from '../../types';

interface OperationalDashboardProps {
  leads: Lead[];
  sellers: Seller[];
  pipeline: Pipeline;
  onOpenInbox: (leadId: string) => void;
  onSelectLead: (lead: Lead) => void;
}

export const OperationalDashboard: React.FC<OperationalDashboardProps> = ({
  leads,
  sellers,
  pipeline,
  onOpenInbox,
  onSelectLead,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalPipelineValue = leads.reduce((acc, l) => acc + l.value, 0);
  const breachedLeads = leads.filter((l) => l.slaMinutesRemaining <= 0);
  const hotLeads = leads.filter((l) => l.temperature === 'hot');

  // Funnel bottleneck analysis (count leads per stage)
  const stageStats = pipeline.stages.map((stage) => {
    const stageLeads = leads.filter((l) => l.stageId === stage.id);
    const value = stageLeads.reduce((acc, l) => acc + l.value, 0);
    return {
      id: stage.id,
      title: stage.title,
      color: stage.color,
      count: stageLeads.length,
      value,
    };
  });

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-v4-bg">
      {/* Top Banner: Realtime SLA & Alert Warning */}
      {breachedLeads.length > 0 && (
        <div className="p-3.5 rounded-lg bg-v4-danger/10 border border-v4-danger/25 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-md bg-v4-danger/20 text-v4-danger flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-v4-text">
                Atenção: {breachedLeads.length} leads aguardando resposta com SLA estourado
              </div>
              <p className="text-[11px] text-v4-muted truncate">
                Leads atendidos nos primeiros minutos têm conversão até 4x maior.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenInbox(breachedLeads[0].id)}
            className="px-3 py-1.5 rounded-md bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium shrink-0 transition cursor-pointer"
          >
            Ver Leads Estourados
          </button>
        </div>
      )}

      {/* Row 1: High-Density Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Tempo Médio de Primeiro Contato */}
        <div className="p-4 rounded-lg bg-v4-surface border border-v4-border space-y-2">
          <div className="flex items-center justify-between text-v4-muted text-xs">
            <span>Tempo 1º Contato (SLA)</span>
            <div className="w-6 h-6 rounded bg-v4-elevated text-v4-muted flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-v4-text">2 min 40s</span>
            <span className="text-[11px] text-v4-success flex items-center">
              <ArrowDownRight className="w-3 h-3" /> -45s vs ontem
            </span>
          </div>
          <p className="text-[11px] text-v4-muted">Meta operacional: ≤ 5 min</p>
        </div>

        {/* Metric 2: Taxa de Resposta dos Leads */}
        <div className="p-4 rounded-lg bg-v4-surface border border-v4-border space-y-2">
          <div className="flex items-center justify-between text-v4-muted text-xs">
            <span>Taxa de Resposta WhatsApp</span>
            <div className="w-6 h-6 rounded bg-v4-elevated text-v4-muted flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-v4-text">82.4%</span>
            <span className="text-[11px] text-v4-success flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +6.2%
            </span>
          </div>
          <p className="text-[11px] text-v4-muted">142 de 172 leads responderam</p>
        </div>

        {/* Metric 3: Pipeline Ativo Total */}
        <div className="p-4 rounded-lg bg-v4-surface border border-v4-border space-y-2">
          <div className="flex items-center justify-between text-v4-muted text-xs">
            <span>Pipeline Comercial Ativo</span>
            <div className="w-6 h-6 rounded bg-v4-elevated text-v4-muted flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-v4-text">
              {formatCurrency(totalPipelineValue)}
            </span>
          </div>
          <p className="text-[11px] text-v4-muted">{leads.length} oportunidades em andamento</p>
        </div>

        {/* Metric 4: Oportunidades Quentes */}
        <div className="p-4 rounded-lg bg-v4-surface border border-v4-border space-y-2">
          <div className="flex items-center justify-between text-v4-muted text-xs">
            <span>Leads Quentes</span>
            <div className="w-6 h-6 rounded bg-v4-elevated text-v4-muted flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-v4-primary" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-v4-primary">{hotLeads.length}</span>
            <span className="text-[11px] text-v4-muted">Alta propensão</span>
          </div>
          <p className="text-[11px] text-v4-muted">Fechamento previsto em 7 dias</p>
        </div>
      </div>

      {/* Row 2: Funnel Analysis */}
      <div className="p-5 rounded-lg bg-v4-surface border border-v4-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-v4-text">
              Distribuição do Pipeline por Etapa
            </h3>
            <p className="text-xs text-v4-muted">
              Visão consolidada de volume e valor em cada fase comercial
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-v4-muted font-medium">
            <span className="w-2 h-2 rounded-full bg-v4-success" />
            <span>Fluxo Ativo</span>
          </div>
        </div>

        {/* Horizontal Visual Stages Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stageStats.map((st, i) => (
            <div
              key={st.id}
              className="p-3 rounded-md bg-v4-elevated border border-v4-border space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-v4-muted font-semibold">0{i + 1}</span>
                <span className="text-xs font-mono font-medium text-v4-text">{st.count} leads</span>
              </div>
              <h4 className="text-xs font-medium text-v4-text truncate">{st.title}</h4>
              <div className="text-[11px] font-mono text-v4-text font-semibold">
                {formatCurrency(st.value)}
              </div>
              <div className="w-full h-1.5 rounded-full bg-v4-border overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: st.color,
                    width: `${Math.min(100, (st.count / (leads.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Split Grid (Sellers Performance + Channel Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sellers Performance (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-v4-surface border border-v4-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-v4-text">
              Desempenho da Equipe Comercial
            </h3>
            <span className="text-xs text-v4-muted">Tempo real</span>
          </div>

          <div className="space-y-2.5">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="p-3 rounded-md bg-v4-elevated border border-v4-border flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-8 h-8 rounded-full object-cover border border-v4-border"
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-v4-dark ${
                        seller.online ? 'bg-v4-success' : 'bg-v4-muted'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-v4-text truncate">{seller.name}</h4>
                    <p className="text-[11px] text-v4-muted">
                      {seller.role} • {seller.activeDealsCount ?? seller.activeLeadsCount} negócios
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className="text-[10px] text-v4-muted block">Resposta Média</span>
                    <span className="text-xs font-mono font-medium text-v4-text">
                      {seller.avgResponseTime || `${seller.avgResponseTimeMin} min`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-v4-muted block">Conversão</span>
                    <span className="text-xs font-mono font-semibold text-v4-text">
                      {seller.conversionRate}%
                    </span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-v4-muted block">Total Vendido</span>
                    <span className="text-xs font-mono font-bold text-v4-text">
                      {formatCurrency(seller.totalWonValue ?? 85000)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volume por Canal de Entrada (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-v4-surface border border-v4-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-v4-text">Origem dos Leads</h3>
            <span className="text-xs text-v4-muted">Últimos 30 dias</span>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'WhatsApp Cloud API',
                count: 142,
                percentage: 54,
                color: 'bg-emerald-500',
                convRate: '28.4%',
              },
              {
                name: 'Meta Ads (Instagram & FB)',
                count: 78,
                percentage: 30,
                color: 'bg-blue-500',
                convRate: '19.2%',
              },
              {
                name: 'Instagram Direct',
                count: 28,
                percentage: 11,
                color: 'bg-pink-500',
                convRate: '22.0%',
              },
              {
                name: 'Google Ads & Orgânico',
                count: 14,
                percentage: 5,
                color: 'bg-amber-500',
                convRate: '31.5%',
              },
            ].map((ch, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-v4-text font-medium">{ch.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-v4-muted">{ch.count} leads</span>
                    <span className="font-mono text-v4-text font-medium">{ch.convRate} conv.</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-v4-border overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ch.color}`}
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-v4-border text-xs text-v4-muted flex items-center justify-between">
            <span>Conversão Média Geral:</span>
            <span className="font-semibold font-mono text-v4-text">24.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
