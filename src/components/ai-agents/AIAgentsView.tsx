import React, { useState } from 'react';
import { AIAgent } from '../../types';
import {
  Bot,
  Sparkles,
  Play,
  Send,
  Sliders,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  Instagram,
  Settings,
} from 'lucide-react';

interface AIAgentsViewProps {
  agents: AIAgent[];
  onUpdateAgent: (agent: AIAgent) => void;
  onNavigateToConnections?: () => void;
}

export const AIAgentsView: React.FC<AIAgentsViewProps> = ({
  agents,
  onUpdateAgent,
  onNavigateToConnections,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Simulator chat state
  const [simulatorMessages, setSimulatorMessages] = useState<
    { sender: 'user' | 'agent'; text: string; time: string }[]
  >([
    {
      sender: 'agent',
      text: `Olá! Sou a ${activeAgent.name}, da equipe de atendimento. Como posso te ajudar hoje com as soluções da nossa empresa?`,
      time: '15:30',
    },
  ]);
  const [simulatorInput, setSimulatorInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSimulateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorInput.trim()) return;

    const userText = simulatorInput;
    setSimulatorMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Agora' },
    ]);
    setSimulatorInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('humano') || lower.includes('vendedor') || lower.includes('atendente')) {
        reply = `Com certeza! Conforme minha regra de transbordo, estou transferindo você agora mesmo para o nosso especialista comercial responsável. Ele já recebeu o histórico do nosso contato!`;
      } else if (lower.includes('preço') || lower.includes('quanto custa') || lower.includes('valor')) {
        reply = `Nossos planos e soluções variam de acordo com o porte e necessidade da sua operação. Para eu te passar uma estimativa precisa, você já possui uma equipe interna ou busca uma solução completa chave na mão?`;
      } else {
        reply = `Entendi perfeitamente sua colocação sobre "${userText}". Nossa meta é garantir máxima velocidade de atendimento. Poderia me confirmar se você é o responsável pela decisão final desse projeto?`;
      }

      setSimulatorMessages((prev) => [
        ...prev,
        { sender: 'agent', text: reply, time: 'Agora' },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-zinc-950">
      {/* Left / Middle: Agent List & Deep Configuration (7 cols) */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto border-r border-zinc-800 p-5 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-semibold text-zinc-100">Agentes de Inteligência Artificial</h2>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                3 AGENTES ATIVOS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Configure o comportamento, tom de voz, regras de qualificação e condições de transbordo para humanos.
            </p>
          </div>

          {onNavigateToConnections && (
            <button
              onClick={onNavigateToConnections}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-v4-primary/15 hover:bg-v4-primary/25 border border-v4-primary/30 text-v4-primary text-xs font-semibold transition cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Conexões de IA & APIs</span>
            </button>
          )}
        </div>

        {/* Agent Select Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {agents.map((agent) => {
            const isSelected = agent.id === activeAgent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-zinc-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      agent.active
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {agent.role.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-100">{agent.name}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{agent.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Configuration Panel for Active Agent */}
        <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Configurações: {activeAgent.name} ({activeAgent.role.toUpperCase()})
              </h3>
            </div>
            <button
              onClick={() => {
                onUpdateAgent({
                  ...activeAgent,
                  active: !activeAgent.active,
                });
              }}
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition cursor-pointer ${
                activeAgent.active
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {activeAgent.active ? '● Agente em Operação' : '○ Pausado'}
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Tom de Voz */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Tom de Voz & Personalidade:</label>
              <input
                type="text"
                value={activeAgent.toneOfVoice || `${activeAgent.tone} e focado em conversão`}
                onChange={(e) => onUpdateAgent({ ...activeAgent, toneOfVoice: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Objetivo */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Objetivo Principal da Conversa:</label>
              <textarea
                rows={2}
                value={activeAgent.objective || activeAgent.description}
                onChange={(e) => onUpdateAgent({ ...activeAgent, objective: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Regras de Transbordo / Qualificação */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Regras de Qualificação & Transbordo Humano:
              </label>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-1.5">
                {(activeAgent.transferRules || activeAgent.qualificationRules || []).map((rule: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-zinc-300 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limites de Autonomia Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between">
                <label className="text-zinc-300 font-medium">Nível de Autonomia Operacional:</label>
                <span className="font-mono text-emerald-400 font-bold">
                  {activeAgent.autonomyLevel ?? (activeAgent.mode === 'autopilot' ? 85 : 40)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={activeAgent.autonomyLevel ?? (activeAgent.mode === 'autopilot' ? 85 : 40)}
                onChange={(e) =>
                  onUpdateAgent({ ...activeAgent, autonomyLevel: Number(e.target.value) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0% (Apenas Sugere)</span>
                <span>50% (Co-piloto com supervisão)</span>
                <span>100% (Autonomia total com transbordo)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Live Interactive Agent Simulator (5 cols) */}
      <div className="w-full lg:w-96 flex flex-col h-full bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-800 shrink-0">
        {/* Simulator Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-semibold text-zinc-100">
              Simulador de Teste ({activeAgent.name})
            </h3>
          </div>
          <button
            onClick={() => {
              setSimulatorMessages([
                {
                  sender: 'agent',
                  text: `Olá! Sou a ${activeAgent.name}, da equipe comercial. Em que posso te ajudar hoje?`,
                  time: 'Agora',
                },
              ]);
            }}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 transition"
          >
            Reiniciar
          </button>
        </div>

        {/* Simulator Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {simulatorMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-zinc-500 mb-0.5 px-1">
                {msg.sender === 'user' ? 'Você (Lead de Teste)' : activeAgent.name}
              </div>
              <div
                className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white font-normal'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 p-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-200" />
              <span>{activeAgent.name} está digitando...</span>
            </div>
          )}
        </div>

        {/* Simulator Input */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/40">
          <form onSubmit={handleSimulateMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={simulatorInput}
              onChange={(e) => setSimulatorInput(e.target.value)}
              placeholder="Digite como se fosse um cliente..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500/60 outline-none"
            />
            <button
              type="submit"
              disabled={!simulatorInput.trim()}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
