import React, { useState } from 'react';
import {
  Conversation,
  Lead,
  Pipeline,
  Seller,
} from '../../types';
import { ChannelBadge } from '../common/ChannelBadge';
import { TemperatureBadge } from '../common/TemperatureBadge';
import {
  Search,
  MessageSquare,
  Instagram,
  Send,
  Sparkles,
  Paperclip,
  Mic,
  Smile,
  CheckCheck,
  Bot,
  ExternalLink,
} from 'lucide-react';

interface OmnichannelInboxProps {
  conversations: Conversation[];
  leads: Lead[];
  pipeline: Pipeline;
  sellers: Seller[];
  selectedConversationId?: string;
  onSelectConversation: (convId: string) => void;
  onSendMessage: (convId: string, text: string) => void;
  onUpdateLeadStage: (leadId: string, stageId: string) => void;
  onOpenLeadDetail: (lead: Lead) => void;
}

export const OmnichannelInbox: React.FC<OmnichannelInboxProps> = ({
  conversations,
  leads,
  pipeline,
  sellers,
  selectedConversationId,
  onSelectConversation,
  onSendMessage,
  onUpdateLeadStage,
  onOpenLeadDetail,
}) => {
  const [channelFilter, setChannelFilter] = useState<'all' | 'whatsapp' | 'instagram'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedReplyIndex, setSelectedReplyIndex] = useState(0);

  // Active conversation
  const activeConv =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];
  const activeLead = leads.find((l) => l.id === activeConv?.leadId);
  const activeSeller = sellers.find((s) => s.id === activeConv?.assignedSellerId);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (channelFilter !== 'all' && c.channel !== channelFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = c.leadName.toLowerCase().includes(q);
      const matchCompany = c.leadCompany.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      if (!matchName && !matchCompany && !matchPhone) return false;
    }
    return true;
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;
    onSendMessage(activeConv.id, messageInput);
    setMessageInput('');
  };

  const handleInsertTemplate = (templateText: string) => {
    setMessageInput(templateText);
  };

  // AI Smart Suggested Replies (Curated & concise)
  const suggestedReplies = [
    {
      title: 'Avançar para Demonstração',
      text: `Olá ${activeConv?.leadName}! Perfeito. Podemos fazer uma chamada rápida de 10 minutos hoje às 16h30 para te mostrar na prática?`,
    },
    {
      title: 'Flexibilizar Pagamento',
      text: `Entendi perfeitamente sua consideração sobre a entrada, ${activeConv?.leadName}! Conseguimos flexibilizar em até 3x no boleto ou cartão sem juros. Posso formalizar a minuta?`,
    },
  ];

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-v4-bg">
      {/* ========================================================================= */}
      {/* COLUMN 1: Conversation List (Subtle, Calm, Secondary Priority)             */}
      {/* ========================================================================= */}
      <div className="w-76 border-r border-v4-border/30 flex flex-col h-full bg-v4-dark shrink-0">
        {/* Top Section Header - Aligned to h-12 baseline */}
        <div className="h-12 px-4 border-b border-v4-border/30 flex items-center justify-between shrink-0 bg-v4-dark">
          <span className="text-xs font-semibold text-v4-text">Conversas</span>
          <span className="text-[11px] font-mono text-v4-muted bg-v4-surface/80 px-2 py-0.5 rounded border border-v4-border/30">
            {filteredConversations.length}
          </span>
        </div>

        {/* Filter & Search Subheader */}
        <div className="p-3.5 border-b border-v4-border/25 space-y-2.5 bg-v4-dark shrink-0">
          {/* Minimalist Segmented Filter */}
          <div className="flex bg-v4-surface/80 p-0.5 rounded-md border border-v4-border/30 text-xs">
            <button
              onClick={() => setChannelFilter('all')}
              className={`flex-1 py-1 rounded text-center text-xs font-medium transition cursor-pointer ${
                channelFilter === 'all'
                  ? 'bg-v4-elevated text-v4-text font-semibold shadow-xs'
                  : 'text-v4-muted hover:text-v4-text'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setChannelFilter('whatsapp')}
              className={`flex-1 py-1 rounded text-center text-xs font-medium flex items-center justify-center gap-1 transition cursor-pointer ${
                channelFilter === 'whatsapp'
                  ? 'bg-v4-elevated text-v4-text font-semibold shadow-xs'
                  : 'text-v4-muted hover:text-v4-text'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-v4-success" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setChannelFilter('instagram')}
              className={`flex-1 py-1 rounded text-center text-xs font-medium flex items-center justify-center gap-1 transition cursor-pointer ${
                channelFilter === 'instagram'
                  ? 'bg-v4-elevated text-v4-text font-semibold shadow-xs'
                  : 'text-v4-muted hover:text-v4-text'
              }`}
            >
              <Instagram className="w-3 h-3 text-pink-400" />
              <span>Direct</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-v4-muted/70 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-v4-surface/70 border border-v4-border/30 rounded-md pl-8 pr-3 py-1.5 text-xs text-v4-text placeholder-v4-muted/70 focus:border-v4-primary/60 outline-none transition"
            />
          </div>
        </div>

        {/* Clean Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-v4-border/20">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`px-4 py-3.5 transition cursor-pointer flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-v4-surface/90 border-l-2 border-v4-primary'
                    : 'hover:bg-v4-surface/40'
                }`}
              >
                {/* Clean Initial Avatar */}
                <div className="w-8 h-8 rounded-full bg-v4-elevated border border-v4-border/40 flex items-center justify-center font-medium text-xs text-v4-text shrink-0 mt-0.5">
                  {conv.leadName.charAt(0)}
                </div>

                {/* Meta: Name, Company, Message Snippet */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-medium text-v4-text truncate">
                        {conv.leadName}
                      </span>
                      {conv.channel === 'whatsapp' ? (
                        <MessageSquare className="w-2.5 h-2.5 text-v4-success shrink-0" />
                      ) : (
                        <Instagram className="w-2.5 h-2.5 text-pink-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-v4-muted/80 shrink-0 font-mono">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-v4-muted/80 truncate">
                    {conv.leadCompany}
                  </p>

                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <p className="text-xs text-zinc-400 truncate flex-1">
                      {conv.lastMessageText}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-v4-primary text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 2: Central Conversation Thread (High Visual Priority & Focus)      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full border-r border-v4-border/30 bg-v4-bg min-w-0">
        {activeConv ? (
          <>
            {/* Consolidated Single-Row Header - Aligned to h-12 baseline */}
            <div className="h-12 px-5 border-b border-v4-border/30 bg-v4-dark flex items-center justify-between gap-3 shrink-0">
              {/* Left: Avatar + Consolidated Single-Row Metadata */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-v4-surface border border-v4-border/50 flex items-center justify-center font-semibold text-xs text-v4-text shrink-0">
                  {activeConv.leadName.charAt(0)}
                </div>

                <div className="flex items-center gap-2 min-w-0 text-xs">
                  <span className="font-semibold text-v4-text truncate">
                    {activeConv.leadName}
                  </span>

                  <ChannelBadge channel={activeConv.channel} size="sm" showLabel={false} />

                  <span className="text-v4-border/70 select-none">•</span>

                  <span className="text-v4-muted truncate">
                    {activeConv.leadCompany}
                  </span>

                  <span className="text-v4-border/70 select-none hidden sm:inline">•</span>

                  <span className="text-v4-muted font-mono hidden sm:inline">
                    {activeConv.phone}
                  </span>

                  {activeLead && (
                    <>
                      <span className="text-v4-border/70 select-none hidden md:inline">•</span>
                      <div className="hidden md:inline-flex shrink-0">
                        <TemperatureBadge temperature={activeLead.temperature} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Consolidated Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => activeLead && onOpenLeadDetail(activeLead)}
                  className="px-2.5 py-1 rounded-md bg-v4-surface hover:bg-v4-elevated text-v4-text text-xs border border-v4-border/40 transition cursor-pointer font-medium"
                >
                  Ver Ficha
                </button>
                <a
                  href={`https://wa.me/${activeConv.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md hover:bg-v4-surface text-v4-muted hover:text-v4-text transition"
                  title="Abrir no WhatsApp Oficial"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Normalized Conversation Stream */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-v4-bg">
              {activeConv.messages.map((msg) => {
                const isClient = msg.sender === 'client';
                const isAI = msg.sender === 'ai_agent';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}
                  >
                    {/* Sender Label */}
                    <div className="text-[10px] text-v4-muted/70 mb-1 px-1 flex items-center gap-1">
                      {isAI && <Bot className="w-3 h-3 text-v4-muted/80" />}
                      <span>{msg.senderName}</span>
                    </div>

                    {/* Normalized Bubble */}
                    <div
                      className={`max-w-[72%] sm:max-w-[65%] rounded-lg px-4 py-3 text-xs leading-relaxed ${
                        isClient
                          ? 'bg-v4-surface border border-v4-border/30 text-v4-text shadow-xs'
                          : 'bg-v4-elevated border border-v4-border/35 text-v4-text shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-v4-muted/80">
                        <span>{msg.timestamp}</span>
                        {!isClient && <CheckCheck className="w-3 h-3 text-v4-muted/80" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Assistant Copilot Bar - Discreet 1-line helper */}
            {suggestedReplies[selectedReplyIndex] && (
              <div className="px-5 py-2.5 bg-v4-surface/60 border-t border-v4-border/25 flex items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Sparkles className="w-3.5 h-3.5 text-v4-muted shrink-0" />
                  <span className="text-[11px] text-v4-muted shrink-0">Sugestão:</span>
                  <span className="text-xs text-v4-text truncate">
                    <span className="font-medium">{suggestedReplies[selectedReplyIndex].title}</span>
                    <span className="text-v4-muted font-normal"> — &ldquo;{suggestedReplies[selectedReplyIndex].text}&rdquo;</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {suggestedReplies.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedReplyIndex((prev) =>
                          prev === 0 ? 1 : 0
                        )
                      }
                      className="text-[11px] text-v4-muted hover:text-v4-text transition cursor-pointer"
                    >
                      Outra opção
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      handleInsertTemplate(suggestedReplies[selectedReplyIndex].text)
                    }
                    className="text-[11px] text-v4-text font-medium px-2.5 py-1 rounded bg-v4-elevated hover:bg-zinc-700 border border-v4-border/40 transition cursor-pointer"
                  >
                    Usar
                  </button>
                </div>
              </div>
            )}

            {/* Compose Message Box */}
            <div className="p-4 border-t border-v4-border/30 bg-v4-dark shrink-0">
              <form onSubmit={handleSend} className="space-y-2.5">
                <textarea
                  rows={2}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Responder ${activeConv.leadName} via ${
                    activeConv.channel === 'whatsapp' ? 'WhatsApp' : 'Instagram'
                  }... (Enter para enviar)`}
                  className="w-full bg-v4-surface/90 border border-v4-border/35 focus:border-v4-primary/70 rounded-md p-3 text-xs text-v4-text placeholder-v4-muted/70 outline-none resize-none transition leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-v4-muted/80">
                    <button
                      type="button"
                      title="Anexar Proposta / PDF"
                      className="p-1.5 rounded hover:bg-v4-surface text-v4-muted hover:text-v4-text transition cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Gravar áudio"
                      className="p-1.5 rounded hover:bg-v4-surface text-v4-muted hover:text-v4-text transition cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Inserir Emoji"
                      className="p-1.5 rounded hover:bg-v4-surface text-v4-muted hover:text-v4-text transition cursor-pointer"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="px-4 py-1.5 rounded-md bg-v4-primary hover:bg-v4-primary-hover disabled:opacity-40 text-white text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Enviar</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-v4-muted text-xs">
            Selecione uma conversa para iniciar o atendimento
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 3: Ficha Operacional do Lead (Quiet Context Sidebar)              */}
      {/* ========================================================================= */}
      <div className="w-76 border-l border-v4-border/30 flex flex-col h-full bg-v4-dark shrink-0">
        {/* Top Section Header - Aligned to h-12 baseline */}
        <div className="h-12 px-4 border-b border-v4-border/30 flex items-center justify-between shrink-0 bg-v4-dark">
          <span className="text-xs font-semibold text-v4-text">Ficha Operacional</span>
          {activeLead && <TemperatureBadge temperature={activeLead.temperature} />}
        </div>

        {activeLead ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Header: Lead Name & Company */}
            <div className="pb-3 border-b border-v4-border/25 space-y-0.5">
              <h3 className="text-sm font-semibold text-v4-text truncate">{activeLead.name}</h3>
              <p className="text-xs text-v4-muted truncate">{activeLead.company}</p>
            </div>

            {/* Pipeline Stage Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-v4-muted/80 uppercase tracking-wider block">
                Etapa do Pipeline
              </label>
              <select
                value={activeLead.stageId}
                onChange={(e) => onUpdateLeadStage(activeLead.id, e.target.value)}
                className="w-full bg-v4-surface/80 border border-v4-border/30 rounded-md px-3 py-2 text-xs text-v4-text outline-none focus:border-v4-primary/70 cursor-pointer transition"
              >
                {pipeline.stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Core Commercial Grid */}
            <div className="space-y-2.5 py-3 border-y border-v4-border/25 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-v4-muted/80 text-[11px]">Responsável</span>
                <span className="text-v4-text font-medium">{activeSeller?.name || 'Não atribuído'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-v4-muted/80 text-[11px]">Valor Estimado</span>
                <span className="text-v4-text font-mono font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    activeLead.value
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-v4-muted/80 text-[11px]">Origem</span>
                <span className="text-v4-muted truncate max-w-[130px]" title={activeLead.campaign}>
                  {activeLead.campaign}
                </span>
              </div>
            </div>

            {/* Próxima Ação */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-medium text-v4-muted/80 uppercase tracking-wider block">
                Próxima Ação
              </span>
              <div className="p-3 rounded-md bg-v4-surface/70 border border-v4-border/25 text-xs text-v4-text leading-relaxed">
                {activeLead.suggestedNextStep}
              </div>
            </div>

            {/* Tags */}
            {activeLead.tags && activeLead.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-v4-muted/80 uppercase tracking-wider block">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeLead.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-v4-surface/70 text-v4-muted px-2 py-0.5 rounded border border-v4-border/25 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assistência / Insight Consolidado da IA */}
            <div className="pt-3 border-t border-v4-border/25 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-v4-muted/80">
                <Sparkles className="w-3.5 h-3.5 text-v4-muted/70" />
                <span>Insight Comercial</span>
              </div>
              <div className="p-3 rounded-md bg-v4-surface/60 border border-v4-border/25 text-xs text-v4-muted leading-relaxed">
                {activeLead.aiSummary}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-v4-muted text-center pt-8">
            Nenhum lead associado a esta conversa
          </div>
        )}
      </div>
    </div>
  );
};

