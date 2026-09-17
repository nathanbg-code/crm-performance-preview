import React, { useState } from 'react';
import { Lead, Pipeline, Seller, ChannelType, LeadTemperature } from '../../types';
import { X, Plus, Sparkles, DollarSign, Phone, Building2, User } from 'lucide-react';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pipeline: Pipeline;
  sellers: Seller[];
  defaultStageId?: string;
  onCreateLead: (lead: Lead) => void;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
  pipeline,
  sellers,
  defaultStageId,
  onCreateLead,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('+55 11 9');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('15000');
  const [stageId, setStageId] = useState(defaultStageId || pipeline.stages[0]?.id || '');
  const [sellerId, setSellerId] = useState(sellers[0]?.id || '');
  const [channel, setChannel] = useState<ChannelType>('whatsapp');
  const [temperature, setTemperature] = useState<LeadTemperature>('warm');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name,
      company: company || 'Empresa Própria',
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      value: Number(value) || 0,
      pipelineId: pipeline.id,
      stageId: stageId || pipeline.stages[0]?.id,
      sellerId: sellerId || sellers[0]?.id,
      channel,
      tags: ['Manual', channel === 'whatsapp' ? 'WhatsApp' : 'Instagram'],
      temperature,
      lastInteraction: 'Criado agora',
      slaMinutesRemaining: 30,
      customFields: [],
      createdAt: 'Hoje',
      score: 75,
      aiSummary: 'Oportunidade cadastrada manualmente no CRM. Aguardando primeiro contato.',
      sentiment: 'Neutro',
      buyingIntent: 'Em Avaliação',
      suggestedNextStep: 'Realizar primeiro contato via WhatsApp e apresentar o catálogo.',
    };

    onCreateLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Criar Novo Lead / Oportunidade</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Nome do Lead *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Empresa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: SolarTech Brasil"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">WhatsApp / Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Valor Estimado (R$)</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Etapa Inicial</label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500"
              >
                {pipeline.stages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Vendedor Responsável</label>
              <select
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500"
              >
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Canal de Origem</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as ChannelType)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram Direct</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="referral">Indicação</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Temperatura</label>
              <select
                value={temperature}
                onChange={(e) => setTemperature(e.target.value as LeadTemperature)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none focus:border-emerald-500"
              >
                <option value="hot">🔥 Quente</option>
                <option value="warm">⚡ Morno</option>
                <option value="cold">❄️ Frio</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
            >
              Cadastrar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
