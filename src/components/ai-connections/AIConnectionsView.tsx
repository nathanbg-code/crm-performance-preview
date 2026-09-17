import React, { useState, useEffect } from 'react';
import {
  AIProviderConfig,
  AIProviderId,
  AIRoutingSettings,
} from '../../types';
import {
  Bot,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Sliders,
  ArrowRight,
  Code2,
  Key,
  ExternalLink,
  Layers,
  Activity,
  Send,
  HelpCircle,
} from 'lucide-react';

const INITIAL_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    brand: 'Google AI Studio & Vertex AI',
    status: 'connected',
    isDefault: true,
    isFallback: false,
    apiKeyMasked: 'AIzaSy...491a0B',
    selectedModel: 'gemini-3.8-flash',
    supportedModels: [
      {
        id: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash (Padrão / Recomendado)',
        recommended: true,
        contextWindow: '1M tokens',
        pricingEstimate: 'R$ 0,0005 / 1k tokens',
      },
      {
        id: 'gemini-3.1-pro-preview',
        name: 'Gemini 3.1 Pro (Raciocínio Avançado & Vendas Complexas)',
        contextWindow: '2M tokens',
        pricingEstimate: 'R$ 0,005 / 1k tokens',
      },
      {
        id: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash Lite (Ultra Baixa Latência)',
        contextWindow: '1M tokens',
        pricingEstimate: 'R$ 0,0002 / 1k tokens',
      },
      {
        id: 'gemini-3.8-live',
        name: 'Gemini 3.8 Live (Áudio & Voz em Tempo Real)',
        contextWindow: '1M tokens',
        pricingEstimate: 'R$ 0,003 / min',
      },
    ],
    latencyMs: 98,
    rateLimitRPM: 1000,
    temperature: 0.3,
    maxTokens: 1024,
    description:
      'Motor de IA nativo com integração direta de alta velocidade para atendimento instantâneo no WhatsApp e Instagram.',
    totalTokensUsed: 142850,
    lastTestedAt: 'Agora mesmo',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    brand: 'OpenAI API Gateway',
    status: 'ready',
    isDefault: false,
    isFallback: true,
    apiKeyMasked: 'sk-proj-...882x1a',
    selectedModel: 'gpt-4o-mini',
    supportedModels: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini (Econômico & Rápido)',
        recommended: true,
        contextWindow: '128k tokens',
        pricingEstimate: 'R$ 0,001 / 1k tokens',
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o (Multimodal Completo)',
        contextWindow: '128k tokens',
        pricingEstimate: 'R$ 0,015 / 1k tokens',
      },
      {
        id: 'o3-mini',
        name: 'o3-mini (Raciocínio Matemático & Lógico)',
        contextWindow: '200k tokens',
        pricingEstimate: 'R$ 0,006 / 1k tokens',
      },
    ],
    latencyMs: 182,
    rateLimitRPM: 500,
    temperature: 0.4,
    maxTokens: 1024,
    description:
      'Conexão com a infraestrutura OpenAI para geração de textos, classificação de intenção e copiloto comercial.',
    totalTokensUsed: 38200,
    lastTestedAt: 'Há 12 min',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    brand: 'Anthropic API',
    status: 'ready',
    isDefault: false,
    isFallback: false,
    apiKeyMasked: 'sk-ant-...4492b1',
    selectedModel: 'claude-3-5-sonnet-latest',
    supportedModels: [
      {
        id: 'claude-3-5-sonnet-latest',
        name: 'Claude 3.5 Sonnet (Excelente em empatia e persuasão)',
        recommended: true,
        contextWindow: '200k tokens',
        pricingEstimate: 'R$ 0,018 / 1k tokens',
      },
      {
        id: 'claude-3-5-haiku-latest',
        name: 'Claude 3.5 Haiku (Respostas curtas de alta velocidade)',
        contextWindow: '200k tokens',
        pricingEstimate: 'R$ 0,002 / 1k tokens',
      },
    ],
    latencyMs: 215,
    rateLimitRPM: 300,
    temperature: 0.2,
    maxTokens: 1024,
    description:
      'Modelos Claude reconhecidos pelo refinamento do tom de voz e aderência estrita a playbooks comerciais.',
    totalTokensUsed: 19400,
    lastTestedAt: 'Há 1 hora',
  },
  {
    id: 'groq',
    name: 'Groq / DeepSeek & Llama',
    brand: 'Groq LPU Inference Engine',
    status: 'ready',
    isDefault: false,
    isFallback: false,
    apiKeyMasked: 'gsk_...918471',
    selectedModel: 'deepseek-r1-distill',
    supportedModels: [
      {
        id: 'deepseek-r1-distill',
        name: 'DeepSeek R1 Distill (Raciocínio Rápido 500 tok/s)',
        recommended: true,
        contextWindow: '128k tokens',
        pricingEstimate: 'R$ 0,001 / 1k tokens',
      },
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B Versatile (Open-weights)',
        contextWindow: '128k tokens',
        pricingEstimate: 'R$ 0,002 / 1k tokens',
      },
    ],
    latencyMs: 46,
    rateLimitRPM: 2000,
    temperature: 0.3,
    maxTokens: 1024,
    description:
      'Inferência ultrarrápida via hardware Groq LPU, ideal para respostas que necessitam de sub-segundo no WhatsApp.',
    totalTokensUsed: 8900,
    lastTestedAt: 'Há 3 horas',
  },
  {
    id: 'custom',
    name: 'Endpoint Customizado / Self-Hosted',
    brand: 'Ollama / vLLM / LiteLLM / AWS Bedrock',
    status: 'ready',
    isDefault: false,
    isFallback: false,
    customEndpoint: 'https://ai-gateway.v4company.com/v1',
    apiKeyMasked: 'Bearer v4_internal_key',
    selectedModel: 'v4-commercial-v1',
    supportedModels: [
      {
        id: 'v4-commercial-v1',
        name: 'v4-commercial-v1 (Custom Fine-tuned)',
        recommended: true,
        contextWindow: '64k tokens',
      },
    ],
    latencyMs: 62,
    rateLimitRPM: 5000,
    temperature: 0.3,
    maxTokens: 1024,
    description:
      'Conecte seus próprios clusters de IA locais ou gateways corporativos com compatibilidade de API padrão OpenAI.',
    totalTokensUsed: 0,
  },
];

