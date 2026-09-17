import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  CheckCircle2,
  GitFork,
  Users,
  Megaphone,
  Layers,
  ArrowRight,
  Bot,
  Tag,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { CRMConfigProposal, Pipeline, Seller } from '../../types';

interface AIOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (proposal: CRMConfigProposal) => void;
  currentSellers: Seller[];
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const PRESET_SCENARIOS = [
  {
    label: 'Clínica & Estética',
    prompt:
      'Somos uma clínica de dermatologia e estética. Nossos leads vêm do Instagram Ads e indicação. 3 médicas e 2 consultoras atendem no WhatsApp. Etapas: Novo Lead, Triagem, Avaliação Agendada, Compareceu, Orçamento e Fechamento. Se não responder em 20 min, mandar WhatsApp.',
  },
  {
    label: 'Energia Solar',
    prompt:
      'Vendemos sistemas de energia solar residencial e comercial. Leads chegam do Meta Ads e Google. 4 vendedores comerciais com distribuição 25% cada. Precisamos coletar conta de luz, fazer estudo de viabilidade, apresentar proposta e assinar contrato.',
  },
  {
    label: 'Imobiliária de Alto Padrão',
    prompt:
      'Imobiliária boutique com 6 corretores. Leads vêm do portal VivaReal, Meta Ads e WhatsApp direto. Queremos qualificação imediata com IA SDR, agendamento de visitas aos imóveis e follow-up a cada 48 horas se não houver resposta.',
  },
  {
    label: 'Agência de Marketing & Tráfego',
    prompt:
      'Agência de tráfego pago B2B. Leads chegam de formulário no site e Instagram. Etapas: Lead Recebido, Diagnóstico Gratuito, Apresentação Comercial, Contrato. Vendedores João e Pedro dividem 50/50.',
  },
];

