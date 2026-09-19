'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings, Save, CheckCircle2, Building, Smartphone, Bell, Globe, ShieldCheck } from 'lucide-react';

export default function SchoolSettingsPage() {
  const { currentSchool, updateSchool } = useApp();

  const [name, setName] = useState(currentSchool.name);
  const [slogan, setSlogan] = useState(currentSchool.slogan || '');
  const [phone, setPhone] = useState(currentSchool.phone);
  const [email, setEmail] = useState(currentSchool.email);
  const [address, setAddress] = useState(currentSchool.address);
  const [city, setCity] = useState(currentSchool.city);
  const [currency, setCurrency] = useState(currentSchool.currency);
  const [smsSender, setSmsSender] = useState('EIS-DAKAR');
  const [waveEnabled, setWaveEnabled] = useState(true);
  const [orangeMoneyEnabled, setOrangeMoneyEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      name,
      slogan,
      phone,
      email,
      address,
      city,
      currency,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Configuration Établissement</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Paramètres & Passerelles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identité de l'école, devise FCFA, intégration Wave / Orange Money et passerelle SMS
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition hover:scale-105"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Modifications Enregistrées !' : 'Enregistrer'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identité de l'établissement */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-heading font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Identité & En-tête des Bulletins</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nom de l'école *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Devise / Slogan officiel</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Téléphone officiel</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email de contact</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Adresse</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ville & Pays</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Passerelles de paiement & SMS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Passerelles Mobile Money (UEMOA)</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-900">Passerelle Wave Mobile Money</div>
                  <div className="text-[10px] text-slate-500">Paiement QR & API direct (Sénégal & Côte d'Ivoire)</div>
                </div>
                <input
                  type="checkbox"
                  checked={waveEnabled}
                  onChange={(e) => setWaveEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-orange-900">Passerelle Orange Money</div>
                  <div className="text-[10px] text-slate-500">Paiement marchand & push USSD</div>
                </div>
                <input
                  type="checkbox"
                  checked={orangeMoneyEnabled}
                  onChange={(e) => setOrangeMoneyEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-purple-600" />
              <span>Notifications & SMS Sender ID</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nom d'expéditeur SMS (Sender ID)</label>
              <input
                type="text"
                value={smsSender}
                onChange={(e) => setSmsSender(e.target.value)}
                maxLength={11}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Maximum 11 caractères (ex: EIS-DAKAR)</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
