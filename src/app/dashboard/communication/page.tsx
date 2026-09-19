'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageSquare, Smartphone, Mail, Send, Users, CheckCircle2, Sparkles, Filter } from 'lucide-react';

export default function CommunicationPage() {
  const { currentSchool, addNotification } = useApp();

  const [targetAudience, setTargetAudience] = useState<'ALL_PARENTS' | 'ALL_TEACHERS' | 'CLASS_3A'>('ALL_PARENTS');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [subject, setSubject] = useState('Information Importante : Réunion Parents-Professeurs');
  const [message, setMessage] = useState('Chers parents,\n\nNous vous convions à la réunion trimestrielle de remise des bulletins ce samedi à 09h00 au sein de l\'établissement.\n\nLa Direction.');
  const [isSent, setIsSent] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    addNotification({
      title: subject,
      message,
      type: 'ANNOUNCEMENT',
      channel,
      recipient: targetAudience === 'ALL_PARENTS' ? 'Tous les Parents (842)' : targetAudience === 'ALL_TEACHERS' ? 'Corps Professoral (54)' : 'Classe de 3ème A (29)',
    });

    setTimeout(() => {
      setIsSent(false);
      setMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Passerelle WhatsApp & SMS</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Centre de Communication & Diffusions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Envoi de messages collectifs aux parents, professeurs ou classes spécifiques sans quitter la plateforme
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire d'envoi */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            {/* Destinataires */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Groupe Destinataire :</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'ALL_PARENTS', label: 'Tous les Parents (842)' },
                  { id: 'ALL_TEACHERS', label: 'Enseignants (54)' },
                  { id: 'CLASS_3A', label: 'Classe 3ème A (29)' },
                ].map((aud: { id: string; label: string }) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setTargetAudience(aud.id as any)}
                    className={`p-2.5 rounded-xl border font-bold text-left transition ${
                      targetAudience === aud.id
                        ? 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canal */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Canal de Diffusion :</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                    channel === 'WHATSAPP'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Cloud</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                    channel === 'SMS'
                      ? 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>SMS Direct</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('EMAIL')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                    channel === 'EMAIL'
                      ? 'bg-purple-50 border-purple-400 text-purple-700 ring-2 ring-purple-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Objet */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Objet / Sujet *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Message *</label>
              <textarea
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-sans leading-relaxed text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Expéditeur : <strong>{currentSchool.name}</strong>
              </span>
              <button
                type="submit"
                disabled={isSent}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition hover:scale-105"
              >
                {isSent ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4" />}
                <span>{isSent ? 'Campagne Envoyée !' : `Diffuser via ${channel}`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Historique et passerelles */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Statut des Passerelles Télécoms
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="font-semibold text-slate-700">WhatsApp Business API</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Actif</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="font-semibold text-slate-700">Passerelle SMS Sonatel / Orange</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Connecté</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <span className="font-semibold text-slate-700">Serveur SMTP Établissement</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Opérationnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
