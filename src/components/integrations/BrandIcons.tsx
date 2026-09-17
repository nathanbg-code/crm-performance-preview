import React from 'react';

interface BrandIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
  switch (size) {
    case 'sm':
      return 'w-6 h-6';
    case 'md':
      return 'w-10 h-10';
    case 'lg':
      return 'w-12 h-12';
    case 'xl':
      return 'w-14 h-14';
  }
};

// Official WhatsApp Cloud API Logo (Rich Emerald Gradient + Speech Handset)
export const WhatsAppBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-md shadow-emerald-950/40 shrink-0 border border-emerald-400/30 ${className}`}
    >
      <svg className="w-60% h-60% text-white fill-current" viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.07c-.24.68-1.41 1.28-1.95 1.34-.51.06-1.17.1-3.37-.81-2.43-1.01-4-3.48-4.12-3.64-.12-.16-.98-1.3-1-2.48-.02-1.18.6-1.76.82-2 .22-.24.48-.3.64-.3.16 0 .32 0 .46.01.15.01.35-.06.55.42.21.49.71 1.74.77 1.87.06.13.1.28.02.44-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.92.81 1.7 1.06 1.94 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.21.08 1.33.63 1.56.74.23.11.38.17.44.27.06.1.06.58-.18 1.26z" />
      </svg>
    </div>
  );
};

// Official Instagram Direct Logo (Vibrant Radial/Conic Gradient + Camera Lens)
export const InstagramBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] flex items-center justify-center shadow-md shadow-pink-950/40 shrink-0 border border-pink-400/30 ${className}`}
    >
      <svg className="w-58% h-58% text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
};

// Official Meta Ads Logo (Infinity Loop Gradient in Meta Royal Blue)
export const MetaAdsBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-gradient-to-br from-[#0081FB] to-[#0052CC] flex items-center justify-center shadow-md shadow-blue-950/40 shrink-0 border border-blue-400/30 ${className}`}
    >
      <svg className="w-65% h-65% text-white fill-current" viewBox="0 0 24 24">
        <path d="M16.96 5.5c-1.89 0-3.52 1.05-4.96 2.76C10.56 6.55 8.93 5.5 7.04 5.5 3.32 5.5 1 8.54 1 12.28c0 3.86 2.5 7.22 6.13 7.22 2.11 0 3.79-1.12 5.09-2.73 1.28 1.62 2.97 2.73 5.08 2.73 3.63 0 6.13-3.36 6.13-7.22 0-3.74-2.32-6.78-6.47-6.78zm-9.87 11.5c-2.19 0-3.83-2.07-3.83-4.72 0-2.58 1.55-4.28 3.78-4.28 1.7 0 3.08 1.26 4.31 3.52-1.29 2.52-2.77 5.48-4.26 5.48zm9.79 0c-1.48 0-2.96-2.96-4.26-5.48 1.23-2.26 2.61-3.52 4.31-3.52 2.23 0 3.78 1.7 3.78 4.28 0 2.65-1.64 4.72-3.83 4.72z" />
      </svg>
    </div>
  );
};

// Official Google Ads Logo (Blue, Yellow, Green 4-Color Shapes)
export const GoogleAdsBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-md shrink-0 p-1.5 ${className}`}
    >
      <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
        {/* Yellow pill */}
        <path
          d="M43.7 20.3L30.9 7.5c-2.4-2.4-6.4-2.4-8.8 0l-1.8 1.8 14.1 14.1 1.8-1.8c2.4-2.4 2.4-6.3-.1-8.7z"
          fill="#FBBC04"
        />
        {/* Blue bar */}
        <path
          d="M13.2 25.2l12.8 12.8c2.4 2.4 6.4 2.4 8.8 0l8.9-8.9-14.1-14.1-16.4 10.2z"
          fill="#4285F4"
        />
        {/* Green dot */}
        <circle cx="10" cy="38" r="6" fill="#34A853" />
      </svg>
    </div>
  );
};

// RD Station Marketing & CRM (Official Cyan-Blue / Orange Chevron)
export const RDStationBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-gradient-to-br from-[#0F3C64] to-[#0A2640] border border-cyan-500/30 flex items-center justify-center shadow-md shrink-0 p-1.5 ${className}`}
    >
      <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
        <path d="M6 16l8-8v6h12v4H14v6L6 16z" fill="#00D7D7" />
        <circle cx="23" cy="9" r="3.5" fill="#FF7B25" />
      </svg>
    </div>
  );
};

// HubSpot CRM (Official Orange Sprocket Logo)
export const HubSpotBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-[#2D3E50] border border-orange-500/40 flex items-center justify-center shadow-md shrink-0 p-2 ${className}`}
    >
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="#FF7A59">
        <path d="M18.8 9.5a2.5 2.5 0 0 0-2.3-1.6 2.5 2.5 0 0 0-1.2.3L13.1 5V3.8a1.8 1.8 0 1 0-2.2 0V5L8.7 8.2a2.5 2.5 0 0 0-1.2-.3 2.5 2.5 0 1 0 2.5 2.5c0-.3 0-.6-.1-.9l2.2-3.2v6.6a2.8 2.8 0 1 0 2.2 0V9.8l2.2 3.2c-.1.3-.1.6-.1.9a2.5 2.5 0 1 0 2.4-4.4z" />
      </svg>
    </div>
  );
};

// ActiveCampaign Logo (Cobalt Blue Wave)
export const ActiveCampaignBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-[#004CFF] border border-blue-400/40 flex items-center justify-center shadow-md shrink-0 p-2 ${className}`}
    >
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="white">
        <path d="M3 13.5l4-8h4l-4 8H3zm7 0l4-8h4l-4 8h-4zm7 0l4-8h4l-4 8h-4z" />
      </svg>
    </div>
  );
};

// Webhooks & n8n / Zapier Logo
export const WebhookZapierBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-gradient-to-br from-[#FF4F00] via-[#FF6600] to-[#EA4B71] border border-orange-400/30 flex items-center justify-center shadow-md shrink-0 p-2 ${className}`}
    >
      <svg className="w-full h-full text-white fill-current" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  );
};

// TikTok Ads Logo (Cyan + Pink note)
export const TikTokAdsBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-black border border-zinc-700 flex items-center justify-center shadow-md shrink-0 p-2 ${className}`}
    >
      <svg className="w-full h-full" viewBox="0 0 24 24">
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.06-2.77V9.38A6.33 6.33 0 1 0 15.82 15V8.55a8.28 8.28 0 0 0 3.77 1.15V6.69z"
          fill="#25F4EE"
        />
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-1v2.44a4.83 4.83 0 0 0 3.77 4.25v2.01z"
          fill="#FE2C55"
        />
      </svg>
    </div>
  );
};

// LinkedIn Ads Logo (Official Blue 'in')
export const LinkedInAdsBrandIcon: React.FC<BrandIconProps> = ({ className = '', size = 'md' }) => {
  return (
    <div
      className={`${getSizeClasses(size)} rounded-xl bg-[#0A66C2] border border-blue-400/30 flex items-center justify-center shadow-md shrink-0 p-2 ${className}`}
    >
      <svg className="w-full h-full text-white fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63z" />
      </svg>
    </div>
  );
};