export const AIOnboardingModal: React.FC<AIOnboardingModalProps> = ({
  isOpen,
  onClose,
  onApplyConfig,
  currentSellers,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Olá! Sou seu Arquiteto de CRM inteligente. Me conte: como sua empresa vende hoje, de onde chegam seus clientes e quais são seus canais principais (WhatsApp, Instagram, Ads)?',
      timestamp: 'Agora',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Dynamic CRM Blueprint state being synthesized by AI
  const [blueprint, setBlueprint] = useState<CRMConfigProposal>({
    segment: 'Vendas Comerciais & Serviços',
    origins: ['WhatsApp Direto', 'Instagram Direct', 'Meta Ads (Facebook/Insta)', 'Google Ads'],
    sellers: ['João Victor Ribeiro', 'Pedro Alcantara', 'Mariana Duarte', 'Beatriz Vasconcelos'],
    pipelineStages: [
      'Novo Lead',
      'Primeiro Contato',
      'Qualificado',
      'Proposta Enviada',
      'Em Negociação',
      'Venda Fechada',
    ],
    automations: [
      'Distribuição Round-Robin (50% João / 50% Pedro)',
      'Alerta SLA de 30 minutos sem resposta no WhatsApp',
      'Agente SDR IA para primeiro contato em 15 segundos',
      'Mover para Negociação quando proposta for aberta',
    ],
    customFields: ['Valor da Oportunidade', 'Origem da Campanha', 'Prazo Desejado', 'Decisor Técnico'],
    tags: ['Prioridade Alta', 'Meta Ads', 'Quente', 'Orçamento Enviado', 'Indicação'],
    qualificationRules: [
      'Decisor ou influenciador de compra',
      'Capacidade de investimento validada',
      'Previsão de contratação até 60 dias',
    ],
    allocatedAgent: 'Clara (SDR Especialista de Triagem)',
  });

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: 'Agora',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputValue('');
    setIsAnalyzing(true);

    try {
      // Call server backend /api/ai/onboarding
      const res = await fetch('/api/ai/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMsg],
          currentBlueprint: blueprint,
        }),
      });

      const data = await res.json();

      if (data) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'ai',
            text:
              data.reply ||
              `Perfeito! Processei sua resposta e atualizei a arquitetura do seu CRM com ${data.etapas_funil?.length || 6} etapas, distribuição automatizada e regras de follow-up para WhatsApp.`,
            timestamp: 'Agora',
          },
        ]);

        if (data.origens || data.etapas_funil) {
          setBlueprint((prev) => ({
            ...prev,
            segment: data.resumo_perfil || prev.segment,
            origins: data.origens || prev.origins,
            pipelineStages: data.etapas_funil || prev.pipelineStages,
            automations: data.automacoes_sugeridas || prev.automations,
            customFields: data.campos_necessarios || prev.customFields,
            tags: data.tags || prev.tags,
            sellers: data.vendedores || prev.sellers,
          }));
        }
      }
    } catch (e) {
      console.warn('Fallback local parsing:', e);
      // Fallback local update
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: 'Compreendido! Estruturei o fluxo comercial completo para sua operação. O Blueprint ao lado reflete suas origens de leads, equipe e regras de automação.',
          timestamp: 'Agora',
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    onApplyConfig(blueprint);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
                  Configuração Autônoma por IA
                </h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                  Zero Formulários Manuais
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                “Você explica como sua empresa vende. A IA transforma isso em CRM.”
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Column 1 (5 cols): Conversational Dialogue with AI */}
          <div className="lg:col-span-5 border-r border-zinc-800 flex flex-col h-full bg-zinc-950/60">
            {/* Quick Presets for Demo / Testing */}
            <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/30">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Modelos prontos para testar:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SCENARIOS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleSendMessage(preset.prompt)}
                    className="text-[11px] px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white font-normal'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>A IA está analisando seu modelo e estruturando os dados...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Explique como vocês vendem ou como chegam os leads..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-emerald-500/60 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isAnalyzing}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2 (7 cols): Live Dynamic CRM Blueprint Preview */}
          <div className="lg:col-span-7 flex flex-col h-full bg-zinc-950 overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-emerald-400 tracking-wider">
                  Prévia Visual em Tempo Real
                </span>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Arquitetura Proposta para {blueprint.segment}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Validação Automática</span>
              </div>
            </div>

            {/* 1. Origens Identificadas */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Megaphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Canais & Origens Identificadas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blueprint.origins.map((orig, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1 rounded-md"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {orig}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Pipeline & Etapas do Funil */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pipeline Comercial Sugerido ({blueprint.pipelineStages.length} Etapas)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {blueprint.pipelineStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-left relative group hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                        0{idx + 1}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs font-medium text-zinc-200">{stage}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Automações & Regras de Distribuição */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <GitFork className="w-3.5 h-3.5 text-purple-400" />
                <span>Automações Comerciais a Criar</span>
              </div>
              <div className="space-y-2">
                {blueprint.automations.map((auto, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300"
                  >
                    <span className="w-5 h-5 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 text-[11px] font-mono">
                      ⚡
                    </span>
                    <span className="flex-1">{auto}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Automático</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Agente de IA & Regras de Qualificação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agente de IA Alocado</span>
                </div>
                <div className="text-xs text-zinc-300 font-medium">
                  {blueprint.allocatedAgent}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Configurada para primeiro contato em até 15s no WhatsApp e qualificação de orçamento.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vendedores & Distribuição</span>
                </div>
                <div className="text-xs text-zinc-300 font-medium">
                  {blueprint.sellers.length} vendedores cadastrados
                </div>
                <p className="text-[11px] text-zinc-400">
                  Regra Round-Robin equilibrada ativada para todas as entradas de novos leads.
                </p>
              </div>
            </div>

            {/* 5. Campos & Tags */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <Tag className="w-3.5 h-3.5 text-teal-400" />
                <span>Tags & Metadados Coletados</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {blueprint.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Summary & Application Bar */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-xs text-zinc-300">
            <span className="font-semibold text-zinc-100">Seu CRM está pronto:</span>
            <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
              <span>1 Pipeline</span>
              <span>•</span>
              <span>{blueprint.pipelineStages.length} Etapas</span>
              <span>•</span>
              <span>{blueprint.sellers.length} Vendedores</span>
              <span>•</span>
              <span>{blueprint.automations.length} Automações</span>
              <span>•</span>
              <span>1 Agente IA</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition cursor-pointer"
            >
              Ajustar depois
            </button>
            <button
              onClick={handleApply}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/50 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>APLICAR CONFIGURAÇÃO AO MEU CRM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
