import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily / safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI endpoint for Conversational CRM Onboarding
app.post('/api/ai/onboarding', async (req, res) => {
  const { messages, companyProfile } = req.body;
  const userLatestMessage = messages?.[messages.length - 1]?.content || '';

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Você é o Arquiteto de IA do CRM Omnichannel (WhatsApp, Instagram, Automações).
O cliente está explicando como a empresa dele vende.
Histórico da conversa:
${messages?.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

Última mensagem do usuário: "${userLatestMessage}"

Sua missão:
1. Responda de forma executiva, objetiva e prática em Português (Brasil).
2. Extraia dados estruturados em JSON válido dentro do seu retorno (ou devolva como JSON):
   - origens (ex: Meta Ads, Google Ads, WhatsApp Direto, Indicação, etc.)
   - vendedores (nomes identificados ou sugeridos)
   - etapas_funil (sequência comercial recomendada para o segmento)
   - automacoes_sugeridas (regras lógicas)
   - campos_necessarios (campos customizados)
   - tags (etiquetas para segmentação)
   - resumo_perfil (tipo de negócio, ticket médio, canais principais)
   - pronto_para_aplicar (boolean: se já temos informações suficientes para montar o CRM completo)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Você é um arquiteto especialista em CRM de alta conversão para WhatsApp e Instagram. Seja direto e pragmático.',
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (error) {
      console.warn('Gemini API call error in onboarding, falling back to smart local CRM generator:', error);
    }
  }

  // Smart fallback when offline or no API key
  const text = userLatestMessage.toLowerCase();
  let segment = 'Comércio & Serviços Gerais';
  let stages = ['Novo Lead', 'Qualificação WhatsApp', 'Proposta / Orçamento', 'Negociação', 'Fechamento / Ganho'];
  let automations = [
    'Distribuir leads novos via Round-Robin para vendedores',
    'Follow-up automático se lead não responder em 30 min no WhatsApp',
    'Mover para Negociação quando proposta for visualizada',
  ];
  let tags = ['Prioridade Alta', 'Meta Ads', 'Quente', 'Orçamento Enviado'];
  let fields = ['Valor Estimado', 'Canal Preferido', 'Produto de Interesse', 'Data de Decisão'];
  let origins = ['WhatsApp Orgânico', 'Meta Ads (Instagram)', 'Google Ads'];

  if (text.includes('solar') || text.includes('energia')) {
    segment = 'Energia Solar';
    stages = ['Novo Lead', 'Coleta de Conta de Luz', 'Estudo de Viabilidade', 'Apresentação de Proposta', 'Aprovação de Crédito', 'Contrato Fechado'];
    fields = ['Média KWh/Mês', 'Valor Conta Luz (R$)', 'Tipo Telhado', 'Distribuidora'];
    tags = ['Conta Recebida', 'Crédito Aprovado', 'Proposta Apresentada', 'Telhado Cerâmico'];
  } else if (text.includes('imóve') || text.includes('imobili')) {
    segment = 'Imobiliária / Corretores';
    stages = ['Novo Contato', 'Perfil & Bairro Desejado', 'Visita Agendada', 'Visita Realizada', 'Proposta de Compra', 'Contrato Assinado'];
    fields = ['Faixa de Valor', 'Bairros de Preferência', 'Nº Quartos', 'Forma de Pagamento'];
    tags = ['Investidor', 'Primeiro Imóvel', 'Visita VIP', 'Financiamento'];
  } else if (text.includes('estética') || text.includes('clínica') || text.includes('médic')) {
    segment = 'Clínica & Saúde Estética';
    stages = ['Novo Lead', 'Triagem de Interesse', 'Avaliação Agendada', 'Compareceu na Clínica', 'Plano de Tratamento', 'Fechado'];
    fields = ['Procedimento Desejado', 'Melhor Turno', 'Queixa Principal', 'Data Avaliação'];
    tags = ['Botox / Preenchimento', 'Laser', 'Avaliação Confirmada', 'Recuperação'];
  }

  res.json({
    reply: `Entendido perfeitamente! Analisei o modelo comercial para ${segment}. Estruturei o fluxo de captura prioritariamente via WhatsApp e Instagram, distribuindo os leads automaticamente e acionando follow-up se não houver resposta rápida.`,
    origens: origins,
    vendedores: ['Lucas Vendas', 'Mariana Santos', 'Pedro Costa', 'Beatriz Lima'],
    etapas_funil: stages,
    automacoes_sugeridas: automations,
    campos_necessarios: fields,
    tags: tags,
    resumo_perfil: segment,
    pronto_para_aplicar: true,
  });
});

