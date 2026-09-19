'use client';

import React, { useState } from 'react';
import { StudentFee } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatFCFA } from '@/lib/currency';
import { X, Send, MessageSquare, Smartphone, Mail, CheckCircle2, Copy, Sparkles } from 'lucide-react';

interface OverdueReminderModalProps {
  isOpen: boolean;
  fee: StudentFee;
  onClose: () => void;
}

export default function OverdueReminderModal({ isOpen, fee, onClose }: OverdueReminderModalProps) {
  const { currentSchool, addNotification } = useApp();
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [tone, setTone] = useState<'COURTOIS' | 'FERME' | 'URGENT'>('COURTOIS');
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const templates = {
    COURTOIS: `Bonjour M./Mme ${fee.parentName},\n\nSauf erreur de notre part, la scolarité (${fee.feeType}) de votre enfant ${fee.studentName} (${fee.className}) présente un solde de ${formatFCFA(fee.dueAmount)} arrivé à échéance.\n\nVous pouvez effectuer votre règlement en ligne via Wave ou Orange Money, ou directement auprès de la caisse de l'établissement.\n\nCordialement,\nLa Direction - ${currentSchool.name}`,
    FERME: `RAPPEL ÉCHÉANCE :\nM./Mme ${fee.parentName}, nous vous informons que le paiement de la scolarité de ${fee.studentName} (${fee.className}) accuse un retard de ${fee.daysOverdue} jours pour un montant de ${formatFCFA(fee.dueAmount)}.\n\nMerci de régulariser la situation sous 48h afin d'éviter toute perturbation dans le suivi scolaire de l'élève.\n\nService Comptabilité - ${currentSchool.name}`,
    URGENT: `URGENT - DERNIER AVIS AVANT SUSPENSION :\nM./Mme ${fee.parentName}, le dossier de ${fee.studentName} (${fee.className}) présente un impayé critique de ${formatFCFA(fee.dueAmount)} en retard de ${fee.daysOverdue} jours.\n\nPrière de contacter d'urgence la direction financière au ${currentSchool.phone}.\n\nDirection - ${currentSchool.name}`,
  };

  const currentMessage = templates[tone];

  const handleSend = () => {
    setIsSent(true);
    addNotification({
      title: `Relance ${channel} Envoyée`,
      message: `Rappel de ${formatFCFA(fee.dueAmount)} envoyé à ${fee.parentName} pour ${fee.studentName}.`,
      type: 'PAYMENT_OVERDUE',
      channel,
      recipient: `${fee.parentName} (${fee.parentPhone})`,
    });
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5" />
            <div>
              <h3 className="font-heading font-bold text-base">Envoyer une Relance de Paiement</h3>
              <p className="text-[11px] text-blue-100">WhatsApp, SMS direct et notification interne</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-blue-800/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Summary Banner */}
          <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">{fee.studentName} ({fee.className})</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Parent : {fee.parentName} • {fee.parentPhone}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-rose-600">Retard {fee.daysOverdue} jours</span>
              <div className="font-black text-rose-700 text-sm">{formatFCFA(fee.dueAmount)}</div>
            </div>
          </div>

          {/* Canal de diffusion */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Canal de Transmission :</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('WHATSAPP')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  channel === 'WHATSAPP' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  channel === 'SMS' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-400' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>SMS GSM</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('EMAIL')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  channel === 'EMAIL' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-400' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Mail className="w-4 h-4 text-purple-600" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Tonalité */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Modèle / Tonalité du Message :</label>
            <div className="flex items-center gap-2">
              {(['COURTOIS', 'FERME', 'URGENT'] as const).map((t: 'COURTOIS' | 'FERME' | 'URGENT') => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                    tone === t
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t === 'COURTOIS' ? '1. Courtois' : t === 'FERME' ? '2. Ferme' : '3. Urgent'}
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu du Message */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Contenu du Message Personnalisé :</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={currentMessage}
              className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Annuler
          </button>
          
          <button
            type="button"
            onClick={handleSend}
            disabled={isSent}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/30 transition flex items-center gap-2"
          >
            {isSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Relance Envoyée !</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Envoyer via {channel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
