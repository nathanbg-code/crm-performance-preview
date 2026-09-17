import React from 'react';
import { Lead, Seller } from '../../types';
import { ChannelBadge } from '../common/ChannelBadge';
import { TemperatureBadge } from '../common/TemperatureBadge';
import { SLABadge } from '../common/SLABadge';
import {
  Clock,
  Calendar,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  seller?: Seller;
  onClick: () => void;
  onOpenInbox?: (leadId: string) => void;
  onDragStart?: (e: React.DragEvent, leadId: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  seller,
  onClick,
  onOpenInbox,
  onDragStart,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, lead.id)}
      onClick={onClick}
      className="group bg-v4-surface hover:bg-v4-elevated border border-v4-border hover:border-zinc-600 rounded-lg p-3 transition shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing space-y-2.5 relative select-none"
    >
      {/* SLA Breach Alert Banner on card top if breached */}
      {lead.slaMinutesRemaining <= 0 && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-v4-danger bg-v4-danger/10 px-2 py-0.5 rounded border border-v4-danger/20">
          <AlertTriangle className="w-3 h-3 text-v4-danger shrink-0" />
          <span className="truncate">
            Sem resposta há {Math.abs(lead.slaMinutesRemaining)}m - Alerta SLA
          </span>
        </div>
      )}

      {/* Row 1: Badges (Channel, Temperature, SLA) */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <ChannelBadge channel={lead.channel} size="sm" />
          <TemperatureBadge temperature={lead.temperature} />
        </div>
        <SLABadge minutesRemaining={lead.slaMinutesRemaining} alertText={lead.slaAlert} />
      </div>

      {/* Row 2: Lead Name, Company & Value */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-semibold text-v4-text group-hover:text-white transition truncate">
            {lead.name}
          </h4>
          <span className="text-xs font-semibold font-mono text-v4-text whitespace-nowrap">
            {formatCurrency(lead.value)}
          </span>
        </div>
        <p className="text-[11px] text-v4-muted truncate">{lead.company}</p>
      </div>

      {/* Row 3: Next Activity or Last Interaction */}
      {lead.nextActivity ? (
        <div className="flex items-center gap-1.5 text-[11px] text-v4-text bg-v4-elevated border border-v4-border px-2 py-1 rounded">
          <Calendar className="w-3 h-3 text-v4-warning shrink-0" />
          <span className="truncate flex-1">{lead.nextActivity.title}</span>
          <span className="text-[10px] text-v4-muted whitespace-nowrap">
            {lead.nextActivity.dueDate}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px] text-v4-muted">
          <Clock className="w-3 h-3 text-v4-muted shrink-0" />
          <span className="truncate">Último contato: {lead.lastInteraction}</span>
        </div>
      )}

      {/* Row 4: Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {lead.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-v4-elevated text-v4-muted px-1.5 py-0.2 rounded border border-v4-border"
            >
              #{tag}
            </span>
          ))}
          {lead.tags.length > 3 && (
            <span className="text-[10px] text-v4-muted">+{lead.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Row 5: Seller Footer & Quick Inbox Action */}
      <div className="pt-2 border-t border-v4-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          {seller ? (
            <>
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-4 h-4 rounded-full object-cover border border-v4-border shrink-0"
              />
              <span className="text-[11px] text-v4-muted truncate">{seller.name}</span>
            </>
          ) : (
            <span className="text-[11px] text-v4-muted">Sem responsável</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onOpenInbox && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenInbox(lead.id);
              }}
              title="Abrir conversa na Inbox"
              className="p-1 rounded hover:bg-v4-elevated text-v4-muted hover:text-v4-text transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-v4-muted group-hover:text-v4-text transition">
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
