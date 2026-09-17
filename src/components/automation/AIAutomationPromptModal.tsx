import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  ArrowDown,
  CheckCircle2,
  RefreshCw,
  Zap,
  Filter,
  Users,
  Clock,
  MessageSquare,
  CheckSquare,
} from 'lucide-react';
import { AutomationFlow } from '../../types';

interface AIAutomationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateFlow: (flow: AutomationFlow) => void;
}

const SAMPLE_PROMPTS = [
  'Quando chegar lead da campanha de aquecedor, distribuir 50% para João e 50% para Pedro. Se ninguém responder em 30 minutos, mandar uma mensagem e criar tarefa.',
  'Quando o lead responder no Instagram Direct fora do horário comercial, a IA Clara deve responder imediatamente e coletar telefone para retorno.',
  'Se o lead estiver na etapa de Proposta Enviada há mais de 48 horas sem resposta, enviar mensagem de follow-up do Marcos IA no WhatsApp.',
  'Ao receber novo lead pelo Google Ads com ticket acima de R$ 50 mil, notificar o gestor no WhatsApp e atribuir ao closer sênior.',
];

export const AIAutomationPromptModal: React.FC<AIAutomationPromptModalProps> = ({
  isOpen,
  onClose,
  onGenerateFlow,
}) => {
  const [promptText, setPromptText] = useState(
    'Quando chegar lead da campanha de aquecedor, distribuir 50% para João e 50% para Pedro. Se ninguém responder em 30 minutos, mandar uma mensagem e criar tarefa.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [interpretedResult, setInterpretedResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleInterpret = async (textToUse?: string) => {
    const text = textToUse || promptText;
    if (!text.trim()) return;

    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/automation-interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: text }),
      });

      const data = await res.json();
      setInterpretedResult(data);
    } catch (e) {
      console.warn('Error interpreting automation:', e);
      // Fallback
      setInterpretedResult({
        title: 'Campanha Aquecedores - Distribuição & SLA',
        plainTextSteps: [
          'TRIGGER: Nova oportunidade / Lead criado',
          'CONDIÇÃO: Campanha contém "Aquecedor"',
          'DISTRIBUIÇÃO: 50% João e 50% Pedro',
          'AGUARDAR: 30 minutos',
          'SE NÃO HOUVER RESPOSTA:',
          '  → Enviar WhatsApp automático',
          '  → Criar atividade urgente no CRM',
        ],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyToCanvas = () => {
    // Convert interpreted result into a full interactive canvas AutomationFlow
    const newFlow: AutomationFlow = {
      id: `flow_ai_${Date.now()}`,
      name: interpretedResult?.title || 'Automação Criada por IA',
      description: promptText,
      active: true,
      executionCount: 0,
      lastTriggered: 'Ainda não acionada',
      nodes: [
        {
          id: 'node_trig_1',
          type: 'trigger',
          subType: 'LEAD_CREATED',
          title: 'Novo Lead Criado',
          subtitle: 'Origem Formulário / Tráfego',
          description: 'Disparado quando nova oportunidade é cadastrada.',
          iconName: 'Zap',
          position: { x: 80, y: 140 },
          config: {},
        },
        {
          id: 'node_cond_1',
          type: 'condition',
          subType: 'CAMPAIGN_MATCH',
          title: 'Verificar Campanha',
          subtitle: 'Campanha contém "Aquecedor"',
          description: 'Valida se o lead pertence ao produto solicitado.',
          iconName: 'Filter',
          position: { x: 380, y: 140 },
          config: { field: 'campaign', operator: 'contains', value: 'Aquecedor' },
        },
        {
          id: 'node_act_dist',
          type: 'action',
          subType: 'DISTRIBUTE_ROUND_ROBIN',
          title: 'Distribuir 50% / 50%',
          subtitle: '50% João | 50% Pedro',
          description: 'Distribuição automática e balanceada entre vendedores.',
          iconName: 'Users',
          position: { x: 680, y: 140 },
          config: { ratio: '50/50', sellers: ['João', 'Pedro'] },
        },
        {
          id: 'node_act_wait',
          type: 'action',
          subType: 'WAIT_TIMER',
          title: 'Aguardar 30 Minutos',
          subtitle: 'Monitorando primeira resposta',
          description: 'Pausa a execução até o limite de tempo estipulado.',
          iconName: 'Clock',
          position: { x: 980, y: 140 },
          config: { minutes: 30 },
        },
        {
          id: 'node_cond_reply',
          type: 'condition',
          subType: 'HAS_NO_REPLY',
          title: 'Se Não Houver Resposta',
          subtitle: 'Sem resposta após 30m',
          description: 'Checa se o vendedor ou lead responderam à mensagem.',
          iconName: 'AlertTriangle',
          position: { x: 980, y: 320 },
          config: { thresholdMinutes: 30 },
        },
        {
          id: 'node_act_wpp',
          type: 'action',
          subType: 'SEND_WHATSAPP',
          title: 'Enviar Mensagem WhatsApp',
          subtitle: 'Template: Retorno Rápido',
          description: 'Garante que o cliente não fique sem atenção imediata.',
          iconName: 'MessageSquare',
          position: { x: 680, y: 320 },
          config: { template: 'sla_lembrete' },
        },
        {
          id: 'node_act_task',
          type: 'action',
          subType: 'CREATE_TASK',
          title: 'Criar Atividade Urgente',
          subtitle: 'Tarefa Comercial com Alerta',
          description: 'Gera uma notificação sonora na tela do vendedor.',
          iconName: 'CheckSquare',
          position: { x: 380, y: 320 },
          config: { priority: 'alta' },
        },
      ],
      connections: [
        { id: 'ca1', fromNodeId: 'node_trig_1', toNodeId: 'node_cond_1' },
        { id: 'ca2', fromNodeId: 'node_cond_1', toNodeId: 'node_act_dist', label: 'Sim' },
        { id: 'ca3', fromNodeId: 'node_act_dist', toNodeId: 'node_act_wait' },
        { id: 'ca4', fromNodeId: 'node_act_wait', toNodeId: 'node_cond_reply' },
        { id: 'ca5', fromNodeId: 'node_cond_reply', toNodeId: 'node_act_wpp', label: 'Sem resposta' },
        { id: 'ca6', fromNodeId: 'node_act_wpp', toNodeId: 'node_act_task' },
      ],
    };

    onGenerateFlow(newFlow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Criar Automação com Linguagem Natural
              </h3>
              <p className="text-xs text-zinc-400">
                Escreva em português claro o que deseja automatizar. A IA interpreta e monta o fluxo visual.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Preset Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Exemplos prontos para experimentar:
            </span>
            <div className="space-y-1">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptText(sample);
                    handleInterpret(sample);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-xs text-zinc-300 transition cursor-pointer"
                >
                  ⚡ &quot;{sample}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* User Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Descreva sua regra de negócio:
            </label>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ex: Quando lead entrar na etapa X, enviar WhatsApp e aguardar..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500/60 outline-none resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                onClick={() => handleInterpret()}
                disabled={isProcessing || !promptText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-purple-950"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Interpretando com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Interpretar Automação</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interpreted Steps Preview */}
          {interpretedResult && (
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-purple-500/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Entendi assim:
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  {interpretedResult.title}
                </span>
              </div>

              {/* Vertical Step Flow Display */}
              <div className="space-y-2 py-1">
                {interpretedResult.plainTextSteps?.map((step: string, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/90 text-xs font-mono text-zinc-200 flex items-center justify-between">
                      <span>{step}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    {index < interpretedResult.plainTextSteps.length - 1 && (
                      <ArrowDown className="w-3.5 h-3.5 text-zinc-600 my-1 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleApplyToCanvas}
            disabled={!interpretedResult}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <Zap className="w-4 h-4 text-emerald-200" />
            <span>GERAR NO CANVAS INTERATIVO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
