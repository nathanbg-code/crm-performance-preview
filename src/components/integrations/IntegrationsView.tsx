import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Power,
  Search,
  Plus,
  Zap,
  Sliders,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  X,
  Copy,
  Check,
} from 'lucide-react';
import {
  WhatsAppBrandIcon,
  InstagramBrandIcon,
  MetaAdsBrandIcon,
  GoogleAdsBrandIcon,
  RDStationBrandIcon,
  HubSpotBrandIcon,
  ActiveCampaignBrandIcon,
  WebhookZapierBrandIcon,
  TikTokAdsBrandIcon,
  LinkedInAdsBrandIcon,
} from './BrandIcons';

interface IntegrationItem {
  id: string;
  name: string;
  provider: string;
  category: 'messaging' | 'ads' | 'crm' | 'webhooks';
  categoryLabel: string;
  status: 'connected' | 'syncing' | 'paused';
  latency: string;
  eventsToday: string;
  account: string;
  iconComponent: React.ReactNode;
  tag: string;
  description: string;
  webhookUrl?: string;
  tokenMasked?: string;
}

export const IntegrationsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string } | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<IntegrationItem | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: 'wpp',
      name: 'WhatsApp Cloud API',
      provider: 'Meta Business Oficial',
      category: 'messaging',
      categoryLabel: 'Mensageria',
      status: 'connected',
      latency: '85ms',
      eventsToday: '1.420 msgs',
      account: '+55 11 98742-1920 (WABA V4 Verified)',
      iconComponent: <WhatsAppBrandIcon size="lg" />,
      tag: 'Oficial Meta',
      description: 'Envio e recepção de mensagens em tempo real, templates HSM aprovados e gatilhos de chatbot.',
      webhookUrl: 'https://api.v4autocrm.com/v1/webhooks/whatsapp/waba_849201',
      tokenMasked: 'EAAOx...9471b0',
    },
    {
      id: 'ig',
      name: 'Instagram Direct API',
      provider: 'Meta Graph API',
      category: 'messaging',
      categoryLabel: 'Mensageria',
      status: 'connected',
      latency: '110ms',
      eventsToday: '630 msgs',
      account: '@v4company.oficial (1.2M seguidores)',
      iconComponent: <InstagramBrandIcon size="lg" />,
      tag: 'Direct Graph',
      description: 'Captura automática de mensagens diretas, menções em stories e conversão para leads no funil.',
      webhookUrl: 'https://api.v4autocrm.com/v1/webhooks/instagram/graph_v19',
      tokenMasked: 'IGQVJ...419x02',
    },
    {
      id: 'meta_ads',
      name: 'Meta Lead Ads',
      provider: 'Facebook & Instagram Ads',
      category: 'ads',
      categoryLabel: 'Tráfego Pago',
      status: 'connected',
      latency: '140ms',
      eventsToday: '284 leads',
      account: 'BM V4 Marketing #8472910',
      iconComponent: <MetaAdsBrandIcon size="lg" />,
      tag: 'Lead Gen',
      description: 'Captura instantânea de formulários instantâneos nativos do Instagram e Facebook Ads.',
      webhookUrl: 'https://api.v4autocrm.com/v1/webhooks/meta-ads/sub_7729',
      tokenMasked: 'EAABs...91008f',
    },
    {
      id: 'google_ads',
      name: 'Google Ads Lead Extensions',
      provider: 'Google Marketing Platform',
      category: 'ads',
      categoryLabel: 'Tráfego Pago',
      status: 'connected',
      latency: '160ms',
      eventsToday: '96 leads',
      account: 'MCC V4 Group (ID: 719-291-8401)',
      iconComponent: <GoogleAdsBrandIcon size="lg" />,
      tag: 'Search & Display',
      description: 'Recebimento de formulários das campanhas de Pesquisa, YouTube e Performance Max.',
      webhookUrl: 'https://api.v4autocrm.com/v1/webhooks/google-ads/ext_1182',
      tokenMasked: 'AIzaS...48102a',
    },
    {
      id: 'rd_station',
      name: 'RD Station Marketing',
      provider: 'RD Station',
      category: 'crm',
      categoryLabel: 'Automação & CRM',
      status: 'connected',
      latency: '190ms',
      eventsToday: '412 eventos',
      account: 'V4 Company Matriz (Token OAuth2)',
      iconComponent: <RDStationBrandIcon size="lg" />,
      tag: 'Inbound Sync',
      description: 'Sincronização bidirecional de oportunidades ganhas, lead scoring e etapas do funil.',
      webhookUrl: 'https://api.v4autocrm.com/v1/webhooks/rd-station/post_hook',
      tokenMasked: 'rd_sec_99182...847',
    },
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      provider: 'HubSpot Inc.',
      category: 'crm',
      categoryLabel: 'Automação & CRM',
      status: 'connected',
      latency: '220ms',
      eventsToday: '180 sincronizações',
      account: 'Portal ID: 29810482',
      iconComponent: <HubSpotBrandIcon size="lg" />,
      tag: 'CRM Sync',
      description: 'Espelhamento automático de contatos, negócios fechados e histórico comercial.',
      webhookUrl: 'https://api.v4autocrm.com/v1/webhooks/hubspot/app_3892',
      tokenMasked: 'pat-na1-...9910',
    },
    {
      id: 'webhook_custom',
      name: 'Webhooks & n8n / Zapier',
      provider: 'REST API Engine',
      category: 'webhooks',
      categoryLabel: 'Webhooks & APIs',
      status: 'connected',
      latency: '45ms',
      eventsToday: '3.190 disparos',
      account: 'Endpoint HTTPS Seguro (HMAC-SHA256)',
      iconComponent: <WebhookZapierBrandIcon size="lg" />,
      tag: 'REST API',
      description: 'Entrada e saída de dados personalizada para pipelines no n8n, Make, Zapier e ERPs.',
      webhookUrl: 'https://api.v4autocrm.com/v1/integrations/custom-webhook/live',
      tokenMasked: 'v4_sec_live_948102847192',
    },
    {
      id: 'tiktok_ads',
      name: 'TikTok Lead Gen Ads',
      provider: 'TikTok For Business',
      category: 'ads',
      categoryLabel: 'Tráfego Pago',
      status: 'connected',
      latency: '175ms',
      eventsToday: '42 leads',
      account: 'TikTok BM #481920',
      iconComponent: <TikTokAdsBrandIcon size="lg" />,
      tag: 'Viral Video',
      description: 'Recebimento automático de formulários nativos de campanhas Spark Ads e Lead Gen do TikTok.',
      webhookUrl: 'https://api.v4autocrm.com/v1/webhooks/tiktok/lead_sub',
      tokenMasked: 'tt_app_99182...91',
    },
  ]);

  const handleTestConnection = (id: string, name: string) => {
    setTestingId(id);
    setTestResult(null);

    setTimeout(() => {
      setTestingId(null);
      setTestResult({
        id,
        message: `Conexão verificada com sucesso! Resposta: 200 OK (${Math.floor(Math.random() * 60 + 60)}ms).`,
      });

      setTimeout(() => {
        setTestResult((prev) => (prev?.id === id ? null : prev));
      }, 5000);
    }, 1100);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const filteredIntegrations = integrations.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.account.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-v4-bg flex flex-col min-w-0">
      {/* Top Header Bar */}
      <div className="px-6 py-5 border-b border-v4-border/30 bg-v4-dark flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-base font-semibold text-v4-text tracking-tight">
              Canais, Plataformas & Integrações
            </h1>
            <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/25 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {integrations.length} CONEXÕES ATIVAS
            </span>
          </div>
          <p className="text-xs text-v4-muted">
            Conectores oficiais da Meta, WhatsApp Cloud API, anúncios de alta conversão, webhooks e CRMs sincronizados.
          </p>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="h-8.5 px-3.5 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Conexão</span>
          </button>
        </div>
      </div>

      {/* Metrics Quick Bar */}
      <div className="px-6 py-3.5 border-b border-v4-border/25 bg-v4-surface/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-v4-muted block uppercase tracking-wider">Status da Rede</span>
            <span className="text-xs font-semibold text-v4-text">100% Operacional</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-v4-muted block uppercase tracking-wider">Leads Processados Hoje</span>
            <span className="text-xs font-semibold text-v4-text font-mono">6.174 eventos</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-v4-muted block uppercase tracking-wider">Latência Média</span>
            <span className="text-xs font-semibold text-emerald-400 font-mono">112ms</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-v4-muted block uppercase tracking-wider">Segurança</span>
            <span className="text-xs font-semibold text-v4-text">TLS 1.3 / HMAC</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-v4-surface/80 rounded-lg border border-v4-border/30 text-xs w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Todos os Conectores' },
            { id: 'messaging', label: 'Mensageria & Chat' },
            { id: 'ads', label: 'Tráfego Pago & Ads' },
            { id: 'crm', label: 'Automação & CRMs' },
            { id: 'webhooks', label: 'Webhooks & APIs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-v4-elevated text-v4-text shadow-xs font-semibold'
                  : 'text-v4-muted hover:text-v4-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-v4-muted/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrar integrações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8.5 bg-v4-surface/70 border border-v4-border/30 rounded-lg pl-8.5 pr-3 text-xs text-v4-text placeholder-v4-muted/70 focus:border-v4-primary/60 outline-none transition"
          />
        </div>
      </div>

      {/* Integrations Grid with Polished Brand Cards */}
      <div className="p-6 pt-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4.5">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            className="p-4.5 rounded-xl bg-v4-dark border border-v4-border/35 hover:border-v4-border/70 transition space-y-4 flex flex-col justify-between group shadow-xs hover:shadow-md hover:shadow-black/40"
          >
            {/* Header: Beautiful Brand Logo + Name + Status */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Authentic SVG Brand Logo Container */}
                  <div className="transition-transform group-hover:scale-105 duration-200">
                    {item.iconComponent}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-v4-text truncate tracking-tight">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-mono bg-v4-surface text-v4-muted px-2 py-0.5 rounded border border-v4-border/30">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-[11px] text-v4-muted truncate block">
                      {item.provider} • {item.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Connection Status Badge */}
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Conectado</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-v4-muted leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Technical Detail Card */}
            <div className="p-3 rounded-lg bg-v4-surface/60 border border-v4-border/25 text-xs font-mono space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-v4-muted text-[11px]">Conta Vinculada:</span>
                <span className="text-v4-text font-semibold truncate max-w-[210px]">{item.account}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-v4-muted">Throughput Hoje:</span>
                <span className="text-emerald-400 font-medium">{item.eventsToday}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-v4-muted">Latência de Webhook:</span>
                <span className="text-zinc-300">{item.latency}</span>
              </div>
            </div>

            {/* Test result feedback banner */}
            {testResult?.id === item.id && (
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-v4-border/20 text-xs">
              <button
                onClick={() => handleTestConnection(item.id, item.name)}
                disabled={testingId === item.id}
                className="text-v4-muted hover:text-v4-text flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 py-1"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${testingId === item.id ? 'animate-spin text-v4-primary' : ''}`}
                />
                <span>{testingId === item.id ? 'Testando Ping...' : 'Testar Conexão'}</span>
              </button>

              <button
                onClick={() => setSelectedConfig(item)}
                className="text-v4-text hover:text-v4-primary flex items-center gap-1 font-medium transition cursor-pointer py-1"
              >
                <span>Configurar Webhook</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* Modal / Drawer: Webhook & Configurações da Integração                     */}
      {/* ========================================================================= */}
      {selectedConfig && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-v4-dark border border-v4-border/40 rounded-xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {selectedConfig.iconComponent}
                <div>
                  <h3 className="text-sm font-semibold text-v4-text">
                    Configurações: {selectedConfig.name}
                  </h3>
                  <span className="text-xs text-v4-muted">{selectedConfig.account}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedConfig(null)}
                className="text-v4-muted hover:text-v4-text p-1 rounded-md hover:bg-v4-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-[11px] font-medium text-v4-muted uppercase tracking-wider block mb-1">
                  URL do Webhook Receptor (Para colar no Meta / Google / RD Station)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedConfig.webhookUrl || 'https://api.v4autocrm.com/v1/webhook'}
                    className="flex-1 bg-v4-surface border border-v4-border/40 rounded-md px-3 py-2 text-xs text-v4-text font-mono outline-none"
                  />
                  <button
                    onClick={() => handleCopy(selectedConfig.webhookUrl || '')}
                    className="px-3 py-2 rounded-md bg-v4-elevated hover:bg-zinc-700 text-v4-text border border-v4-border/40 transition cursor-pointer flex items-center gap-1 font-medium"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-v4-muted uppercase tracking-wider block mb-1">
                  Token de Acesso / Chave de API
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedConfig.tokenMasked || 'v4_live_secret_token'}
                  className="w-full bg-v4-surface border border-v4-border/40 rounded-md px-3 py-2 text-xs text-v4-muted font-mono outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-v4-surface/60 border border-v4-border/25 space-y-1">
                <span className="font-semibold text-v4-text block text-xs">Mapeamento de Campos Automático</span>
                <p className="text-v4-muted text-[11px]">
                  Os campos <code className="text-emerald-400">nome</code>, <code className="text-emerald-400">telefone</code>,{' '}
                  <code className="text-emerald-400">empresa</code> e <code className="text-emerald-400">utm_source</code> são
                  normalizados automaticamente para o funil comercial.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-v4-border/30">
              <button
                onClick={() => setSelectedConfig(null)}
                className="px-3.5 py-1.5 rounded-md bg-v4-surface hover:bg-v4-elevated text-v4-text text-xs border border-v4-border/40 transition cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  handleTestConnection(selectedConfig.id, selectedConfig.name);
                  setSelectedConfig(null);
                }}
                className="px-4 py-1.5 rounded-md bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer shadow-xs"
              >
                Disparar Ping de Teste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Adicionar Nova Conexão                                             */}
      {/* ========================================================================= */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-v4-dark border border-v4-border/40 rounded-xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-v4-text">Adicionar Nova Conexão</h3>
                <p className="text-xs text-v4-muted">Selecione o conector que deseja ativar</p>
              </div>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="text-v4-muted hover:text-v4-text p-1 rounded-md hover:bg-v4-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {[
                { name: 'Novo Número WhatsApp Cloud API', icon: <WhatsAppBrandIcon size="sm" />, desc: 'WABA adicional para equipe comercial' },
                { name: 'LinkedIn Lead Gen Forms', icon: <LinkedInAdsBrandIcon size="sm" />, desc: 'Captura B2B de diretores e decisores' },
                { name: 'ActiveCampaign CRM', icon: <ActiveCampaignBrandIcon size="sm" />, desc: 'Sincronização de tags e cadências' },
                { name: 'Endpoint Webhook Genérico', icon: <WebhookZapierBrandIcon size="sm" />, desc: 'Integrar via POST JSON com n8n ou Zapier' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsConnectModalOpen(false);
                  }}
                  className="w-full p-3 rounded-lg bg-v4-surface hover:bg-v4-elevated border border-v4-border/30 flex items-center justify-between text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.icon}
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-v4-text block group-hover:text-v4-primary transition">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-v4-muted truncate block">{item.desc}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-v4-muted group-hover:text-v4-text shrink-0" />
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-v4-border/30">
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-md bg-v4-surface hover:bg-v4-elevated text-v4-text text-xs border border-v4-border/40 transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
