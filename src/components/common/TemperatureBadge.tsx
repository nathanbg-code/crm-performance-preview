import React from 'react';
import { LeadTemperature } from '../../types';
import { Flame, Zap, Snowflake } from 'lucide-react';

interface TemperatureBadgeProps {
  temperature: LeadTemperature;
  showIconOnly?: boolean;
}

export const TemperatureBadge: React.FC<TemperatureBadgeProps> = ({
  temperature,
  showIconOnly = false,
}) => {
  switch (temperature) {
    case 'hot':
      return (
        <span
          title="Lead Quente - Alta probabilidade de compra"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border bg-v4-danger/10 text-v4-danger border-v4-danger/20"
        >
          <Flame className="w-3 h-3 text-v4-danger" />
          {!showIconOnly && <span>Quente</span>}
        </span>
      );
    case 'warm':
      return (
        <span
          title="Lead Morno - Em avaliação"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border bg-v4-warning/10 text-v4-warning border-v4-warning/20"
        >
          <Zap className="w-3 h-3 text-v4-warning" />
          {!showIconOnly && <span>Morno</span>}
        </span>
      );
    case 'cold':
    default:
      return (
        <span
          title="Lead Frio - Contato inicial ou sem resposta"
          className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border bg-v4-elevated text-v4-muted border-v4-border"
        >
          <Snowflake className="w-3 h-3 text-v4-muted" />
          {!showIconOnly && <span>Frio</span>}
        </span>
      );
  }
};
