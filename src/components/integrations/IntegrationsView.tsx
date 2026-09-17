import React, { useState } from 'react';
import {
  MessageSquare,
  Instagram,
  Megaphone,
  Globe,
  Webhook,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Power,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'wpp',
      name: 'WhatsApp Cloud API (Oficial)',
      category: 'Mensageria',
      status: 'connected',
      health: 'Operando normalmente (120ms)',
      account: '+55 11 98742-1920 (WABA Ativa)',
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      tag: 'Principal',
    },
    {
      id: 'ig',
      name: 'Instagram Direct (Graph API)',
      category: 'Redes Sociais',
      status: 'connected',
      health: 'Sincronização em tempo real',
      account: '@v4company.oficial',
      icon: <Instagram className="w-5 h-5 text-pink-400" />,
      tag: 'Ativo',
    },
    {
      id: 'meta_ads',
      name: 'Meta Lead Ads (Facebook & Instagram)',
      category: 'Aquisição de Tráfego',
      status: 'connected',
      health: 'Webhook disparado instantaneamente',
      account: 'Conta de Anúncios BM #8472910',
      icon: <Megaphone className="w-5 h-5 text-blue-400" />,
      tag: 'Campanhas Q3',
    },
    {
      id: 'google_ads',
      name: 'Google Ads (Lead Extensions)',
      category: 'Aquisição de Tráfego',
      status: 'connected',
      health: 'Captura via Webhook',
      account: 'ID: 719-291-8401',
      icon: <Globe className="w-5 h-5 text-amber-400" />,
      tag: 'Pesquisa & Display',
    },
    {
      id: 'webhook_custom',
      name: 'Webhooks Personalizados & n8n / Zapier',
      category: 'Automação Externa',
      status: 'connected',
      health: 'Endpoint: https://api.crm.io/v1/webhook',
      account: 'Token de Segurança Ativo',
      icon: <Webhook className="w-5 h-5 text-purple-400" />,
      tag: 'REST API',
    },
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-zinc-950">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-zinc-100">Canais & Integrações</h2>
          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            5 CONEXÕES ATIVAS
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          Gerencie suas conexões de WhatsApp, Instagram, plataformas de anúncios e webhooks externos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 hover:border-zinc-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-zinc-200">{item.name}</h3>
                    <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">{item.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Conectado</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Conta Vinculada:</span>
                <span className="text-zinc-200 font-semibold">{item.account}</span>
              </div>
              <div className="flex justify-between">
                <span>Status da Conexão:</span>
                <span className="text-emerald-400">{item.health}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Testar Conexão</span>
              </button>
              <button className="text-emerald-400 hover:underline flex items-center gap-1">
                <span>Configurações</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
