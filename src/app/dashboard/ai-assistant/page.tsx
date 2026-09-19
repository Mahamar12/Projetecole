'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatFCFA } from '@/lib/currency';
import { Bot, Sparkles, Send, User, ShieldCheck, CornerDownLeft } from 'lucide-react';

interface ChatMessage {
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
}

export default function AiAssistantPage() {
  const { currentSchool, overdueFees, students, classes } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'AI',
      text: `Bonjour ! Je suis l'Assistant IA d'EduGestion Africa pour ${currentSchool.name}. Je peux répondre à vos questions administratives, calculer vos statistiques financières ou rédiger des courriers de relance. Comment puis-je vous aider aujourd'hui ?`,
      timestamp: '09:00',
    }
  ]);

  const quickQuestions = [
    "Combien avons-nous encaissé ce mois-ci ?",
    "Quels sont les impayés de plus de 30 jours ?",
    "Quelle classe a la meilleure moyenne générale ?",
    "Rédige un message de rappel de paiement poli pour M. Diop",
    "Combien d'élèves sont inscrits et quel est le taux de présence ?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    // Generate smart response based on real context
    setTimeout(() => {
      let aiReply = "Je consulte la base de données de l'établissement...";

      if (query.includes('encaissé') || query.includes('mois')) {
        aiReply = `Pour ce mois de Février 2025, ${currentSchool.name} a encaissé un montant total de **18 450 000 FCFA** (dont 54% via Wave, 28% via Orange Money, et 18% en espèces/virements). Le cumul depuis la rentrée d'octobre s'élève à **140 050 000 FCFA**.`;
      } else if (query.includes('impayés') || query.includes('30 jours')) {
        aiReply = `Actuellement, nous comptabilisons **${overdueFees.length} dossiers en souffrance**, pour un total de **${formatFCFA(overdueFees.reduce((a: number, b: { dueAmount: number }) => a + b.dueAmount, 0))}**. Les cas prioritaires de plus de 30 jours sont : Aïssatou Sarr (3ème A - 200 000 FCFA, 45j) et Moussa Diop (6ème A - 50 000 FCFA, 50j). Vous pouvez déclencher des relances WhatsApp directement depuis l'onglet Impayés.`;
      } else if (query.includes('moyenne') || query.includes('classe')) {
        aiReply = `Pour le 1er trimestre 2024-2025, la classe ayant la meilleure moyenne est la **CM2 A** avec **15.60 / 20**, suivie de la **1ère S1** avec **15.20 / 20** et de la **3ème A** avec **14.70 / 20**. L'élève ayant la meilleure moyenne individuelle est **Fatou Diop** (CM2 A, 17.20/20) et **Babacar Fall** (1ère S1, 16.80/20).`;
      } else if (query.includes('Diop') || query.includes('rappel') || query.includes('message')) {
        aiReply = `Voici un projet de message de relance adapté pour M. Mamadou Diop :\n\n"Bonjour M. Diop,\nSauf erreur de notre part, la 3ème tranche de scolarité de votre enfant Awa Diop (3ème A) d'un montant de 100 000 FCFA arrive à échéance ce 28 février.\nVous pouvez régler facilement en ligne par Wave ou Orange Money depuis votre espace parent.\nBien cordialement,\nLa Direction - ${currentSchool.name}"`;
      } else {
        aiReply = `L'établissement ${currentSchool.name} compte **842 élèves inscrits** répartis dans 24 classes, avec un corps professoral de 54 enseignants. Le taux de présence enregistré ce matin est de **94.2%** (793 élèves présents). Toutes les données sont rigoureusement isolées au sein de votre environnement d'école.`;
      }

      const aiMsg: ChatMessage = {
        sender: 'AI',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-orange-800 text-xs font-bold mb-1 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>EduAI • Assistant Scolaire Contextuel</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Assistant IA Administratif & Décisionnel
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interrogez vos effectifs, vos finances, vos moyennes ou rédigez des communications automatiques
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Isolation Stricte Multi-Tenant</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'AI' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'USER'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
                <div className={`text-[9px] mt-1.5 text-right ${m.sender === 'USER' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'USER' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  DIR
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 text-[11px] font-semibold shrink-0 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Posez votre question sur les élèves, finances, impayés ou rédigez une note..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
