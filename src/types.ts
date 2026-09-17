export type ChannelType = 'whatsapp' | 'instagram' | 'meta_ads' | 'google_ads' | 'referral' | 'website';

export type LeadTemperature = 'hot' | 'warm' | 'cold';

export type SentimentType = 'Positivo' | 'Neutro' | 'Urgente' | 'Objecao' | 'Risco';

export interface Seller {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  activeLeadsCount: number;
  activeDealsCount?: number;
  conversionRate: number;
  avgResponseTimeMin: number;
  avgResponseTime?: string;
  totalWonValue?: number;
  online: boolean;
  status?: 'online' | 'busy' | 'offline';
}

export interface CustomField {
  id: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'currency' | 'select' | 'date';
}

export interface LeadActivity {
  id: string;
  type: 'message' | 'call' | 'note' | 'stage_change' | 'automation' | 'ai_insight';
  title: string;
  description: string;
  timestamp: string;
  authorName?: string;
  channel?: ChannelType;
  metadata?: Record<string, any>;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  value: number; // in BRL
  pipelineId: string;
  stageId: string;
  sellerId: string;
  channel: ChannelType;
  campaign?: string;
  tags: string[];
  temperature: LeadTemperature;
  lastInteraction: string;
  nextActivity?: {
    type: 'call' | 'meeting' | 'task' | 'whatsapp';
    title: string;
    dueDate: string;
  };
  slaMinutesRemaining: number; // negative means SLA breached
  slaAlert?: string;
  score: number; // 0 to 100
  aiSummary: string;
  sentiment: SentimentType;
  buyingIntent: string;
  suggestedNextStep: string;
  customFields: CustomField[];
  utms?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
  createdAt: string;
}

export interface FunnelAutomationRule {
  id: string;
  name: string;
  stageId: string;
  triggerType: 'stage_entered' | 'time_in_stage_sla' | 'temperature_hot' | 'form_submitted' | 'whatsapp_received';
  triggerLabel: string;
  actionType: 'send_whatsapp' | 'assign_seller_round_robin' | 'trigger_ai_sdr' | 'send_slack_alert' | 'update_tag' | 'call_webhook';
  actionLabel: string;
  actionConfig: {
    templateText?: string;
    targetSellerId?: string;
    agentRole?: string;
    delayMinutes?: number;
    webhookUrl?: string;
    tagName?: string;
  };
  active: boolean;
  executedCount: number;
  lastExecuted?: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  color: string;
  order: number;
  slaMinutes?: number;
  description?: string;
  mandatoryRequirements?: string[];
  automations?: FunnelAutomationRule[];
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  category?: string;
  stages: PipelineStage[];
  isDefault?: boolean;
}

export interface Message {
  id: string;
  sender: 'client' | 'seller' | 'ai_agent';
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isAudio?: boolean;
  audioDuration?: string;
  suggestedByAI?: boolean;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  leadCompany: string;
  leadAvatar?: string;
  phone: string;
  channel: ChannelType;
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  assignedSellerId: string;
  waitingTimeMinutes: number;
  slaBreached: boolean;
  messages: Message[];
}

export type AutomationNodeType = 'trigger' | 'condition' | 'action';

export interface AutomationNode {
  id: string;
  type: AutomationNodeType;
  subType: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  position: { x: number; y: number };
  config: Record<string, any>;
}

export interface AutomationConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

export interface AutomationExecutionLog {
  id: string;
  automationId: string;
  leadName: string;
  actionExecuted: string;
  status: 'success' | 'warning' | 'failed';
  timestamp: string;
  details: string;
}

export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  executionCount: number;
  lastTriggered: string;
  nodes: AutomationNode[];
  connections: AutomationConnection[];
}

export interface AIAgent {
  id: string;
  name: string;
  role: 'sdr' | 'followup' | 'analyst';
  title: string;
  description: string;
  active: boolean;
  status?: 'active' | 'paused';
  avatar: string;
  tone: 'Consultivo' | 'Direto' | 'Amigável' | 'Executivo';
  toneOfVoice?: string;
  objective?: string;
  transferRules?: string[];
  autonomyLevel?: number;
  channels: ChannelType[];
  mode: 'autopilot' | 'copilot';
  stats: {
    conversationsHandled: number;
    qualifiedCount: number;
    hoursSaved: number;
    satisfactionRate: number;
  };
  promptSystem: string;
  qualificationRules: string[];
}

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  subtext: string;
}

export interface CRMConfigProposal {
  segment: string;
  origins: string[];
  sellers: string[];
  pipelineStages: string[];
  automations: string[];
  customFields: string[];
  tags: string[];
  qualificationRules: string[];
  allocatedAgent: string;
}

export type AIProviderId = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'deepseek' | 'custom';

export interface AIModelOption {
  id: string;
  name: string;
  recommended?: boolean;
  contextWindow?: string;
  pricingEstimate?: string;
}

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  brand: string;
  status: 'connected' | 'ready' | 'error' | 'testing';
  isDefault: boolean;
  isFallback: boolean;
  apiKeyMasked?: string;
  apiKey?: string;
  customEndpoint?: string;
  selectedModel: string;
  supportedModels: AIModelOption[];
  latencyMs?: number;
  rateLimitRPM: number;
  temperature: number;
  maxTokens: number;
  description: string;
  totalTokensUsed: number;
  lastTestedAt?: string;
}

export interface AIRoutingSettings {
  sdrAgentProvider: AIProviderId;
  sdrAgentModel: string;
  inboxCopilotProvider: AIProviderId;
  inboxCopilotModel: string;
  automationInterpreterProvider: AIProviderId;
  automationInterpreterModel: string;
  sentimentAnalysisProvider: AIProviderId;
  sentimentAnalysisModel: string;
  fallbackEnabled: boolean;
  fallbackProvider: AIProviderId;
  maxTimeoutMs: number;
}

