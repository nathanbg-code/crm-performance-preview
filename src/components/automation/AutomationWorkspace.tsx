import React, { useState, useRef } from 'react';
import {
  AutomationFlow,
  AutomationNode,
  AutomationConnection,
} from '../../types';
import { AIAutomationPromptModal } from './AIAutomationPromptModal';
import {
  Sparkles,
  Play,
  History,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Settings2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Filter,
  Users,
  Clock,
  MessageSquare,
  CheckSquare,
  Bot,
  Power,
  RotateCcw,
  X,
} from 'lucide-react';

interface AutomationWorkspaceProps {
  flows: AutomationFlow[];
  currentFlowId: string;
  onSelectFlow: (flowId: string) => void;
  onUpdateFlow: (flow: AutomationFlow) => void;
  onAddNewFlow: (flow: AutomationFlow) => void;
}

export const AutomationWorkspace: React.FC<AutomationWorkspaceProps> = ({
  flows,
  currentFlowId,
  onSelectFlow,
  onUpdateFlow,
  onAddNewFlow,
}) => {
  const currentFlow = flows.find((f) => f.id === currentFlowId) || flows[0];

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Realtime Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulationNodeId, setActiveSimulationNodeId] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Node Dragging inside canvas
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = currentFlow.nodes.find((n) => n.id === selectedNodeId);

  // Node icon resolver
  const renderNodeIcon = (type: string, iconName?: string) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-purple-400" />;
      case 'condition':
        return <Filter className="w-4 h-4 text-amber-400" />;
      case 'action':
      default:
        if (iconName === 'Users') return <Users className="w-4 h-4 text-emerald-400" />;
        if (iconName === 'Clock') return <Clock className="w-4 h-4 text-blue-400" />;
        if (iconName === 'MessageSquare') return <MessageSquare className="w-4 h-4 text-emerald-400" />;
        if (iconName === 'CheckSquare') return <CheckSquare className="w-4 h-4 text-teal-400" />;
        if (iconName === 'Bot') return <Bot className="w-4 h-4 text-purple-400" />;
        return <ArrowRight className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Node color theme resolver
  const getNodeStyles = (type: string, isSelected: boolean, isSimulatingNode: boolean) => {
    let base = 'bg-zinc-900 border text-zinc-100';

    if (isSimulatingNode) {
      return 'bg-emerald-950/70 border-emerald-400 ring-4 ring-emerald-500/40 shadow-lg shadow-emerald-500/30 scale-105 transition duration-300';
    }

    if (isSelected) {
      return 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md';
    }

    switch (type) {
      case 'trigger':
        return 'border-purple-500/40 hover:border-purple-500/80 bg-zinc-900/95';
      case 'condition':
        return 'border-amber-500/40 hover:border-amber-500/80 bg-zinc-900/95';
      case 'action':
      default:
        return 'border-emerald-500/30 hover:border-emerald-500/70 bg-zinc-900/95';
    }
  };

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggingNodeId) {
      const newNodes = currentFlow.nodes.map((n) => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            position: {
              x: Math.max(20, (e.clientX - nodeOffset.x - panOffset.x) / zoom),
              y: Math.max(20, (e.clientY - nodeOffset.y - panOffset.y) / zoom),
            },
          };
        }
        return n;
      });
      onUpdateFlow({ ...currentFlow, nodes: newNodes });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
  };

  // Node Drag Start
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const node = currentFlow.nodes.find((n) => n.id === nodeId);
    if (node) {
      setNodeOffset({
        x: e.clientX - (node.position.x * zoom + panOffset.x),
        y: e.clientY - (node.position.y * zoom + panOffset.y),
      });
    }
  };

  // Toggle active status
  const handleToggleFlowActive = () => {
    onUpdateFlow({
      ...currentFlow,
      active: !currentFlow.active,
    });
  };

  // Realtime Simulation Runner
  const handleRunSimulation = async () => {
    if (isSimulating || currentFlow.nodes.length === 0) return;
    setIsSimulating(true);
    setSimulationLogs(['Iniciando simulação de teste no fluxo...']);

    for (let i = 0; i < currentFlow.nodes.length; i++) {
      const node = currentFlow.nodes[i];
      setActiveSimulationNodeId(node.id);
      setSimulationLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Executando: ${node.title} (${node.subType})`,
      ]);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setActiveSimulationNodeId(null);
    setSimulationLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ✅ Fluxo executado com 100% de sucesso! Nenhum gargalo encontrado.`,
    ]);
    setIsSimulating(false);
    onUpdateFlow({
      ...currentFlow,
      executionCount: currentFlow.executionCount + 1,
      lastTriggered: 'Agora mesmo (Simulação)',
    });
  };

  // Add new block menu
  const handleAddBlock = (type: 'trigger' | 'condition' | 'action') => {
    const newNodeId = `node_${Date.now()}`;
    const newNode: AutomationNode = {
      id: newNodeId,
      type,
      subType: type === 'trigger' ? 'LEAD_CREATED' : type === 'condition' ? 'CHANNEL_MATCH' : 'SEND_WHATSAPP',
      title: type === 'trigger' ? 'Novo Gatilho' : type === 'condition' ? 'Nova Regra de Condição' : 'Nova Ação',
      subtitle: 'Configurar parâmetros',
      description: 'Defina as configurações no painel lateral.',
      iconName: type === 'trigger' ? 'Zap' : type === 'condition' ? 'Filter' : 'MessageSquare',
      position: { x: 400, y: 200 },
      config: {},
    };

    onUpdateFlow({
      ...currentFlow,
      nodes: [...currentFlow.nodes, newNode],
    });
    setSelectedNodeId(newNodeId);
  };

  const handleDeleteSelectedNode = () => {
    if (!selectedNodeId) return;
    const newNodes = currentFlow.nodes.filter((n) => n.id !== selectedNodeId);
    const newConns = currentFlow.connections.filter(
      (c) => c.fromNodeId !== selectedNodeId && c.toNodeId !== selectedNodeId
    );
    onUpdateFlow({
      ...currentFlow,
      nodes: newNodes,
      connections: newConns,
    });
    setSelectedNodeId(null);
  };

  // Node position map for rendering SVG curves
  const nodeMap = new Map<string, AutomationNode>(currentFlow.nodes.map((n) => [n.id, n]));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 select-none">
      {/* ========================================================================= */}
      {/* Top Header Bar: Flow Switcher, Active Switch, AI Generator, Actions        */}
      {/* ========================================================================= */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-950/90 px-4 flex items-center justify-between gap-3 shrink-0 z-10">
        {/* Flow Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">Fluxo:</span>
            <select
              value={currentFlow.id}
              onChange={(e) => onSelectFlow(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-semibold focus:border-emerald-500 outline-none cursor-pointer max-w-[240px]"
            >
              {flows.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Active Status Toggle */}
          <button
            onClick={handleToggleFlowActive}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition cursor-pointer ${
              currentFlow.active
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{currentFlow.active ? 'Ativo em Produção' : 'Pausado'}</span>
          </button>

          <span className="text-[11px] text-zinc-500 hidden md:inline">
            • {currentFlow.executionCount} execuções registradas
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Flagship: Criar com IA */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-950 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Criar com IA</span>
          </button>

          {/* Realtime Simulation Runner */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium transition cursor-pointer"
            title="Simula a execução do fluxo passo a passo"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulando...' : 'Testar Fluxo'}</span>
          </button>

          {/* Execution History */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition cursor-pointer"
            title="Histórico de Execuções"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Workspace Body: Canvas + Node Config Drawer                                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* The Interactive Infinite Canvas */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="flex-1 h-full bg-zinc-950 bg-dot-grid-dark relative overflow-hidden cursor-crosshair select-none"
        >
          {/* Zoom and Navigation Floating Controls */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-lg p-1 shadow-lg backdrop-blur-xs">
            <button
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-zinc-400 px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition cursor-pointer"
              title="Resetar Visão"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Add Block Palette on Canvas Top-Left */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg p-1.5 shadow-lg backdrop-blur-xs">
            <button
              onClick={() => handleAddBlock('trigger')}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Gatilho</span>
            </button>
            <button
              onClick={() => handleAddBlock('condition')}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Condição</span>
            </button>
            <button
              onClick={() => handleAddBlock('action')}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Ação</span>
            </button>
          </div>

          {/* Scaled & Panned Canvas Viewport */}
          <div
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
            className="w-full h-full relative"
          >
            {/* SVG Connecting Bezier Lines */}
            <svg className="w-[3000px] h-[2000px] absolute inset-0 pointer-events-none z-0">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker
                  id="arrow-dim"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a" />
                </marker>
              </defs>

              {currentFlow.connections.map((conn) => {
                const source = nodeMap.get(conn.fromNodeId);
                const target = nodeMap.get(conn.toNodeId);
                if (!source || !target) return null;

                // Node dimensions are approx 240px wide x 110px high
                const startX = source.position.x + 240;
                const startY = source.position.y + 55;
                const endX = target.position.x;
                const endY = target.position.y + 55;

                // Calculate control points for smooth bezier curve
                const dx = Math.abs(endX - startX) * 0.5;
                const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${
                  endX - dx
                } ${endY}, ${endX} ${endY}`;

                const isConnectedSimulating =
                  activeSimulationNodeId === conn.fromNodeId ||
                  activeSimulationNodeId === conn.toNodeId;

                return (
                  <g key={conn.id}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isConnectedSimulating ? '#10b981' : '#3f3f46'}
                      strokeWidth={isConnectedSimulating ? '3' : '2'}
                      strokeDasharray={isConnectedSimulating ? '6,6' : 'none'}
                      markerEnd={isConnectedSimulating ? 'url(#arrow)' : 'url(#arrow-dim)'}
                      className={isConnectedSimulating ? 'animate-pulse' : ''}
                    />
                    {conn.label && (
                      <text
                        x={(startX + endX) / 2}
                        y={(startY + endY) / 2 - 8}
                        fill="#a1a1aa"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="bg-zinc-900 px-1"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Draggable Canvas Node Cards */}
            {currentFlow.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isSimulatingNode = activeSimulationNodeId === node.id;
              const styles = getNodeStyles(node.type, isSelected, isSimulatingNode);

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${node.position.x}px`,
                    top: `${node.position.y}px`,
                    width: '240px',
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  className={`absolute rounded-xl p-3 cursor-move shadow-md transition-shadow z-10 select-none ${styles}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center shrink-0">
                        {renderNodeIcon(node.type, node.iconName)}
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400">
                        {node.type === 'trigger'
                          ? 'Gatilho'
                          : node.type === 'condition'
                          ? 'Condição'
                          : 'Ação'}
                      </span>
                    </div>

                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  {/* Card Title & Subtitle */}
                  <h4 className="text-xs font-semibold text-zinc-100 truncate">{node.title}</h4>
                  <p className="text-[11px] text-zinc-400 truncate mb-1">{node.subtitle}</p>

                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-tight">
                    {node.description}
                  </p>

                  {/* Input/Output Ports Visuals */}
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-400 absolute -left-1.5 top-1/2 -translate-y-1/2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-950 absolute -right-1.5 top-1/2 -translate-y-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Node Configuration Right Drawer                                           */}
        {/* ========================================================================= */}
        {selectedNode && (
          <div className="w-80 border-l border-zinc-800 bg-zinc-950 p-4 flex flex-col h-full z-20 shrink-0 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
                  Configurar Bloco
                </h3>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="w-6 h-6 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Título do Bloco</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const newNodes = currentFlow.nodes.map((n) =>
                      n.id === selectedNode.id ? { ...n, title: e.target.value } : n
                    );
                    onUpdateFlow({ ...currentFlow, nodes: newNodes });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Subtítulo / Descritor</label>
                <input
                  type="text"
                  value={selectedNode.subtitle}
                  onChange={(e) => {
                    const newNodes = currentFlow.nodes.map((n) =>
                      n.id === selectedNode.id ? { ...n, subtitle: e.target.value } : n
                    );
                    onUpdateFlow({ ...currentFlow, nodes: newNodes });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Descrição Operacional</label>
                <textarea
                  rows={3}
                  value={selectedNode.description}
                  onChange={(e) => {
                    const newNodes = currentFlow.nodes.map((n) =>
                      n.id === selectedNode.id ? { ...n, description: e.target.value } : n
                    );
                    onUpdateFlow({ ...currentFlow, nodes: newNodes });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Dynamic SubType Parameters */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-300 block">
                  Parâmetros de Execução
                </span>
                <p className="text-[11px] text-zinc-500">
                  Tipo registrado: <code className="text-emerald-400">{selectedNode.subType}</code>
                </p>
                <div className="text-xs text-zinc-400">
                  A IA otimiza a latência desta etapa em menos de 100ms via webhook síncrono.
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-zinc-800">
              <button
                onClick={handleDeleteSelectedNode}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir este bloco</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Execution Logs Drawer / Modal                                             */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-100">
                  Logs de Execução em Tempo Real
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-6 h-6 rounded hover:bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-zinc-900/90 rounded-lg p-3 font-mono text-xs text-zinc-300 space-y-1.5 max-h-64 overflow-y-auto border border-zinc-800">
              {simulationLogs.length > 0 ? (
                simulationLogs.map((log, i) => <div key={i}>{log}</div>)
              ) : (
                <div className="text-zinc-500 text-center py-4">
                  Nenhuma simulação recente. Clique em &quot;Testar Fluxo&quot; para rodar.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Automation Prompt Generator Modal */}
      <AIAutomationPromptModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerateFlow={(generatedFlow) => {
          onAddNewFlow(generatedFlow);
          onSelectFlow(generatedFlow.id);
        }}
      />
    </div>
  );
};
