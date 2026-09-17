import React from 'react';
import { ChannelType } from '../../types';
import { OmnichannelChannelIcon } from '../inbox/ChannelMonochromeIcons';

interface ChannelBadgeProps {
  channel: ChannelType;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'monochrome' | 'colored';
  className?: string;
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({
  channel,
  showLabel = true,
  size = 'sm',
  variant = 'monochrome',
  className = '',
}) => {
  const configs: Record<
    ChannelType,
    { label: string; bg: string; text: string; border: string }
  > = {
    whatsapp: {
      label: 'WhatsApp',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
    instagram: {
      label: 'Instagram',
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      border: 'border-pink-500/20',
    },
    meta_ads: {
      label: 'Meta Ads',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    google_ads: {
      label: 'Google Ads',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    referral: {
      label: 'Indicação',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    website: {
      label: 'Site / Orgânico',
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-400',
      border: 'border-zinc-500/20',
    },
  };

  const current = configs[channel] || configs.whatsapp;
  const iconSize = size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm';

  const styleClasses =
    variant === 'monochrome'
      ? 'bg-v4-surface/90 text-v4-text border-v4-border/40 hover:border-v4-border/70 hover:bg-v4-elevated'
      : `${current.bg} ${current.text} ${current.border}`;

  const sizeClasses =
    size === 'xs'
      ? 'text-[10px] px-1.5 py-0.5 gap-1'
      : size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1.5'
      : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md transition-colors select-none ${sizeClasses} ${styleClasses} ${className}`}
      title={current.label}
    >
      <OmnichannelChannelIcon
        channel={channel}
        size={iconSize}
        className={variant === 'monochrome' ? 'text-v4-muted group-hover:text-v4-text' : 'currentColor'}
      />
      {showLabel && <span className="tracking-tight">{current.label}</span>}
    </span>
  );
};

