import React from 'react';
import { ChannelType } from '../../types';

export interface ChannelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;
  className?: string;
  variant?: 'monochrome' | 'subtle';
}

const resolveSize = (size: 'xs' | 'sm' | 'md' | 'lg' | number = 'sm') => {
  if (typeof size === 'number') {
    return { width: size, height: size };
  }
  switch (size) {
    case 'xs':
      return { width: 12, height: 12 };
    case 'sm':
      return { width: 14, height: 14 };
    case 'md':
      return { width: 16, height: 16 };
    case 'lg':
      return { width: 20, height: 20 };
  }
};

/**
 * WhatsApp Monochrome Glyph
 * Perfectly balanced 24x24 optical weight for V4 UI.
 */
export const WhatsAppIcon: React.FC<ChannelIconProps> = ({
  size = 'sm',
  className = '',
  variant = 'monochrome',
  ...props
}) => {
  const { width, height } = resolveSize(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-colors ${className}`}
      aria-label="WhatsApp"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.01 2.5C6.77 2.5 2.5 6.77 2.5 12.01c0 1.76.49 3.42 1.34 4.87L2.5 21.5l4.8-.13c1.39.77 2.97 1.2 4.71 1.2 5.24 0 9.5-4.27 9.5-9.51S17.25 2.5 12.01 2.5zm0 17.38c-1.53 0-2.95-.42-4.18-1.15l-.3-.18-2.85.08.77-2.73-.2-.31a7.71 7.71 0 01-1.12-4.08c0-4.33 3.52-7.85 7.88-7.85 4.35 0 7.88 3.52 7.88 7.85 0 4.34-3.53 7.87-7.88 7.87zm4.27-5.91c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"
      />
    </svg>
  );
};

/**
 * Instagram Monochrome Glyph
 * Precise camera rounded-rect with aperture and flash pip.
 */
export const InstagramIcon: React.FC<ChannelIconProps> = ({
  size = 'sm',
  className = '',
  variant = 'monochrome',
  ...props
}) => {
  const { width, height } = resolveSize(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-colors ${className}`}
      aria-label="Instagram"
      {...props}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2.5} />
    </svg>
  );
};

/**
 * Meta Ads Monochrome Glyph
 * Continuous infinity geometry, clean silhouette matching V4 design system.
 */
export const MetaAdsIcon: React.FC<ChannelIconProps> = ({
  size = 'sm',
  className = '',
  variant = 'monochrome',
  ...props
}) => {
  const { width, height } = resolveSize(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-colors ${className}`}
      aria-label="Meta Ads"
      {...props}
    >
      <path d="M16.96 5.5c-1.89 0-3.52 1.05-4.96 2.76C10.56 6.55 8.93 5.5 7.04 5.5 3.32 5.5 1 8.54 1 12.28c0 3.86 2.5 7.22 6.13 7.22 2.11 0 3.79-1.12 5.09-2.73 1.28 1.62 2.97 2.73 5.08 2.73 3.63 0 6.13-3.36 6.13-7.22 0-3.74-2.32-6.78-6.47-6.78zm-9.87 11.5c-2.19 0-3.83-2.07-3.83-4.72 0-2.58 1.55-4.28 3.78-4.28 1.7 0 3.08 1.26 4.31 3.52-1.29 2.52-2.77 5.48-4.26 5.48zm9.79 0c-1.48 0-2.96-2.96-4.26-5.48 1.23-2.26 2.61-3.52 4.31-3.52 2.23 0 3.78 1.7 3.78 4.28 0 2.65-1.64 4.72-3.83 4.72z" />
    </svg>
  );
};

/**
 * Google Ads Monochrome Glyph
 * Engineered for clean monochrome visibility: the diagonal dual-pill & target dot
 * rendered with refined negative-space separation lines for instant recognition.
 */
export const GoogleAdsIcon: React.FC<ChannelIconProps> = ({
  size = 'sm',
  className = '',
  variant = 'monochrome',
  ...props
}) => {
  const { width, height } = resolveSize(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-colors ${className}`}
      aria-label="Google Ads"
      {...props}
    >
      {/* Upper diagonal pill */}
      <path
        d="M21.72 9.87l-6.19-6.19a3.86 3.86 0 00-5.46 0l-.82.82 6.83 6.83.82-.82a3.86 3.86 0 015.46 0 3.86 3.86 0 010 5.46l-.82.82 1.37 1.37.82-.82a5.8 5.8 0 000-8.2z"
        opacity="0.95"
      />
      {/* Lower crossing diagonal pill with negative space offset */}
      <path
        d="M6.9 12.25l6.19 6.19a3.86 3.86 0 005.46 0l.82-.82-6.83-6.83-.82.82a3.86 3.86 0 01-5.46 0 3.86 3.86 0 010-5.46l.82-.82-1.37-1.37-.82.82a5.8 5.8 0 000 8.2z"
        opacity="0.75"
      />
      {/* Google Ads target node circle */}
      <circle cx="5.25" cy="18.75" r="2.75" />
    </svg>
  );
};

/**
 * Generic Fallback Icon for Referral / Website
 */
export const GenericChannelIcon: React.FC<ChannelIconProps> = ({
  size = 'sm',
  className = '',
  ...props
}) => {
  const { width, height } = resolveSize(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-colors ${className}`}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

/**
 * Master Unified Omnichannel Channel Icon Component
 * Dispatches to the unified monochrome icon based on ChannelType.
 */
export interface OmnichannelIconProps extends ChannelIconProps {
  channel: ChannelType | string;
}

export const OmnichannelChannelIcon: React.FC<OmnichannelIconProps> = ({
  channel,
  size = 'sm',
  className = '',
  ...rest
}) => {
  switch (channel) {
    case 'whatsapp':
      return <WhatsAppIcon size={size} className={className} {...rest} />;
    case 'instagram':
      return <InstagramIcon size={size} className={className} {...rest} />;
    case 'meta_ads':
      return <MetaAdsIcon size={size} className={className} {...rest} />;
    case 'google_ads':
      return <GoogleAdsIcon size={size} className={className} {...rest} />;
    default:
      return <GenericChannelIcon size={size} className={className} {...rest} />;
  }
};

/**
 * V4 Unified Monochrome Channel Pill / Badge
 * Minimalist, elegant, high-contrast, perfectly sized for dense tables & inboxes.
 */
export interface ChannelPillProps {
  channel: ChannelType;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const ChannelMonochromePill: React.FC<ChannelPillProps> = ({
  channel,
  showLabel = true,
  size = 'sm',
  className = '',
}) => {
  const labels: Record<ChannelType, string> = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    meta_ads: 'Meta Ads',
    google_ads: 'Google Ads',
    referral: 'Indicação',
    website: 'Site / Orgânico',
  };

  const label = labels[channel] || channel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-v4-surface/90 border border-v4-border/40 text-v4-text select-none ${
        size === 'xs'
          ? 'px-1.5 py-0.5 text-[10px]'
          : size === 'sm'
          ? 'px-2 py-0.5 text-[11px]'
          : 'px-2.5 py-1 text-xs'
      } ${className}`}
      title={label}
    >
      <OmnichannelChannelIcon
        channel={channel}
        size={size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm'}
        className="text-v4-muted group-hover:text-v4-text"
      />
      {showLabel && <span className="tracking-tight">{label}</span>}
    </span>
  );
};
