import React, { useState } from 'react';
import {
  Pipeline,
  PipelineStage,
  FunnelAutomationRule,
  Seller,
} from '../../types';
import {
  X,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  MessageSquare,
  Users,
  Bot,
  Webhook,
  Bell,
  Copy,
  FolderKanban,
  Check,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FunnelBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pipelines: Pipeline[];
  activePipelineId: string;
  onSelectPipeline: (pipelineId: string) => void;
  onUpdatePipeline: (updatedPipeline: Pipeline) => void;
  onCreatePipeline: (newPipeline: Pipeline) => void;
  onDeletePipeline: (pipelineId: string) => void;
  sellers: Seller[];
  onShowToast: (message: string) => void;
}

const PRESET_COLORS = [
  { label: 'Índigo V4', hex: '#6366f1' },
  { label: 'Céu / Azul', hex: '#0ea5e9' },
  { label: 'Esmeralda', hex: '#10b981' },
  { label: 'Âmbar / Laranja', hex: '#f59e0b' },
  { label: 'Rosa / Magenta', hex: '#ec4899' },
  { label: 'Verde WhatsApp', hex: '#22c55e' },
  { label: 'Roxo IA', hex: '#8b5cf6' },
  { label: 'Vermelho V4', hex: '#ef4444' },
  { label: 'Ciano', hex: '#06b6d4' },
  { label: 'Grafite', hex: '#71717a' },
];

