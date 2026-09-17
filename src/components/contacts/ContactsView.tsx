import React, { useState } from 'react';
import { Lead, Seller, Pipeline } from '../../types';
import { ChannelBadge } from '../common/ChannelBadge';
import { TemperatureBadge } from '../common/TemperatureBadge';
import { SLABadge } from '../common/SLABadge';
import {
  Search,
  Download,
  Filter,
  Phone,
  Mail,
  Building2,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface ContactsViewProps {
  leads: Lead[];
  sellers: Seller[];
  pipeline: Pipeline;
  onSelectLead: (lead: Lead) => void;
  onOpenInbox: (leadId: string) => void;
  onQuickCreate: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  leads,
  sellers,
  pipeline,
  onSelectLead,
  onOpenInbox,
  onQuickCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const sellersMap = new Map<string, Seller>(sellers.map((s) => [s.id, s]));
  const stagesMap = new Map<string, string>(pipeline.stages.map((st) => [st.id, st.title]));

  const filtered = leads.filter((l) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.email.toLowerCase().includes(q)
    );
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Header & Controls */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, empresa, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {filtered.length} contatos encontrados
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onQuickCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Contato</span>
          </button>
        </div>
      </div>

      {/* Dense Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider sticky top-0 z-10">
              <th className="p-3 pl-4">Contato / Empresa</th>
              <th className="p-3">Canal</th>
              <th className="p-3">Etapa Atual</th>
              <th className="p-3">Temperatura</th>
              <th className="p-3">Valor Estimado</th>
              <th className="p-3">Responsável</th>
              <th className="p-3">SLA Status</th>
              <th className="p-3 text-right pr-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filtered.map((lead) => {
              const seller = sellersMap.get(lead.sellerId);
              const stageTitle = stagesMap.get(lead.stageId) || 'Em Andamento';

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="hover:bg-zinc-900/50 transition cursor-pointer group"
                >
                  <td className="p-3 pl-4">
                    <div className="font-semibold text-zinc-200 group-hover:text-emerald-400 transition">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-zinc-500">{lead.company}</div>
                  </td>

                  <td className="p-3">
                    <ChannelBadge channel={lead.channel} size="sm" />
                  </td>

                  <td className="p-3">
                    <span className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
                      {stageTitle}
                    </span>
                  </td>

                  <td className="p-3">
                    <TemperatureBadge temperature={lead.temperature} />
                  </td>

                  <td className="p-3 font-mono font-bold text-emerald-400">
                    {formatCurrency(lead.value)}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {seller && (
                        <img
                          src={seller.avatar}
                          alt={seller.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span className="text-zinc-300 truncate">{seller?.name || 'Geral'}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <SLABadge minutesRemaining={lead.slaMinutesRemaining} alertText={lead.slaAlert} />
                  </td>

                  <td className="p-3 text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenInbox(lead.id)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition"
                        title="Abrir na Inbox"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition"
                        title="Chamar no WhatsApp Web"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
