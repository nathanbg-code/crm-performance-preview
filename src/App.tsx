import React, { useState } from 'react';
import {
  INITIAL_SELLERS,
  INITIAL_PIPELINE,
  INITIAL_PIPELINES,
  INITIAL_LEADS,
  INITIAL_CONVERSATIONS,
  INITIAL_AUTOMATIONS,
  INITIAL_AI_AGENTS,
} from './data/initialData';
import {
  Lead,
  Pipeline,
  Seller,
  Conversation,
  AutomationFlow,
  AIAgent,
  CRMConfigProposal,
} from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { PipelineKanban } from './components/pipeline/PipelineKanban';
import { OmnichannelInbox } from './components/inbox/OmnichannelInbox';
import { LeadDetailDrawer } from './components/lead/LeadDetailDrawer';
import { AutomationWorkspace } from './components/automation/AutomationWorkspace';
import { AIAgentsView } from './components/ai-agents/AIAgentsView';
import { OperationalDashboard } from './components/dashboard/OperationalDashboard';
import { ContactsView } from './components/contacts/ContactsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { AIOnboardingModal } from './components/onboarding/AIOnboardingModal';
import { QuickCreateModal } from './components/common/QuickCreateModal';
import { CommandPalette } from './components/common/CommandPalette';
import { FunnelBuilderModal } from './components/funnel/FunnelBuilderModal';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('crm');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core CRM Domain States
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [pipelines, setPipelines] = useState<Pipeline[]>(INITIAL_PIPELINES);
  const [activePipelineId, setActivePipelineId] = useState<string>(INITIAL_PIPELINES[0].id);

  // Active Pipeline resolved from pipelines list
  const pipeline = pipelines.find((p) => p.id === activePipelineId) || pipelines[0];

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [automations, setAutomations] = useState<AutomationFlow[]>(INITIAL_AUTOMATIONS);
  const [aiAgents, setAiAgents] = useState<AIAgent[]>(INITIAL_AI_AGENTS);
  const [currentFlowId, setCurrentFlowId] = useState<string>(INITIAL_AUTOMATIONS[0].id);

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [isAIOnboardingOpen, setIsAIOnboardingOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateStageId, setQuickCreateStageId] = useState<string | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFunnelBuilderOpen, setIsFunnelBuilderOpen] = useState(false);

  // Success Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Move Lead Stage
  const handleMoveLeadStage = (leadId: string, newStageId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stageId: newStageId } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stageId: newStageId } : null));
    }
  };

  // Open Inbox directly on a specific lead's chat
  const handleOpenInbox = (leadId: string) => {
    const conv = conversations.find((c) => c.leadId === leadId);
    if (conv) {
      setSelectedConvId(conv.id);
    }
    setActiveTab('inbox');
    setSelectedLead(null);
  };

  // Send Message in Inbox
  const handleSendMessage = (convId: string, text: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessageText: text,
            lastMessageTime: 'Agora',
            unreadCount: 0,
            messages: [
              ...c.messages,
              {
                id: `msg_${Date.now()}`,
                sender: 'seller',
                senderName: 'João Victor Ribeiro',
                text,
                timestamp: timeStr,
                status: 'sent',
                channel: c.channel,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  // Apply AI Generated Proposal
  const handleApplyAIConfig = (proposal: CRMConfigProposal) => {
    // 1. Build newly configured Pipeline
    const newStages = proposal.pipelineStages.map((stName, idx) => {
      const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
      return {
        id: `stage_ai_${idx + 1}`,
        title: stName,
        order: idx + 1,
        color: colors[idx % colors.length],
        slaMinutes: idx === 0 ? 15 : idx === 1 ? 45 : 120,
      };
    });

    const newPipeline: Pipeline = {
      id: `pipe_ai_${Date.now()}`,
      name: `Funil Inteligente: ${proposal.segment}`,
      stages: newStages,
    };
    setPipelines((prev) => [newPipeline, ...prev]);
    setActivePipelineId(newPipeline.id);

    // 2. Re-assign leads to appropriate new stage
    setLeads((prev) =>
      prev.map((lead, i) => ({
        ...lead,
        stageId: newStages[i % newStages.length].id,
      }))
    );

    // 3. Register AI Generated Automation Flow
    const newFlow: AutomationFlow = {
      id: `flow_ai_${Date.now()}`,
      name: `Regras de Negócio: ${proposal.segment}`,
      description: `Gerado automaticamente via Onboarding IA para ${proposal.origins.join(', ')}`,
      active: true,
      executionCount: 1,
      lastTriggered: 'Agora mesmo',
      nodes: [
        {
          id: 'n_trig',
          type: 'trigger',
          subType: 'LEAD_CREATED',
          title: 'Novo Lead Registrado',
          subtitle: proposal.origins[0] || 'WhatsApp / Meta Ads',
          description: 'Captura imediata de novas conversas e formulários.',
          iconName: 'Zap',
          position: { x: 80, y: 120 },
          config: {},
        },
        {
          id: 'n_dist',
          type: 'action',
          subType: 'DISTRIBUTE_ROUND_ROBIN',
          title: 'Distribuição Inteligente',
          subtitle: `${proposal.sellers.length} vendedores cadastrados`,
          description: 'Distribuição automática em formato Round-Robin balanceado.',
          iconName: 'Users',
          position: { x: 380, y: 120 },
          config: {},
        },
        {
          id: 'n_sdr',
          type: 'action',
          subType: 'AI_SDR_TRIGGER',
          title: 'Primeiro Contato com IA',
          subtitle: proposal.allocatedAgent,
          description: 'Resposta em menos de 15 segundos no WhatsApp do cliente.',
          iconName: 'Bot',
          position: { x: 680, y: 120 },
          config: {},
        },
      ],
      connections: [
        { id: 'c1', fromNodeId: 'n_trig', toNodeId: 'n_dist' },
        { id: 'c2', fromNodeId: 'n_dist', toNodeId: 'n_sdr' },
      ],
    };

    setAutomations([newFlow, ...automations]);
    setCurrentFlowId(newFlow.id);

    showToast(
      `Configuração aplicada com sucesso! Funil "${proposal.segment}" com ${newStages.length} etapas e automações ativas.`
    );
    setActiveTab('crm');
  };

  // Add new lead
  const handleCreateLead = (newLead: Lead) => {
    setLeads([newLead, ...leads]);
    showToast(`Lead "${newLead.name}" criado com sucesso na etapa correspondente.`);
  };

  // Funnel Pipeline Management Handlers
  const handleUpdatePipeline = (updatedPipeline: Pipeline) => {
    setPipelines((prev) =>
      prev.map((p) => (p.id === updatedPipeline.id ? updatedPipeline : p))
    );
    showToast(`Funil "${updatedPipeline.name}" atualizado.`);
  };

  const handleCreatePipeline = (newPipeline: Pipeline) => {
    setPipelines((prev) => [...prev, newPipeline]);
    setActivePipelineId(newPipeline.id);
    showToast(`Funil "${newPipeline.name}" criado com sucesso!`);
  };

  const handleDeletePipeline = (pipelineId: string) => {
    if (pipelines.length <= 1) {
      showToast('O sistema precisa de pelo menos 1 funil cadastrado.');
      return;
    }
    const remaining = pipelines.filter((p) => p.id !== pipelineId);
    setPipelines(remaining);
    if (activePipelineId === pipelineId) {
      setActivePipelineId(remaining[0].id);
    }
    showToast('Funil removido com sucesso.');
  };

  // Counters
  const unreadInboxCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const slaAlertCount = leads.filter((l) => l.slaMinutesRemaining <= 0).length;

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unreadInboxCount={unreadInboxCount}
        slaAlertCount={slaAlertCount}
        onOpenAIOnboarding={() => setIsAIOnboardingOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Navbar */}
        <Navbar
          currentPipeline={pipeline}
          pipelines={pipelines}
          onSelectPipeline={setActivePipelineId}
          onOpenFunnelBuilder={() => setIsFunnelBuilderOpen(true)}
          onOpenAIOnboarding={() => setIsAIOnboardingOpen(true)}
          onOpenQuickCreate={() => {
            setQuickCreateStageId(undefined);
            setIsQuickCreateOpen(true);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          unreadCount={unreadInboxCount + slaAlertCount}
        />

        {/* View Router */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeTab === 'crm' && (
            <PipelineKanban
              pipeline={pipeline}
              pipelines={pipelines}
              onSelectPipeline={setActivePipelineId}
              leads={leads}
              sellers={sellers}
              onLeadClick={(lead) => setSelectedLead(lead)}
              onOpenInbox={handleOpenInbox}
              onMoveLeadStage={handleMoveLeadStage}
              onQuickAddLead={(stageId) => {
                setQuickCreateStageId(stageId);
                setIsQuickCreateOpen(true);
              }}
              onOpenAIOnboarding={() => setIsAIOnboardingOpen(true)}
              onOpenFunnelBuilder={() => setIsFunnelBuilderOpen(true)}
            />
          )}

          {activeTab === 'inbox' && (
            <OmnichannelInbox
              conversations={conversations}
              leads={leads}
              pipeline={pipeline}
              sellers={sellers}
              selectedConversationId={selectedConvId}
              onSelectConversation={setSelectedConvId}
              onSendMessage={handleSendMessage}
              onUpdateLeadStage={handleMoveLeadStage}
              onOpenLeadDetail={(lead) => setSelectedLead(lead)}
            />
          )}

          {activeTab === 'dashboard' && (
            <OperationalDashboard
              leads={leads}
              sellers={sellers}
              pipeline={pipeline}
              onOpenInbox={handleOpenInbox}
              onSelectLead={(lead) => setSelectedLead(lead)}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsView
              leads={leads}
              sellers={sellers}
              pipeline={pipeline}
              onSelectLead={(lead) => setSelectedLead(lead)}
              onOpenInbox={handleOpenInbox}
              onQuickCreate={() => setIsQuickCreateOpen(true)}
            />
          )}

          {activeTab === 'automations' && (
            <AutomationWorkspace
              flows={automations}
              currentFlowId={currentFlowId}
              onSelectFlow={setCurrentFlowId}
              onUpdateFlow={(updated) =>
                setAutomations((prev) =>
                  prev.map((f) => (f.id === updated.id ? updated : f))
                )
              }
              onAddNewFlow={(newFlow) => {
                setAutomations([newFlow, ...automations]);
                setCurrentFlowId(newFlow.id);
                showToast(`Automação "${newFlow.name}" gerada no canvas!`);
              }}
              pipeline={pipeline}
              onOpenFunnelBuilder={() => setIsFunnelBuilderOpen(true)}
            />
          )}

          {activeTab === 'ai_agents' && (
            <AIAgentsView
              agents={aiAgents}
              onUpdateAgent={(updated) =>
                setAiAgents((prev) =>
                  prev.map((a) => (a.id === updated.id ? updated : a))
                )
              }
            />
          )}

          {activeTab === 'integrations' && <IntegrationsView />}

          {(activeTab === 'reports' || activeTab === 'settings') && (
            <OperationalDashboard
              leads={leads}
              sellers={sellers}
              pipeline={pipeline}
              onOpenInbox={handleOpenInbox}
              onSelectLead={(lead) => setSelectedLead(lead)}
            />
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* Global Overlays & Modals                                                  */}
      {/* ========================================================================= */}

      {/* Lead Detail Side Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        pipeline={pipeline}
        sellers={sellers}
        onClose={() => setSelectedLead(null)}
        onUpdateLeadStage={handleMoveLeadStage}
        onOpenInbox={handleOpenInbox}
      />

      {/* Flagship: Conversational AI Onboarding Modal */}
      <AIOnboardingModal
        isOpen={isAIOnboardingOpen}
        onClose={() => setIsAIOnboardingOpen(false)}
        onApplyConfig={handleApplyAIConfig}
        currentSellers={sellers}
      />

      {/* Quick Create Deal/Lead Modal */}
      <QuickCreateModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        pipeline={pipeline}
        sellers={sellers}
        defaultStageId={quickCreateStageId}
        onCreateLead={handleCreateLead}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onOpenAIOnboarding={() => setIsAIOnboardingOpen(true)}
        onOpenQuickCreate={() => setIsQuickCreateOpen(true)}
        leads={leads}
        onSelectLead={(lead) => setSelectedLead(lead)}
      />

      {/* Funnel Builder & Stage Automations Modal */}
      <FunnelBuilderModal
        isOpen={isFunnelBuilderOpen}
        onClose={() => setIsFunnelBuilderOpen(false)}
        pipelines={pipelines}
        activePipelineId={activePipelineId}
        onSelectPipeline={setActivePipelineId}
        onUpdatePipeline={handleUpdatePipeline}
        onCreatePipeline={handleCreatePipeline}
        onDeletePipeline={handleDeletePipeline}
        sellers={sellers}
        onShowToast={showToast}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-emerald-500/40 text-xs text-zinc-100 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
