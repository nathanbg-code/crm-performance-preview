import React from 'react';
import { ChannelType } from '../../types';
import { MessageSquare, Instagram, Globe, Users, Megaphone } from 'lucide-react';

interface ChannelBadgeProps {
  channel: ChannelType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({
  channel,
  showLabel = true,
  size = 'sm',
}) => {
  const configs: Record<
    ChannelType,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    whatsapp: {
      label: 'WhatsApp',
      icon: <MessageSquare className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
    instagram: {
      label: 'Instagram',
      icon: <Instagram className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      border: 'border-pink-500/20',
    },
    meta_ads: {
      label: 'Meta Ads',
      icon: <Megaphone className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    google_ads: {
      label: 'Google Ads',
      icon: <Globe className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    referral: {
      label: 'Indicação',
      icon: <Users className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    website: {
      label: 'Site / Orgânico',
      icon: <Globe className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-400',
      border: 'border-zinc-500/20',
    },
  };

  const current = configs[channel] || configs.whatsapp;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded px-1.5 py-0.5 ${
        size === 'sm' ? 'text-[11px]' : 'text-xs'
      } ${current.bg} ${current.text} ${current.border}`}
    >
      {current.icon}
      {showLabel && <span>{current.label}</span>}
    </span>
  );
};