export const FunnelBuilderModal: React.FC<FunnelBuilderModalProps> = ({
  isOpen,
  onClose,
  pipelines,
  activePipelineId,
  onSelectPipeline,
  onUpdatePipeline,
  onCreatePipeline,
  onDeletePipeline,
  sellers,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'automations'>('stages');

  // Selected pipeline to edit (defaults to active pipeline)
  const [selectedPipeId, setSelectedPipeId] = useState<string>(activePipelineId);
  const currentPipeline = pipelines.find((p) => p.id === selectedPipeId) || pipelines[0];

  // Local state for editing stages of the selected pipeline
  const [pipelineName, setPipelineName] = useState(currentPipeline?.name || '');
  const [pipelineCategory, setPipelineCategory] = useState(currentPipeline?.category || '');
  const [pipelineDesc, setPipelineDesc] = useState(currentPipeline?.description || '');
  const [stages, setStages] = useState<PipelineStage[]>(currentPipeline?.stages || []);

  // Sync state if selected pipeline changes
  React.useEffect(() => {
    if (currentPipeline) {
      setPipelineName(currentPipeline.name);
      setPipelineCategory(currentPipeline.category || '');
      setPipelineDesc(currentPipeline.description || '');
      setStages(currentPipeline.stages || []);
    }
  }, [selectedPipeId, currentPipeline]);

  // Stage automation filter
  const [automationStageFilter, setAutomationStageFilter] = useState<string>('all');

  // New Stage Inline Form
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState('');
  const [newStageColor, setNewStageColor] = useState('#6366f1');
  const [newStageSLA, setNewStageSLA] = useState<number>(30);

  // New Funnel Modal state
  const [isCreatingFunnel, setIsCreatingFunnel] = useState(false);
  const [newFunnelName, setNewFunnelName] = useState('');
  const [newFunnelCategory, setNewFunnelCategory] = useState('Vendas Diretas');

  // New Rule Modal state
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [targetStageIdForRule, setTargetStageIdForRule] = useState<string>(
    stages[0]?.id || ''
  );
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState<FunnelAutomationRule['triggerType']>('stage_entered');
  const [newRuleAction, setNewRuleAction] = useState<FunnelAutomationRule['actionType']>('trigger_ai_sdr');
  const [newRuleMessageText, setNewRuleMessageText] = useState(
    'Olá {{nome}}! Aqui é da equipe V4. Recebemos seu interesse na {{empresa}} e gostaríamos de entender seu momento comercial.'
  );
  const [newRuleDelay, setNewRuleDelay] = useState<number>(0);
  const [newRuleWebhookUrl, setNewRuleWebhookUrl] = useState('https://api.v4autocrm.com/v1/webhook');

  // Simulation test state
  const [simulatingRuleId, setSimulatingRuleId] = useState<string | null>(null);

  if (!isOpen || !currentPipeline) return null;

  // Persist stage changes to the pipeline
  const savePipelineChanges = (updatedStages: PipelineStage[]) => {
    const updated: Pipeline = {
      ...currentPipeline,
      name: pipelineName,
      category: pipelineCategory,
      description: pipelineDesc,
      stages: updatedStages,
    };
    onUpdatePipeline(updated);
    setStages(updatedStages);
  };

  // Reorder Stage Left
  const handleMoveStageLeft = (index: number) => {
    if (index === 0) return;
    const newStages = [...stages];
    const temp = newStages[index - 1];
    newStages[index - 1] = newStages[index];
    newStages[index] = temp;
    const reordered = newStages.map((s, idx) => ({ ...s, order: idx + 1 }));
    savePipelineChanges(reordered);
    onShowToast(`Etapa "${reordered[index - 1].title}" reposicionada.`);
  };

  // Reorder Stage Right
  const handleMoveStageRight = (index: number) => {
    if (index === stages.length - 1) return;
    const newStages = [...stages];
    const temp = newStages[index + 1];
    newStages[index + 1] = newStages[index];
    newStages[index] = temp;
    const reordered = newStages.map((s, idx) => ({ ...s, order: idx + 1 }));
    savePipelineChanges(reordered);
    onShowToast(`Etapa "${reordered[index + 1].title}" reposicionada.`);
  };

  // Update Stage Title or Color or SLA
  const handleUpdateStageProperty = (
    stageId: string,
    field: keyof PipelineStage,
    value: any
  ) => {
    const updated = stages.map((st) =>
      st.id === stageId ? { ...st, [field]: value } : st
    );
    savePipelineChanges(updated);
  };

  // Add requirement tag
  const handleAddRequirement = (stageId: string, requirement: string) => {
    if (!requirement.trim()) return;
    const updated = stages.map((st) => {
      if (st.id === stageId) {
        const existing = st.mandatoryRequirements || [];
        if (existing.includes(requirement)) return st;
        return { ...st, mandatoryRequirements: [...existing, requirement.trim()] };
      }
      return st;
    });
    savePipelineChanges(updated);
  };

  // Remove requirement tag
  const handleRemoveRequirement = (stageId: string, reqIndex: number) => {
    const updated = stages.map((st) => {
      if (st.id === stageId) {
        const existing = [...(st.mandatoryRequirements || [])];
        existing.splice(reqIndex, 1);
        return { ...st, mandatoryRequirements: existing };
      }
      return st;
    });
    savePipelineChanges(updated);
  };

  // Delete Stage
  const handleDeleteStage = (stageId: string) => {
    if (stages.length <= 2) {
      onShowToast('O funil deve conter no mínimo 2 etapas para operação.');
      return;
    }
    const updated = stages
      .filter((st) => st.id !== stageId)
      .map((st, idx) => ({ ...st, order: idx + 1 }));
    savePipelineChanges(updated);
    onShowToast('Etapa removida com sucesso do funil.');
  };

  // Add New Stage
  const handleConfirmAddStage = () => {
    if (!newStageTitle.trim()) return;
    const newStage: PipelineStage = {
      id: `st_${Date.now()}`,
      title: newStageTitle.trim(),
      color: newStageColor,
      order: stages.length + 1,
      slaMinutes: newStageSLA,
      description: 'Nova etapa personalizada do processo comercial.',
      mandatoryRequirements: ['Informações básicas confirmadas'],
      automations: [],
    };
    const updated = [...stages, newStage];
    savePipelineChanges(updated);
    setNewStageTitle('');
    setIsAddingStage(false);
    onShowToast(`Nova etapa "${newStage.title}" adicionada com sucesso!`);
  };

  // Toggle Automation Rule
  const handleToggleRule = (stageId: string, ruleId: string) => {
    const updated = stages.map((st) => {
      if (st.id === stageId && st.automations) {
        return {
          ...st,
          automations: st.automations.map((r) =>
            r.id === ruleId ? { ...r, active: !r.active } : r
          ),
        };
      }
      return st;
    });
    savePipelineChanges(updated);
    onShowToast('Status da automação atualizado.');
  };

  // Delete Automation Rule
  const handleDeleteRule = (stageId: string, ruleId: string) => {
    const updated = stages.map((st) => {
      if (st.id === stageId && st.automations) {
        return {
          ...st,
          automations: st.automations.filter((r) => r.id !== ruleId),
        };
      }
      return st;
    });
    savePipelineChanges(updated);
    onShowToast('Regra de automação removida.');
  };

  // Create New Rule
  const handleConfirmCreateRule = () => {
    if (!newRuleName.trim()) return;

    let triggerLabel = 'Ao entrar na etapa';
    if (newRuleTrigger === 'time_in_stage_sla') triggerLabel = 'Tempo na etapa > SLA configurado';
    if (newRuleTrigger === 'temperature_hot') triggerLabel = 'Quando marcado como 🔥 Hot';
    if (newRuleTrigger === 'whatsapp_received') triggerLabel = 'Mensagem recebida do cliente no WhatsApp';
    if (newRuleTrigger === 'form_submitted') triggerLabel = 'Formulário de anúncio preenchido';

    let actionLabel = 'Ativar Agente SDR Virtual (IA)';
    if (newRuleAction === 'send_whatsapp') actionLabel = 'Enviar WhatsApp automático';
    if (newRuleAction === 'assign_seller_round_robin') actionLabel = 'Distribuir por Roleta Comercial Round-Robin';
    if (newRuleAction === 'send_slack_alert') actionLabel = 'Disparar alerta ao Gestor no WhatsApp / Slack';
    if (newRuleAction === 'call_webhook') actionLabel = 'Disparar Webhook REST para n8n / ERP';

    const newRule: FunnelAutomationRule = {
      id: `rule_${Date.now()}`,
      name: newRuleName.trim(),
      stageId: targetStageIdForRule,
      triggerType: newRuleTrigger,
      triggerLabel,
      actionType: newRuleAction,
      actionLabel,
      actionConfig: {
        templateText: newRuleMessageText,
        delayMinutes: newRuleDelay,
        webhookUrl: newRuleWebhookUrl,
      },
      active: true,
      executedCount: 0,
      lastExecuted: 'Criado agora',
    };

    const updated = stages.map((st) => {
      if (st.id === targetStageIdForRule) {
        return {
          ...st,
          automations: [...(st.automations || []), newRule],
        };
      }
      return st;
    });

    savePipelineChanges(updated);
    setIsCreatingRule(false);
    setNewRuleName('');
    onShowToast(`Automação "${newRule.name}" configurada com sucesso na etapa!`);
  };

  // Test Trigger Rule Simulation
  const handleSimulateRule = (rule: FunnelAutomationRule) => {
    setSimulatingRuleId(rule.id);
    setTimeout(() => {
      setSimulatingRuleId(null);
      // Increment execution count
      const updated = stages.map((st) => {
        if (st.id === rule.stageId && st.automations) {
          return {
            ...st,
            automations: st.automations.map((r) =>
              r.id === rule.id
                ? {
                    ...r,
                    executedCount: r.executedCount + 1,
                    lastExecuted: 'Agora mesmo (Simulação)',
                  }
                : r
            ),
          };
        }
        return st;
      });
      savePipelineChanges(updated);
      onShowToast(
        `Disparo de teste bem-sucedido! Ação "${rule.actionLabel}" executada para o lead de homologação.`
      );
    }, 1200);
  };

  // Create New Funnel Handler
  const handleConfirmCreateFunnel = () => {
    if (!newFunnelName.trim()) return;
    const newPipe: Pipeline = {
      id: `pipe_${Date.now()}`,
      name: newFunnelName.trim(),
      category: newFunnelCategory,
      description: 'Funil comercial criado no construtor.',
      stages: [
        { id: `st_${Date.now()}_1`, title: 'Novo Lead', color: '#6366f1', order: 1, slaMinutes: 15, automations: [] },
        { id: `st_${Date.now()}_2`, title: 'Qualificação', color: '#0ea5e9', order: 2, slaMinutes: 60, automations: [] },
        { id: `st_${Date.now()}_3`, title: 'Apresentação / Proposta', color: '#f59e0b', order: 3, slaMinutes: 120, automations: [] },
        { id: `st_${Date.now()}_4`, title: 'Venda Concluída', color: '#22c55e', order: 4, slaMinutes: 0, automations: [] },
      ],
    };
    onCreatePipeline(newPipe);
    setSelectedPipeId(newPipe.id);
    setIsCreatingFunnel(false);
    setNewFunnelName('');
    onShowToast(`Novo Funil "${newPipe.name}" criado com 4 etapas padrão!`);
  };

  // All automations combined for display in tab 2
  const allRules: { stage: PipelineStage; rule: FunnelAutomationRule }[] = [];
  stages.forEach((st) => {
    (st.automations || []).forEach((rule) => {
      if (automationStageFilter === 'all' || automationStageFilter === st.id) {
        allRules.push({ stage: st, rule });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden">
      <div className="w-full max-w-5xl h-[90vh] bg-v4-dark border border-v4-border/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* ========================================================================= */}
        {/* Modal Top Bar                                                             */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 border-b border-v4-border/30 bg-v4-surface/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-v4-primary/10 border border-v4-primary/25 flex items-center justify-center text-v4-primary shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold text-v4-text tracking-tight">
                  Construtor de Funis & Automações de Etapa
                </h2>
                <span className="text-[10px] font-mono bg-v4-primary/15 text-v4-primary px-2 py-0.5 rounded font-semibold border border-v4-primary/25">
                  V4 ENGINE
                </span>
              </div>
              <p className="text-xs text-v4-muted">
                Modele as etapas do seu processo comercial, SLAs de atendimento e regras automáticas de conversão.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Pipeline Selector Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedPipeId}
                onChange={(e) => {
                  setSelectedPipeId(e.target.value);
                  onSelectPipeline(e.target.value);
                }}
                className="h-8.5 bg-v4-surface border border-v4-border/40 rounded-lg px-3 text-xs text-v4-text font-medium outline-none hover:border-zinc-600 focus:border-v4-primary transition cursor-pointer"
              >
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isDefault ? '(Padrão)' : ''}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsCreatingFunnel(true)}
                title="Criar novo funil"
                className="h-8.5 px-3 rounded-lg bg-v4-surface hover:bg-v4-elevated border border-v4-border/40 text-v4-text text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-v4-primary" />
                <span className="hidden sm:inline">Novo Funil</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8.5 h-8.5 rounded-lg bg-v4-surface hover:bg-v4-elevated border border-v4-border/30 text-v4-muted hover:text-v4-text flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Navigation Tabs: Estrutura vs Automações                                  */}
        {/* ========================================================================= */}
        <div className="px-6 py-2.5 border-b border-v4-border/25 bg-v4-surface/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'stages'
                  ? 'bg-v4-primary text-white shadow-xs'
                  : 'text-v4-muted hover:text-v4-text bg-v4-surface/60 border border-v4-border/30'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Estrutura das Etapas ({stages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('automations')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'automations'
                  ? 'bg-v4-primary text-white shadow-xs'
                  : 'text-v4-muted hover:text-v4-text bg-v4-surface/60 border border-v4-border/30'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Automações das Etapas ({allRules.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-v4-muted hidden sm:flex items-center gap-2 font-mono">
            <span>Funil ativo:</span>
            <span className="text-v4-text font-semibold">{currentPipeline.name}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: Estrutura das Etapas (Stage Architect)                             */}
        {/* ========================================================================= */}
        {activeTab === 'stages' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Funnel Meta Editor Card */}
            <div className="p-4 rounded-xl bg-v4-surface/40 border border-v4-border/30 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-v4-muted uppercase tracking-wider block">
                  Nome do Funil
                </label>
                <input
                  type="text"
                  value={pipelineName}
                  onChange={(e) => {
                    setPipelineName(e.target.value);
                    onUpdatePipeline({ ...currentPipeline, name: e.target.value });
                  }}
                  className="w-full bg-v4-dark border border-v4-border/40 rounded-lg px-3 py-1.5 text-xs text-v4-text font-medium outline-none focus:border-v4-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-v4-muted uppercase tracking-wider block">
                  Categoria
                </label>
                <input
                  type="text"
                  value={pipelineCategory}
                  onChange={(e) => {
                    setPipelineCategory(e.target.value);
                    onUpdatePipeline({ ...currentPipeline, category: e.target.value });
                  }}
                  className="w-full bg-v4-dark border border-v4-border/40 rounded-lg px-3 py-1.5 text-xs text-v4-text font-medium outline-none focus:border-v4-primary"
                />
              </div>
            </div>

            {/* Stages Flow Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-v4-text">Etapas do Pipeline</h3>
                <p className="text-xs text-v4-muted">
                  Defina o fluxo ordenado de avanço do lead, tempo máximo (SLA) e requisitos.
                </p>
              </div>

              <button
                onClick={() => setIsAddingStage(true)}
                className="h-8 px-3 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Etapa</span>
              </button>
            </div>

            {/* Add Stage Inline Drawer */}
            {isAddingStage && (
              <div className="p-4 rounded-xl bg-v4-dark border border-v4-primary/40 shadow-lg space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-v4-text">Nova Etapa do Funil</span>
                  <button
                    onClick={() => setIsAddingStage(false)}
                    className="text-v4-muted hover:text-v4-text p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] text-v4-muted">Título da Etapa</label>
                    <input
                      type="text"
                      placeholder="Ex: Reunião de Fechamento"
                      value={newStageTitle}
                      onChange={(e) => setNewStageTitle(e.target.value)}
                      className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-1.5 text-xs text-v4-text outline-none focus:border-v4-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-v4-muted">SLA Máximo (Minutos)</label>
                    <select
                      value={newStageSLA}
                      onChange={(e) => setNewStageSLA(Number(e.target.value))}
                      className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-1.5 text-xs text-v4-text outline-none focus:border-v4-primary cursor-pointer"
                    >
                      <option value={15}>15 minutos (Resposta Rápida)</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                      <option value={240}>4 horas</option>
                      <option value={1440}>24 horas (1 dia)</option>
                      <option value={2880}>48 horas (2 dias)</option>
                      <option value={0}>Sem SLA (Etapa final)</option>
                    </select>
                  </div>
                </div>

                {/* Color presets */}
                <div className="space-y-1">
                  <label className="text-[11px] text-v4-muted block">Cor Indicadora da Etapa</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setNewStageColor(c.hex)}
                        title={c.label}
                        className={`w-6 h-6 rounded-full transition flex items-center justify-center cursor-pointer border ${
                          newStageColor === c.hex ? 'ring-2 ring-white scale-110' : 'border-black/30'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {newStageColor === c.hex && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-v4-border/20">
                  <button
                    onClick={() => setIsAddingStage(false)}
                    className="px-3 py-1.5 rounded-lg bg-v4-surface hover:bg-v4-elevated text-v4-text text-xs border border-v4-border/30 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmAddStage}
                    className="px-4 py-1.5 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer shadow-xs"
                  >
                    Salvar Etapa
                  </button>
                </div>
              </div>
            )}

            {/* Stages Cards List */}
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const stageAutomationsCount = (stage.automations || []).length;

                return (
                  <div
                    key={stage.id}
                    className="p-4 rounded-xl bg-v4-dark border border-v4-border/35 hover:border-v4-border/70 transition space-y-3 group shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Position badge, color pill & title editor */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded bg-v4-surface border border-v4-border/30 text-v4-muted font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: stage.color }}
                        />

                        <input
                          type="text"
                          value={stage.title}
                          onChange={(e) =>
                            handleUpdateStageProperty(stage.id, 'title', e.target.value)
                          }
                          className="bg-transparent border-b border-transparent hover:border-v4-border focus:border-v4-primary font-semibold text-xs text-v4-text px-1 py-0.5 outline-none transition max-w-[240px]"
                        />

                        {/* SLA Badge */}
                        <div className="flex items-center gap-1 text-[11px] font-mono text-v4-muted bg-v4-surface/80 border border-v4-border/25 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>
                            {stage.slaMinutes && stage.slaMinutes > 0
                              ? `${stage.slaMinutes} min SLA`
                              : 'Sem SLA'}
                          </span>
                        </div>

                        {/* Automations count badge */}
                        <button
                          onClick={() => {
                            setAutomationStageFilter(stage.id);
                            setActiveTab('automations');
                          }}
                          className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded hover:bg-emerald-500/20 transition cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>{stageAutomationsCount} automações</span>
                        </button>
                      </div>

                      {/* Right: Reorder & Delete buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleMoveStageLeft(idx)}
                          disabled={idx === 0}
                          title="Mover para a esquerda / cima"
                          className="w-7 h-7 rounded bg-v4-surface hover:bg-v4-elevated border border-v4-border/30 text-v4-muted hover:text-v4-text flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleMoveStageRight(idx)}
                          disabled={idx === stages.length - 1}
                          title="Mover para a direita / baixo"
                          className="w-7 h-7 rounded bg-v4-surface hover:bg-v4-elevated border border-v4-border/30 text-v4-muted hover:text-v4-text flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteStage(stage.id)}
                          title="Excluir etapa"
                          className="w-7 h-7 rounded bg-v4-surface hover:bg-rose-500/15 border border-v4-border/30 text-v4-muted hover:text-rose-400 flex items-center justify-center cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Operational script & Requirements editor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                      {/* Description / Sales rep playbook */}
                      <div>
                        <label className="text-[10px] font-mono text-v4-muted uppercase tracking-wider block mb-1">
                          Guia Operacional do Vendedor
                        </label>
                        <input
                          type="text"
                          placeholder="Instruções para o SDR / Closer nesta etapa..."
                          value={stage.description || ''}
                          onChange={(e) =>
                            handleUpdateStageProperty(stage.id, 'description', e.target.value)
                          }
                          className="w-full bg-v4-surface/60 border border-v4-border/25 rounded-lg px-2.5 py-1.5 text-[11px] text-v4-muted focus:text-v4-text outline-none focus:border-v4-primary/60"
                        />
                      </div>

                      {/* Mandatory Requirements Checklist */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-v4-muted uppercase tracking-wider block">
                            Requisitos Obrigatórios para Avançar
                          </label>
                          <button
                            onClick={() => {
                              const req = prompt('Digite o requisito obrigatório (ex: Valor da Proposta preenchido):');
                              if (req) handleAddRequirement(stage.id, req);
                            }}
                            className="text-[10px] text-v4-primary hover:underline cursor-pointer flex items-center gap-1 font-medium"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Adicionar</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap min-h-[30px]">
                          {(stage.mandatoryRequirements || []).map((req, rIdx) => (
                            <span
                              key={rIdx}
                              className="text-[10px] font-mono bg-v4-surface text-v4-text border border-v4-border/30 px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              <span>{req}</span>
                              <button
                                onClick={() => handleRemoveRequirement(stage.id, rIdx)}
                                className="text-v4-muted hover:text-rose-400 p-0.5 cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                          {(!stage.mandatoryRequirements || stage.mandatoryRequirements.length === 0) && (
                            <span className="text-[11px] text-v4-muted italic">Nenhum requisito bloqueante.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: Automações das Etapas do Funil (Automation Engine)                  */}
        {/* ========================================================================= */}
        {activeTab === 'automations' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Top Filter and Add Rule Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-v4-muted">Filtrar por etapa:</span>
                <select
                  value={automationStageFilter}
                  onChange={(e) => setAutomationStageFilter(e.target.value)}
                  className="h-8 bg-v4-surface border border-v4-border/40 rounded-lg px-2.5 text-xs text-v4-text outline-none focus:border-v4-primary cursor-pointer"
                >
                  <option value="all">Todas as Etapas ({allRules.length} regras)</option>
                  {stages.map((st) => (
                    <option key={st.id} value={st.id}>
                      Etapa: {st.title} ({st.automations?.length || 0})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setTargetStageIdForRule(stages[0]?.id || '');
                  setIsCreatingRule(true);
                }}
                className="h-8 px-3.5 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Automação para Etapa</span>
              </button>
            </div>

            {/* Automation Rules Grid */}
            <div className="space-y-3">
              {allRules.map(({ stage, rule }) => {
                const isSimulating = simulatingRuleId === rule.id;

                return (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border transition space-y-3 ${
                      rule.active
                        ? 'bg-v4-dark border-v4-border/40 hover:border-v4-border/70'
                        : 'bg-v4-dark/50 border-v4-border/20 opacity-65'
                    }`}
                  >
                    {/* Header: Stage Tag + Name + Active Switch */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="text-[11px] font-mono text-v4-muted bg-v4-surface px-2 py-0.5 rounded border border-v4-border/30">
                          Etapa: {stage.title}
                        </span>
                        <h4 className="text-xs font-semibold text-v4-text truncate">
                          {rule.name}
                        </h4>
                      </div>

                      {/* Right: Active switch & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleRule(stage.id, rule.id)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 ${
                            rule.active
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              rule.active ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                            }`}
                          />
                          <span>{rule.active ? 'Ativa' : 'Pausada'}</span>
                        </button>

                        <button
                          onClick={() => handleSimulateRule(rule)}
                          disabled={isSimulating}
                          title="Simular disparo de teste"
                          className="h-7 px-2 rounded bg-v4-surface hover:bg-v4-elevated border border-v4-border/30 text-v4-text text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <Play
                            className={`w-3 h-3 text-v4-primary ${
                              isSimulating ? 'animate-spin' : ''
                            }`}
                          />
                          <span>{isSimulating ? 'Testando...' : 'Testar'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteRule(stage.id, rule.id)}
                          title="Excluir regra"
                          className="w-7 h-7 rounded bg-v4-surface hover:bg-rose-500/15 border border-v4-border/30 text-v4-muted hover:text-rose-400 flex items-center justify-center cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Trigger -> Action Visual Flow Box */}
                    <div className="p-3 rounded-lg bg-v4-surface/50 border border-v4-border/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      {/* Trigger Pill */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-v4-muted block uppercase font-mono">Gatilho (Trigger)</span>
                          <span className="text-xs font-semibold text-v4-text">{rule.triggerLabel}</span>
                        </div>
                      </div>

                      <div className="hidden sm:block text-v4-muted">
                        <ArrowRight className="w-4 h-4" />
                      </div>

                      {/* Action Pill */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-v4-muted block uppercase font-mono">Ação Executada</span>
                          <span className="text-xs font-semibold text-emerald-400">{rule.actionLabel}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right font-mono text-[11px] text-v4-muted shrink-0 border-t sm:border-t-0 sm:border-l border-v4-border/25 pt-2 sm:pt-0 sm:pl-3">
                        <span className="block font-semibold text-v4-text">{rule.executedCount} execuções</span>
                        <span className="text-[10px]">{rule.lastExecuted || 'Nunca disparada'}</span>
                      </div>
                    </div>

                    {/* Config Preview if template text exists */}
                    {rule.actionConfig?.templateText && (
                      <div className="p-2.5 rounded bg-zinc-950/70 border border-v4-border/20 text-[11px] text-v4-muted font-mono">
                        <span className="text-v4-text font-semibold mr-1">Mensagem enviada:</span>
                        <span className="text-zinc-300 italic">"{rule.actionConfig.templateText}"</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {allRules.length === 0 && (
                <div className="p-10 border border-dashed border-v4-border/40 rounded-xl text-center space-y-2">
                  <Zap className="w-6 h-6 text-v4-muted mx-auto" />
                  <p className="text-xs font-semibold text-v4-text">Nenhuma regra cadastrada nesta etapa</p>
                  <p className="text-[11px] text-v4-muted max-w-sm mx-auto">
                    Crie sua primeira automação para enviar WhatsApp com IA, distribuir vendedores ou alertar estouros de SLA.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: Nova Regra de Automação para Etapa                                */}
        {/* ========================================================================= */}
        {isCreatingRule && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-v4-dark border border-v4-border/50 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-v4-text">
                    Nova Regra de Automação de Funil
                  </h3>
                  <p className="text-xs text-v4-muted">
                    Configure quando a ação deve disparar e quais mensagens ou integrações acionar.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingRule(false)}
                  className="text-v4-muted hover:text-v4-text p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Rule Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-v4-muted">Nome da Regra</label>
                  <input
                    type="text"
                    placeholder="Ex: Disparo de Primeiro Contato com SDR IA"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-2 text-xs text-v4-text outline-none focus:border-v4-primary"
                  />
                </div>

                {/* Target Stage */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-v4-muted">Etapa do Funil</label>
                  <select
                    value={targetStageIdForRule}
                    onChange={(e) => setTargetStageIdForRule(e.target.value)}
                    className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-2 text-xs text-v4-text outline-none focus:border-v4-primary cursor-pointer"
                  >
                    {stages.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.title} (Ordem {st.order})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trigger Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-v4-muted">Gatilho de Disparo</label>
                  <select
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value as any)}
                    className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-2 text-xs text-v4-text outline-none focus:border-v4-primary cursor-pointer"
                  >
                    <option value="stage_entered">⚡ Ao entrar na etapa (imediatamente)</option>
                    <option value="time_in_stage_sla">⏱️ Tempo parado na etapa &gt; SLA (ocioso)</option>
                    <option value="temperature_hot">🔥 Quando lead for classificado como Hot</option>
                    <option value="whatsapp_received">💬 Mensagem recebida do cliente no WhatsApp</option>
                    <option value="form_submitted">📋 Formulário de anúncio preenchido</option>
                  </select>
                </div>

                {/* Action Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-v4-muted">Ação a Executar</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as any)}
                    className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-2 text-xs text-v4-text outline-none focus:border-v4-primary cursor-pointer"
                  >
                    <option value="trigger_ai_sdr">🤖 Ativar Agente SDR Virtual (IA V4)</option>
                    <option value="send_whatsapp">📲 Enviar Mensagem Automática no WhatsApp</option>
                    <option value="assign_seller_round_robin">👥 Distribuir Vendedor via Roleta Round-Robin</option>
                    <option value="send_slack_alert">🚨 Alerta no Slack / WhatsApp do Gestor</option>
                    <option value="call_webhook">🌐 Chamar Webhook REST (n8n, Make, ERP)</option>
                  </select>
                </div>

                {/* WhatsApp Template editor if action sends message */}
                {(newRuleAction === 'send_whatsapp' || newRuleAction === 'trigger_ai_sdr') && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-v4-muted">
                        Template da Mensagem (Variáveis disponíveis)
                      </label>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-v4-primary">
                        <span>{`{{nome}}`}</span> • <span>{`{{empresa}}`}</span>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={newRuleMessageText}
                      onChange={(e) => setNewRuleMessageText(e.target.value)}
                      className="w-full bg-v4-surface border border-v4-border/40 rounded-lg p-2.5 text-xs text-v4-text outline-none focus:border-v4-primary resize-none"
                    />
                  </div>
                )}

                {/* Webhook URL if action is call_webhook */}
                {newRuleAction === 'call_webhook' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-v4-muted">URL do Webhook Endpoint</label>
                    <input
                      type="text"
                      value={newRuleWebhookUrl}
                      onChange={(e) => setNewRuleWebhookUrl(e.target.value)}
                      className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-2 text-xs text-v4-text font-mono outline-none focus:border-v4-primary"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-v4-border/30">
                <button
                  onClick={() => setIsCreatingRule(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-v4-surface hover:bg-v4-elevated text-v4-text text-xs border border-v4-border/30 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmCreateRule}
                  className="px-4 py-1.5 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer shadow-xs"
                >
                  Salvar Regra
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: Criar Novo Funil                                                   */}
        {/* ========================================================================= */}
        {isCreatingFunnel && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-v4-dark border border-v4-border/50 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-v4-text">Criar Novo Funil</h3>
                  <p className="text-xs text-v4-muted">Defina o nome e segmento do pipeline comercial.</p>
                </div>
                <button
                  onClick={() => setIsCreatingFunnel(false)}
                  className="text-v4-muted hover:text-v4-text p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-v4-muted">Nome do Funil</label>
                  <input
                    type="text"
                    placeholder="Ex: Funil Inbound B2B Enterprise"
                    value={newFunnelName}
                    onChange={(e) => setNewFunnelName(e.target.value)}
                    className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-2 text-xs text-v4-text outline-none focus:border-v4-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-v4-muted">Segmento / Categoria</label>
                  <select
                    value={newFunnelCategory}
                    onChange={(e) => setNewFunnelCategory(e.target.value)}
                    className="w-full bg-v4-surface border border-v4-border/40 rounded-lg px-3 py-2 text-xs text-v4-text outline-none focus:border-v4-primary cursor-pointer"
                  >
                    <option value="Vendas Diretas">Vendas Diretas</option>
                    <option value="Inbound & Tráfego">Inbound & Tráfego</option>
                    <option value="Outbound B2B">Outbound B2B</option>
                    <option value="Parcerias & Franquias">Parcerias & Franquias</option>
                    <option value="E-commerce & WhatsApp">E-commerce & WhatsApp</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-v4-border/30">
                <button
                  onClick={() => setIsCreatingFunnel(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-v4-surface hover:bg-v4-elevated text-v4-text text-xs border border-v4-border/30 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmCreateFunnel}
                  className="px-4 py-1.5 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white text-xs font-medium transition cursor-pointer shadow-xs"
                >
                  Criar Funil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-v4-border/30 bg-v4-surface/30 flex items-center justify-between shrink-0 text-xs">
          <span className="text-v4-muted text-[11px]">
            Modificações salvas instantaneamente no ambiente operacional.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-v4-primary hover:bg-v4-primary-hover text-white font-medium transition cursor-pointer shadow-xs"
          >
            Concluir & Voltar ao Kanban
          </button>
        </div>
      </div>
    </div>
  );
};