// AI endpoint for Automation Natural Language Interpreter
app.post('/api/ai/automation-interpret', async (req, res) => {
  const { promptText } = req.body;
  const ai = getGeminiClient();

  if (ai && promptText) {
    try {
      const prompt = `Interprete a seguinte instrução comercial em linguagem natural e converta para uma automação de CRM:
"${promptText}"

Formato esperado de resposta (JSON):
{
  "title": "Nome curto da automação",
  "trigger": { "type": "TIPO_TRIGGER", "description": "Descrição legível de negócio" },
  "conditions": [{ "field": "campo", "operator": "contem|igual", "value": "valor", "description": "descrição" }],
  "actions": [{ "type": "TIPO_ACAO", "params": {}, "description": "descrição de negócio" }],
  "plainTextSteps": [
    "TRIGGER: ...",
    "CONDIÇÃO: ...",
    "AÇÃO: ..."
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (e) {
      console.warn('Gemini error interpreting automation:', e);
    }
  }

  // Fallback pattern matching for realistic prompts
  const lower = (promptText || '').toLowerCase();
  let title = 'Distribuição Inteligente e Follow-up';
  let triggerDesc = 'Novo lead criado no sistema';
  let conditionDesc = 'Campanha contém palavras-chave prioritárias';
  let waitMinutes = 30;

  if (lower.includes('aquecedor') || lower.includes('campanha')) {
    title = 'Campanha Aquecedores - Distribuição & Alerta SLA';
    triggerDesc = 'Lead criado originado de campanha de tráfego';
    conditionDesc = 'Campanha contém "Aquecedor"';
  } else if (lower.includes('instagram') || lower.includes('direct')) {
    title = 'Atendimento Rápido Instagram Direct';
    triggerDesc = 'Nova mensagem recebida no Instagram';
    conditionDesc = 'Canal de entrada igual a Instagram Direct';
    waitMinutes = 15;
  }

  res.json({
    title,
    trigger: { type: 'LEAD_CREATED', description: triggerDesc },
    conditions: [{ field: 'campaign', operator: 'contains', value: 'Prioridade', description: conditionDesc }],
    actions: [
      { type: 'DISTRIBUTE_ROUND_ROBIN', params: { sellers: ['João', 'Pedro'], ratio: '50/50' }, description: 'Distribuir 50% para João e 50% para Pedro' },
      { type: 'WAIT_TIMER', params: { durationMinutes: waitMinutes }, description: `Aguardar ${waitMinutes} minutos por resposta do lead` },
      { type: 'SEND_WHATSAPP', params: { template: 'follow_up_sla' }, description: 'Enviar mensagem WhatsApp de lembrete' },
      { type: 'CREATE_TASK', params: { title: 'Ligar para lead sem resposta' }, description: 'Criar atividade urgente para o vendedor responsável' },
    ],
    plainTextSteps: [
      'TRIGGER: ' + triggerDesc,
      'CONDIÇÃO: ' + conditionDesc,
      'DISTRIBUIÇÃO: 50% João e 50% Pedro',
      `AGUARDAR: ${waitMinutes} minutos`,
      'SE NÃO HOUVER RESPOSTA:',
      '  → Enviar WhatsApp automático',
      '  → Criar atividade prioritária no CRM',
    ],
  });
});

// AI endpoint for Smart Reply in Omnichannel Inbox
app.post('/api/ai/suggest-reply', async (req, res) => {
  const { channel, leadName, company, lastMessages } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Você é o Copiloto de Vendas de um vendedor.
Canal: ${channel || 'WhatsApp'}
Nome do cliente: ${leadName}
Empresa: ${company || 'Pessoa Física'}
Últimas mensagens:
${(lastMessages || []).map((m: any) => `${m.sender}: ${m.text}`).join('\n')}

Sugira 2 opções de resposta rápidas, empáticas e focadas em avançar para o fechamento/reunião.
Retorne um JSON com a lista de sugestões:
{
  "suggestions": [
    { "type": "Agendamento / Call", "text": "..." },
    { "type": "Tira-Dúvidas Rápido", "text": "..." }
  ],
  "leadInsight": "Resumo rápido de 1 frase do interesse do cliente",
  "sentiment": "Positivo" | "Neutro" | "Urgente" | "Objecao",
  "nextBestAction": "Próxima ação recomendada para o vendedor"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (e) {
      console.warn('Gemini error in suggest-reply:', e);
    }
  }

  // Fallback suggestions
  res.json({
    suggestions: [
      {
        type: 'Avançar para Demonstração',
        text: `Olá ${leadName}! Perfeito. Separei exatamente essa proposta aqui para você. Tem 10 minutos hoje às 16h ou amanhã às 10h para eu te mostrar na prática pelo WhatsApp ou Google Meet?`,
      },
      {
        type: 'Esclarecer Condições',
        text: `Entendi perfeitamente sua dúvida, ${leadName}! Nossas condições promocionais incluem suporte prioritário e parcelamento em até 12x. Gostaria que eu te enviasse o PDF com o comparativo detalhado agora?`,
      },
    ],
    leadInsight: 'Cliente com alto interesse, demonstrando urgência para implementar na equipe esta semana.',
    sentiment: 'Positivo',
    nextBestAction: 'Agendar apresentação executiva de 15 min e enviar PDF no WhatsApp',
  });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CRM Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