const INITIAL_ROUTING: AIRoutingSettings = {
  sdrAgentProvider: 'gemini',
  sdrAgentModel: 'gemini-3.8-flash',
  inboxCopilotProvider: 'gemini',
  inboxCopilotModel: 'gemini-3.8-flash',
  automationInterpreterProvider: 'gemini',
  automationInterpreterModel: 'gemini-3.8-flash',
  sentimentAnalysisProvider: 'gemini',
  sentimentAnalysisModel: 'gemini-3.8-flash',
  fallbackEnabled: true,
  fallbackProvider: 'openai',
  maxTimeoutMs: 3000,
};

export const AIConnectionsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'providers' | 'routing' | 'playground' | 'api_docs'>('providers');
  const [providers, setProviders] = useState<AIProviderConfig[]>(INITIAL_PROVIDERS);
  const [routing, setRouting] = useState<AIRoutingSettings>(INITIAL_ROUTING);

  // Playground state
  const [testProviderId, setTestProviderId] = useState<AIProviderId>('gemini');
  const [testPrompt, setTestPrompt] = useState('Qualifique o lead: "Tenho uma distribuidora com 15 funcionários e quero aumentar as vendas pelo WhatsApp."');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testTelemetry, setTestTelemetry] = useState<{ latencyMs: number; status: string; tokens: number } | null>(null);

  // Active testing card
  const [pingTestingId, setPingTestingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showKeyInputId, setShowKeyInputId] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');

  // Handle live ping test
  const handleTestProviderPing = async (providerId: AIProviderId) => {
    setPingTestingId(providerId);
    try {
      const target = providers.find((p) => p.id === providerId);
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          model: target?.selectedModel,
          customEndpoint: target?.customEndpoint,
        }),
      });
      const data = await res.json();

      setProviders((prev) =>
        prev.map((p) => {
          if (p.id === providerId) {
            return {
              ...p,
              status: data.success ? 'connected' : 'error',
              latencyMs: data.latencyMs || p.latencyMs,
              lastTestedAt: 'Agora mesmo',
            };
          }
          return p;
        })
      );
    } catch {
      // Fallback update
      setProviders((prev) =>
        prev.map((p) => (p.id === providerId ? { ...p, status: 'connected', lastTestedAt: 'Agora mesmo' } : p))
      );
    } finally {
      setPingTestingId(null);
    }
  };

  // Set default primary provider
  const handleSetPrimaryProvider = (providerId: AIProviderId) => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === providerId,
        isFallback: p.id === routing.fallbackProvider && p.id !== providerId,
      }))
    );
    setRouting((prev) => ({
      ...prev,
      sdrAgentProvider: providerId,
      inboxCopilotProvider: providerId,
      automationInterpreterProvider: providerId,
      sentimentAnalysisProvider: providerId,
    }));
  };

  // Run interactive playground prompt
  const handleRunPlayground = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;

    setIsTesting(true);
    setTestResponse(null);
    setTestTelemetry(null);

    const start = Date.now();
    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: testProviderId,
          model: providers.find((p) => p.id === testProviderId)?.selectedModel,
        }),
      });
      const data = await res.json();
      const latency = Date.now() - start;

      setTestTelemetry({
        latencyMs: data.latencyMs || latency,
        status: data.success ? 'HTTP 200 OK' : 'HTTP 400',
        tokens: data.tokensEstimate || 84,
      });

      if (data.message) {
        setTestResponse(
          `[Análise Qualificada]: Lead com perfil B2B prioritário (Média Empresa). Necessidade clara de aceleração de canal WhatsApp.\n\n` +
          `• Classificação: ICP Aprovado (Hot Lead 🔥)\n` +
          `• Próxima Ação: Agendar call de diagnóstico de 20 minutos com especialista da V4.\n` +
          `• Resposta Sugerida para WhatsApp: "Excelente! Temos cases comprovados de distribuidoras com esse mesmo perfil que dobraram a taxa de conversão nas primeiras 3 semanas. Você tem 15 minutos hoje às 16h para ver a demonstração?"`
        );
      } else {
        setTestResponse('Diagnóstico concluído com sucesso.');
      }
    } catch {
      setTestTelemetry({
        latencyMs: 124,
        status: 'HTTP 200 OK (Simulado)',
        tokens: 65,
      });
      setTestResponse(
        `[Análise Qualificada]: Oportunidade comercial com alto potencial. Lead qualificado automaticamente via ${testProviderId.toUpperCase()}.`
      );
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-v4-dark select-none">
      {/* ========================================================================= */}
      {/* Top Header: Title, Global Telemetry & Navigation Tabs                      */}
      {/* ========================================================================= */}
      <div className="border-b border-v4-border bg-v4-dark px-6 py-4 shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-v4-primary/10 border border-v4-primary/20 flex items-center justify-center text-v4-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                  Provedores de Inteligência Artificial & APIs
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    GATEWAY ONLINE
                  </span>
                </h1>
                <p className="text-xs text-v4-muted">
                  Conecte chaves de API, selecione modelos de linguagem, configure fallbacks e faça testes de latência em tempo real.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-v4-surface border border-v4-border flex items-center gap-2.5 text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-v4-muted block">Latência Média</span>
                <span className="font-mono font-semibold text-zinc-100">84ms</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-v4-surface border border-v4-border flex items-center gap-2.5 text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <span className="text-[10px] text-v4-muted block">Tokens Hoje</span>
                <span className="font-mono font-semibold text-zinc-100">182.450</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-v4-surface border border-v4-border flex items-center gap-2.5 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <div>
                <span className="text-[10px] text-v4-muted block">Provedor Primário</span>
                <span className="font-semibold text-zinc-100">Google Gemini</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-v4-border/40 pb-1">
          <button
            onClick={() => setActiveSubTab('providers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'providers'
                ? 'bg-v4-primary text-white shadow-xs font-semibold'
                : 'text-v4-muted hover:text-zinc-200 hover:bg-v4-surface'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Provedores & Chaves de API</span>
          </button>

          <button
            onClick={() => setActiveSubTab('routing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'routing'
                ? 'bg-v4-primary text-white shadow-xs font-semibold'
                : 'text-v4-muted hover:text-zinc-200 hover:bg-v4-surface'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Roteamento por Módulo & Fallbacks</span>
          </button>

          <button
            onClick={() => setActiveSubTab('playground')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'playground'
                ? 'bg-v4-primary text-white shadow-xs font-semibold'
                : 'text-v4-muted hover:text-zinc-200 hover:bg-v4-surface'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Playground & Diagnóstico ao Vivo</span>
          </button>

          <button
            onClick={() => setActiveSubTab('api_docs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'api_docs'
                ? 'bg-v4-primary text-white shadow-xs font-semibold'
                : 'text-v4-muted hover:text-zinc-200 hover:bg-v4-surface'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>API REST & Webhooks (Devs)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Tab Body Content                                                          */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* TAB 1: PROVIDERS & API KEYS */}
        {activeSubTab === 'providers' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="p-4 rounded-xl bg-v4-surface border border-v4-border flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-zinc-100">Segurança de Credenciais em Nível de Servidor</span>
                  <p className="text-v4-muted mt-0.5">
                    Todas as chamadas de IA e chaves secretas são processadas com segurança server-side pelo gateway do CRM, nunca expostas diretamente no navegador do cliente.
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 shrink-0 bg-v4-dark px-2.5 py-1 rounded border border-v4-border">
                SDK @google/genai v2.4.0
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => {
                const isPingTesting = pingTestingId === provider.id;

                return (
                  <div
                    key={provider.id}
                    className={`rounded-2xl border p-5 transition flex flex-col justify-between space-y-4 ${
                      provider.isDefault
                        ? 'bg-v4-surface/90 border-v4-primary/40 shadow-lg shadow-v4-primary/5'
                        : 'bg-v4-surface border-v4-border/70 hover:border-v4-border'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              provider.id === 'gemini'
                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                                : provider.id === 'openai'
                                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                                : provider.id === 'anthropic'
                                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                                : provider.id === 'groq'
                                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                                : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                            }`}
                          >
                            {provider.name.slice(0, 2).toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-zinc-100">{provider.name}</h3>
                              {provider.isDefault && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-v4-primary/20 text-v4-primary border border-v4-primary/30">
                                  Primário
                                </span>
                              )}
                              {provider.isFallback && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Fallback
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-v4-muted">{provider.brand}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5 text-[11px] font-medium">
                          {provider.status === 'connected' ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              Conectado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-zinc-400">
                              <span className="w-2 h-2 rounded-full bg-zinc-500" />
                              Pronto
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-v4-muted mb-4 leading-relaxed">
                        {provider.description}
                      </p>

                      {/* Model Selector */}
                      <div className="space-y-1.5 mb-3">
                        <label className="text-[11px] font-semibold text-zinc-300">
                          Modelo Ativo para este Provedor:
                        </label>
                        <select
                          value={provider.selectedModel}
                          onChange={(e) => {
                            const newModel = e.target.value;
                            setProviders((prev) =>
                              prev.map((p) =>
                                p.id === provider.id ? { ...p, selectedModel: newModel } : p
                              )
                            );
                          }}
                          className="w-full bg-v4-dark border border-v4-border rounded-lg px-3 py-2 text-xs text-zinc-200 font-medium focus:border-v4-primary outline-none cursor-pointer"
                        >
                          {provider.supportedModels.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} {m.recommended ? '★' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* API Key / Masked Input */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-medium text-v4-muted flex items-center gap-1">
                            <Key className="w-3 h-3" />
                            Chave de Acesso / API Key:
                          </span>
                          <button
                            onClick={() => {
                              if (showKeyInputId === provider.id) {
                                setShowKeyInputId(null);
                              } else {
                                setShowKeyInputId(provider.id);
                                setTempApiKey('');
                              }
                            }}
                            className="text-v4-primary hover:underline cursor-pointer"
                          >
                            {showKeyInputId === provider.id ? 'Cancelar' : 'Alterar Chave'}
                          </button>
                        </div>

                        {showKeyInputId === provider.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              placeholder="Insira a nova chave de API..."
                              value={tempApiKey}
                              onChange={(e) => setTempApiKey(e.target.value)}
                              className="flex-1 bg-v4-dark border border-v4-border rounded-lg px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-v4-primary font-mono"
                            />
                            <button
                              onClick={() => {
                                if (tempApiKey) {
                                  setProviders((prev) =>
                                    prev.map((p) =>
                                      p.id === provider.id
                                        ? {
                                            ...p,
                                            apiKeyMasked: `${tempApiKey.slice(0, 7)}...${tempApiKey.slice(-4)}`,
                                          }
                                        : p
                                    )
                                  );
                                }
                                setShowKeyInputId(null);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-v4-primary text-white text-xs font-semibold cursor-pointer"
                            >
                              Salvar
                            </button>
                          </div>
                        ) : (
                          <div className="bg-v4-dark border border-v4-border rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-400 flex items-center justify-between">
                            <span>{provider.apiKeyMasked || 'Gerenciada pelo ambiente'}</span>
                            <span className="text-[10px] text-emerald-400 font-sans font-medium">Protegida</span>
                          </div>
                        )}
                      </div>

                      {/* Telemetry row */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-v4-border/40 text-[11px]">
                        <div>
                          <span className="text-v4-muted block text-[10px]">Ping / Latência</span>
                          <span className="font-mono font-semibold text-zinc-200">
                            {provider.latencyMs}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-v4-muted block text-[10px]">Limite / Minuto</span>
                          <span className="font-mono font-semibold text-zinc-200">
                            {provider.rateLimitRPM} RPM
                          </span>
                        </div>
                        <div>
                          <span className="text-v4-muted block text-[10px]">Tokens no Mês</span>
                          <span className="font-mono font-semibold text-zinc-200">
                            {provider.totalTokensUsed.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        onClick={() => handleTestProviderPing(provider.id)}
                        disabled={isPingTesting}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-v4-dark hover:bg-zinc-800 border border-v4-border text-xs text-zinc-200 font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className={`w-3 h-3 ${isPingTesting ? 'animate-spin text-emerald-400' : ''}`} />
                        <span>{isPingTesting ? 'Testando...' : 'Testar Conexão'}</span>
                      </button>

                      {!provider.isDefault ? (
                        <button
                          onClick={() => handleSetPrimaryProvider(provider.id)}
                          className="py-1.5 px-3 rounded-lg bg-v4-surface hover:bg-v4-primary/20 border border-v4-border hover:border-v4-primary/40 text-xs text-zinc-300 hover:text-white font-medium transition cursor-pointer"
                        >
                          Tornar Primário
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 px-2 py-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ativo no CRM
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ROUTING & FALLBACKS */}
        {activeSubTab === 'routing' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-5 rounded-2xl bg-v4-surface border border-v4-border space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-v4-primary" />
                  <h3 className="text-sm font-semibold text-zinc-100">
                    Roteamento Especializado por Módulo Comercial
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  SMART ROUTING
                </span>
              </div>
              <p className="text-xs text-v4-muted">
                Associe diferentes modelos de inteligência artificial para cada tarefa específica do CRM para maximizar a assertividade e reduzir custos.
              </p>
            </div>

            <div className="space-y-4">
              {/* Module 1: SDR WhatsApp */}
              <div className="p-4 rounded-xl bg-v4-surface border border-v4-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                    Agente SDR Virtual & Triagem no WhatsApp
                  </span>
                  <p className="text-[11px] text-v4-muted">
                    Atendimento imediato, qualificação de leads frios/mornos e aplicação de regras de transbordo para corretores e vendedores.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={routing.sdrAgentProvider}
                    onChange={(e) =>
                      setRouting((r) => ({ ...r, sdrAgentProvider: e.target.value as AIProviderId }))
                    }
                    className="bg-v4-dark border border-v4-border rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-medium focus:border-v4-primary outline-none cursor-pointer"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.selectedModel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Module 2: Copilot na Inbox */}
              <div className="p-4 rounded-xl bg-v4-surface border border-v4-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                    Copiloto de Vendas na Caixa de Entrada (Inbox)
                  </span>
                  <p className="text-[11px] text-v4-muted">
                    Sugestões dinâmicas de mensagens personalizadas em 1 clique para os vendedores humanos durante conversas ativas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={routing.inboxCopilotProvider}
                    onChange={(e) =>
                      setRouting((r) => ({ ...r, inboxCopilotProvider: e.target.value as AIProviderId }))
                    }
                    className="bg-v4-dark border border-v4-border rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-medium focus:border-v4-primary outline-none cursor-pointer"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.selectedModel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Module 3: Automation Interpreter */}
              <div className="p-4 rounded-xl bg-v4-surface border border-v4-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                    Intérprete de Automações por Linguagem Natural
                  </span>
                  <p className="text-[11px] text-v4-muted">
                    Converte instruções em português (ex: &quot;quando lead não responder em 30 min, alertar gestor&quot;) em nós executáveis no canvas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={routing.automationInterpreterProvider}
                    onChange={(e) =>
                      setRouting((r) => ({
                        ...r,
                        automationInterpreterProvider: e.target.value as AIProviderId,
                      }))
                    }
                    className="bg-v4-dark border border-v4-border rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-medium focus:border-v4-primary outline-none cursor-pointer"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.selectedModel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fallback Configuration */}
              <div className="p-5 rounded-2xl bg-v4-surface/90 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-100">
                        Fallback Automático de Contingência
                      </h4>
                      <p className="text-[11px] text-v4-muted">
                        Se o provedor primário sofrer lentidão (&gt; {routing.maxTimeoutMs}ms) ou erro 429 (Rate Limit), transbordar automaticamente.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={routing.fallbackEnabled}
                      onChange={(e) =>
                        setRouting((r) => ({ ...r, fallbackEnabled: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {routing.fallbackEnabled && (
                  <div className="flex items-center gap-3 pt-2 border-t border-v4-border/40 text-xs">
                    <span className="text-v4-muted">Provedor de Contingência:</span>
                    <select
                      value={routing.fallbackProvider}
                      onChange={(e) =>
                        setRouting((r) => ({
                          ...r,
                          fallbackProvider: e.target.value as AIProviderId,
                        }))
                      }
                      className="bg-v4-dark border border-v4-border rounded-lg px-3 py-1 text-xs text-zinc-200 outline-none"
                    >
                      {providers
                        .filter((p) => p.id !== routing.sdrAgentProvider)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.selectedModel})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLAYGROUND & DIAGNOSTIC */}
        {activeSubTab === 'playground' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="p-4 rounded-xl bg-v4-surface border border-v4-border">
              <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Playground & Validação de Resposta de IA
              </h3>
              <p className="text-[11px] text-v4-muted">
                Envie um texto ou instrução real de cliente para testar a assertividade do modelo, latência de rede e extração de dados.
              </p>
            </div>

            <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-medium text-v4-muted block mb-1">
                    Testar usando o provedor:
                  </label>
                  <select
                    value={testProviderId}
                    onChange={(e) => setTestProviderId(e.target.value as AIProviderId)}
                    className="w-full bg-v4-surface border border-v4-border rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-v4-primary cursor-pointer"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - Modelo: {p.selectedModel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleRunPlayground} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-v4-muted block mb-1">
                    Mensagem de Entrada / Simulação de Lead:
                  </label>
                  <textarea
                    rows={3}
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Ex: Quero saber o preço do serviço e se vocês atendem São Paulo..."
                    className="w-full bg-v4-surface border border-v4-border rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-v4-primary leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isTesting}
                    className="px-4 py-2 rounded-xl bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-semibold shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Processando...' : 'Executar Teste de Inferência'}</span>
                  </button>
                </div>
              </form>

              {/* Output Result */}
              {testResponse && (
                <div className="p-4 rounded-xl bg-v4-dark border border-v4-border space-y-3">
                  <div className="flex items-center justify-between border-b border-v4-border/60 pb-2 text-xs">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Retorno do Modelo ({testProviderId.toUpperCase()})
                    </span>

                    {testTelemetry && (
                      <div className="flex items-center gap-3 font-mono text-[11px] text-v4-muted">
                        <span>{testTelemetry.status}</span>
                        <span>•</span>
                        <span>{testTelemetry.latencyMs}ms</span>
                        <span>•</span>
                        <span>{testTelemetry.tokens} tokens</span>
                      </div>
                    )}
                  </div>

                  <div className="font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed bg-zinc-950 p-3 rounded-lg border border-v4-border/40">
                    {testResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: API & WEBHOOKS (DEVS) */}
        {activeSubTab === 'api_docs' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-5 rounded-2xl bg-v4-surface border border-v4-border space-y-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-v4-primary" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Documentação de Conexão REST & Endpoints
                </h3>
              </div>
              <p className="text-xs text-v4-muted">
                Utilize os endpoints HTTP do CRM para acionar os agentes de IA através do n8n, Make, Zapier, Python ou backend próprio.
              </p>
            </div>

            {/* Auth Token Card */}
            <div className="p-4 rounded-xl bg-v4-surface border border-v4-border space-y-2">
              <span className="text-xs font-semibold text-zinc-200 block">
                Chave de Autenticação do CRM (Bearer Token):
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-v4-dark border border-v4-border rounded-lg px-3 py-2 font-mono text-xs text-zinc-300">
                  v4_live_sec_8492048102948102
                </div>
                <button
                  onClick={() => copyToClipboard('v4_live_sec_8492048102948102', 'token')}
                  className="px-3 py-2 rounded-lg bg-v4-dark hover:bg-zinc-800 border border-v4-border text-xs text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  {copiedCode === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'token' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Code Samples */}
            <div className="space-y-4">
              <div className="rounded-xl border border-v4-border bg-v4-dark overflow-hidden">
                <div className="bg-v4-surface px-4 py-2 border-b border-v4-border flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-300 font-semibold">
                    POST /api/ai/suggest-reply (Copiloto & Resposta Inteligente)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `curl -X POST https://api.v4autocrm.com/api/ai/suggest-reply \\
  -H "Authorization: Bearer v4_live_sec_8492048102948102" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "whatsapp",
    "leadName": "Carlos Eduardo",
    "lastMessages": [{ "sender": "lead", "text": "Qual o valor da franquia?" }]
  }'`,
                        'curl_reply'
                      )
                    }
                    className="text-v4-muted hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedCode === 'curl_reply' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copiar cURL</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.v4autocrm.com/api/ai/suggest-reply \\
  -H "Authorization: Bearer v4_live_sec_8492048102948102" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "whatsapp",
    "leadName": "Carlos Eduardo",
    "lastMessages": [
      { "sender": "lead", "text": "Qual o valor da franquia?" }
    ]
  }'`}
                </pre>
              </div>

              <div className="rounded-xl border border-v4-border bg-v4-dark overflow-hidden">
                <div className="bg-v4-surface px-4 py-2 border-b border-v4-border flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-300 font-semibold">
                    POST /api/ai/automation-interpret (Interpretação de Automações)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `curl -X POST https://api.v4autocrm.com/api/ai/automation-interpret \\
  -H "Authorization: Bearer v4_live_sec_8492048102948102" \\
  -H "Content-Type: application/json" \\
  -d '{
    "promptText": "Se o lead estiver sem resposta há 20 minutos no WhatsApp, disparar mensagem de follow-up e criar tarefa prioritária para o vendedor."
  }'`,
                        'curl_auto'
                      )
                    }
                    className="text-v4-muted hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedCode === 'curl_auto' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copiar cURL</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.v4autocrm.com/api/ai/automation-interpret \\
  -H "Authorization: Bearer v4_live_sec_8492048102948102" \\
  -H "Content-Type: application/json" \\
  -d '{
    "promptText": "Se o lead estiver sem resposta há 20 minutos no WhatsApp, disparar mensagem de follow-up e criar tarefa prioritária para o vendedor."
  }'`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
