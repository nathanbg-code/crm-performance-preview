import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SLABadgeProps {
  minutesRemaining: number;
  alertText?: string;
  compact?: boolean;
}

export const SLABadge: React.FC<SLABadgeProps> = ({
  minutesRemaining,
  alertText,
  compact = false,
}) => {
  const isBreached = minutesRemaining <= 0;
  const isWarning = minutesRemaining > 0 && minutesRemaining <= 15;

  if (isBreached) {
    return (
      <span
        title={alertText || `SLA Estourado em ${Math.abs(minutesRemaining)} minutos`}
        className="inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded border bg-v4-danger/15 text-v4-danger border-v4-danger/30"
      >
        <AlertTriangle className="w-3 h-3 text-v4-danger" />
        {!compact && (
          <span>
            {minutesRemaining === 0
              ? 'SLA Vencendo'
              : `SLA -${Math.abs(minutesRemaining)}m`}
          </span>
        )}
      </span>
    );
  }

  if (isWarning) {
    return (
      <span
        title={`Restam apenas ${minutesRemaining} minutos para o primeiro contato`}
        className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border bg-v4-warning/10 text-v4-warning border-v4-warning/20"
      >
        <Clock className="w-3 h-3 text-v4-warning" />
        {!compact && <span>SLA {minutesRemaining}m</span>}
      </span>
    );
  }

  return (
    <span
      title="SLA dentro do prazo acordado"
      className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border bg-v4-success/10 text-v4-success border-v4-success/20"
    >
      <CheckCircle2 className="w-3 h-3 text-v4-success" />
      {!compact && <span>SLA {minutesRemaining}m</span>}
    </span>
  );
};
