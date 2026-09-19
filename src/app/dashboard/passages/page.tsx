'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PromotionRecord, PromotionStatus, Classroom } from '@/types';
import { 
  Award, CheckCircle2, AlertTriangle, XCircle, Clock, 
  Printer, Send, Search, Filter, MessageSquare, ChevronRight, 
  FileText, School, Sparkles, UserCheck, Check, Edit2, ShieldCheck, X
} from 'lucide-react';

export default function PassagesManagementPage() {
  const { currentSchool, promotions, classes, updatePromotion, publishAllPromotions } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [editingPromotion, setEditingPromotion] = useState<PromotionRecord | null>(null);
  const [certModalRecord, setCertModalRecord] = useState<PromotionRecord | null>(null);
  const [isPublishedNotification, setIsPublishedNotification] = useState(false);

  // Statistics
  const totalCount = promotions.length;
  const admisCount = promotions.filter((p: PromotionRecord) => p.status === 'ADMIS').length;
  const redoubleCount = promotions.filter((p: PromotionRecord) => p.status === 'REDOUBLE').length;
  const admisRate = totalCount > 0 ? Math.round((admisCount / totalCount) * 100) : 0;

  // Filtered list
  const filteredPromotions = promotions.filter((p: PromotionRecord) => {
    const matchSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.currentClassName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === 'ALL' || p.currentClassId === selectedClass || p.currentClassName === selectedClass;
    const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const handlePublishAll = () => {
    publishAllPromotions();
    setIsPublishedNotification(true);
    setTimeout(() => setIsPublishedNotification(false), 3000);
  };

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromotion) return;
    updatePromotion(editingPromotion.id, editingPromotion);
    setEditingPromotion(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Délibérations de Fin d'Année & Passage</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Gestion des Admis & Résultats de Passage
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation des passages en classe supérieure, redoublements, mentions et publication aux parents
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer PV Officiel</span>
          </button>

          <button
            onClick={handlePublishAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>{isPublishedNotification ? 'Résultats Publiés aux Parents !' : 'Publier aux Parents'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Taux d'admission */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Taux d'Admission Global</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading font-black text-2xl text-emerald-700">
            {admisRate} %
          </div>
          <div className="text-[11px] font-semibold text-emerald-600">
            {admisCount} élèves admis sur {totalCount}
          </div>
        </div>

        {/* Admis en classe supérieure */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Admis en Classe Supérieure</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-heading font-black text-2xl text-blue-900">
            {admisCount} Élèves
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Passent dans le niveau supérieur
          </div>
        </div>

        {/* Redoublants */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Maintien / Redoublement</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading font-black text-2xl text-amber-600">
            {redoubleCount} Élèves
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Autorisés à redoubler
          </div>
        </div>

        {/* Moyenne Générale Établissement */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Moyenne Générale</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-heading font-black text-2xl text-purple-900">
            15.10 <span className="text-xs font-normal text-slate-400">/ 20</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Année scolaire 2024-2025
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="no-print bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par élève, matricule, classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Selectors */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Toutes les classes</option>
            {classes.map((c: Classroom) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Toutes les décisions</option>
            <option value="ADMIS">🟢 Admis en classe supérieure</option>
            <option value="REDOUBLE">🟡 Redoublement / Maintien</option>
            <option value="REORIENTE">🔴 Réorienté</option>
          </select>
        </div>
      </div>

      {/* Official Promotion List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden printable-page">
        {/* Printable Header only during print */}
        <div className="hidden print:block p-6 border-b-2 border-slate-900 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">RÉPUBLIQUE DU SÉNÉGAL • MINISTÈRE DE L'ÉDUCATION NATIONALE</div>
              <h2 className="font-heading font-black text-xl text-blue-900">{currentSchool.name}</h2>
              <div className="text-xs text-slate-600">Procès-Verbal Officiel des Délibérations de Passage • Année Scolaire 2024-2025</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold border border-slate-900 px-3 py-1 rounded-lg">PV DE DÉLIBÉRATION</div>
              <div className="text-[10px] text-slate-500 mt-1">Dakar, le 28 Juin 2025</div>
            </div>
          </div>
        </div>

        <div className="p-5 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="font-heading font-bold text-base text-slate-900">
            Résultats des Délibérations ({filteredPromotions.length} élèves)
          </div>
          <span className="text-xs text-slate-400">
            Conseil de classe du 3ème trimestre validé
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève & Matricule</th>
                <th className="p-4">Classe Actuelle</th>
                <th className="p-4 text-center">Moyenne Annuelle</th>
                <th className="p-4">Décision du Conseil</th>
                <th className="p-4">Classe Suivante / Destination</th>
                <th className="p-4">Distinction / Mention</th>
                <th className="p-4 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPromotions.map((p: PromotionRecord) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  {/* Élève */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={p.studentName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{p.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.matricule}</div>
                      </div>
                    </div>
                  </td>

                  {/* Classe Actuelle */}
                  <td className="p-4 font-bold text-slate-800">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs">
                      {p.currentClassName}
                    </span>
                  </td>

                  {/* Moyenne Annuelle */}
                  <td className="p-4 text-center">
                    <span className={`font-heading font-black text-sm px-2 py-0.5 rounded-lg ${
                      p.annualAverage >= 14 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      p.annualAverage >= 10 ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                      'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {p.annualAverage.toFixed(2)} / 20
                    </span>
                  </td>

                  {/* Décision du Conseil */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      p.status === 'ADMIS' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      p.status === 'REDOUBLE' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {p.status === 'ADMIS' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                      {p.status === 'REDOUBLE' && <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />}
                      {p.status === 'REORIENTE' && <XCircle className="w-3.5 h-3.5 text-rose-700" />}
                      <span>{p.status === 'ADMIS' ? 'Admis(e)' : p.status === 'REDOUBLE' ? 'Redouble' : 'Réorienté'}</span>
                    </span>
                  </td>

                  {/* Classe Suivante */}
                  <td className="p-4 font-extrabold text-blue-900 text-xs">
                    {p.nextClassName || 'Non définie'}
                  </td>

                  {/* Mention */}
                  <td className="p-4">
                    {p.mention === 'FELICITATIONS' && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-black uppercase">
                        ★ Félicitations
                      </span>
                    )}
                    {p.mention === 'TABLEAU_HONNEUR' && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-black uppercase">
                        Tableau d'Honneur
                      </span>
                    )}
                    {p.mention === 'ENCOURAGEMENTS' && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                        Encouragements
                      </span>
                    )}
                    {p.mention === 'AVERTISSEMENT' && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-black uppercase">
                        Avertissement
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right no-print">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setCertModalRecord(p)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition flex items-center gap-1"
                        title="Imprimer l'attestation de passage officielle"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Attestation</span>
                      </button>

                      <button
                        onClick={() => setEditingPromotion(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Modifier la décision du conseil"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Printable Signatures */}
        <div className="hidden print:grid grid-cols-2 p-8 border-t-2 border-slate-900 text-xs text-slate-800">
          <div>
            <div className="font-bold uppercase">Le Président du Conseil de Classe</div>
            <div className="h-16 flex items-center italic text-slate-400 text-[11px]">
              M. Ibrahima Diallo (Professeur Principal)
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold uppercase">Le Chef d'Établissement & Sceau Officiel</div>
            <div className="h-16 flex flex-col items-end justify-center">
              <div className="text-[9px] text-blue-900 font-bold border border-blue-900 px-2.5 py-0.5 rounded rotate-[-3deg] bg-blue-50 uppercase">
                Certifié Conforme • EIS DAKAR
              </div>
              <div className="text-[10px] font-bold text-slate-900 mt-1">M. Amadou Diallo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Decision */}
      {editingPromotion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingPromotion(null)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-600">Délibération de Conseil</div>
                <h3 className="font-heading font-black text-lg text-slate-900">
                  {editingPromotion.studentName} ({editingPromotion.matricule})
                </h3>
              </div>
              <button
                onClick={() => setEditingPromotion(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDecision} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Décision Finale *</label>
                  <select
                    value={editingPromotion.status}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, status: e.target.value as PromotionStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ADMIS">🟢 ADMIS EN CLASSE SUPÉRIEURE</option>
                    <option value="REDOUBLE">🟡 AUTORISÉ À REDOUBLER</option>
                    <option value="REORIENTE">🔴 RÉORIENTÉ / EXCLU</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Classe Suivante (Destination) *</label>
                  <input
                    type="text"
                    required
                    value={editingPromotion.nextClassName || ''}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, nextClassName: e.target.value })}
                    placeholder="ex: 2nde S, 5ème A, Terminale S1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-blue-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Distinction / Mention</label>
                <select
                  value={editingPromotion.mention || 'AUCUNE'}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, mention: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="FELICITATIONS">★ Félicitations du Conseil</option>
                  <option value="TABLEAU_HONNEUR">Tableau d'Honneur</option>
                  <option value="ENCOURAGEMENTS">Encouragements</option>
                  <option value="AVERTISSEMENT">Avertissement Travail/Discipline</option>
                  <option value="AUCUNE">Aucune mention spécifique</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Appréciation Officielle du Conseil</label>
                <textarea
                  rows={3}
                  value={editingPromotion.councilObservation || ''}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, councilObservation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingPromotion(null)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Enregistrer la Délibération
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Modal (A4 Printable) */}
      {certModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setCertModalRecord(null)} />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 p-8 space-y-6">
            {/* Action top bar */}
            <div className="no-print flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-xs text-slate-500">Aperçu officiel avant impression</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer l'Attestation (A4)</span>
                </button>
                <button
                  onClick={() => setCertModalRecord(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Certificate Document */}
            <div className="border-4 border-double border-slate-900 p-8 space-y-6 text-slate-900 font-sans">
              <div className="text-center space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  RÉPUBLIQUE DU SÉNÉGAL • INSPECTION D'ACADÉMIE DE DAKAR
                </div>
                <h1 className="font-heading font-black text-2xl text-blue-900 uppercase">
                  {currentSchool.name}
                </h1>
                <div className="text-xs italic text-slate-600">
                  {currentSchool.address} • Tél: {currentSchool.phone}
                </div>
              </div>

              <div className="text-center py-3 bg-slate-50 border-y-2 border-slate-900">
                <h2 className="font-heading font-black text-lg tracking-wider uppercase text-slate-900">
                  ATTESTATION DE PASSAGE EN CLASSE SUPÉRIEURE
                </h2>
                <div className="text-[11px] font-bold text-blue-900 font-mono mt-0.5">
                  Année Scolaire 2024 - 2025
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                <p>
                  Le Chef d'Établissement soussigné certifie que l'élève :
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-heading font-black text-base text-blue-950">
                    {certModalRecord.studentName}
                  </div>
                  <div className="text-xs text-slate-600">
                    Matricule : <strong className="font-mono">{certModalRecord.matricule}</strong> • Classe suivie en 2024-2025 : <strong>{certModalRecord.currentClassName}</strong>
                  </div>
                </div>
                <p>
                  A obtenu pour l'année scolaire 2024-2025 une moyenne générale annuelle de :{' '}
                  <strong className="font-black text-blue-900 text-base">{certModalRecord.annualAverage.toFixed(2)} / 20</strong>.
                </p>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                  <div className="font-bold text-xs uppercase text-emerald-700">Décision Officielle du Conseil des Professeurs :</div>
                  <div className="font-heading font-black text-base text-emerald-900 mt-1">
                    {certModalRecord.status === 'ADMIS'
                      ? `ADMIS(E) EN CLASSE DE : ${certModalRecord.nextClassName}`
                      : `MAINTIEN / REDOUBLEMENT EN : ${certModalRecord.currentClassName}`}
                  </div>
                  {certModalRecord.councilObservation && (
                    <div className="text-xs mt-1 italic text-emerald-800">
                      « {certModalRecord.councilObservation} »
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 pt-2">
                  En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Date de délivrance</div>
                  <div className="font-bold">28 Juin 2025</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Le Directeur Général & Sceau</div>
                  <div className="font-bold text-blue-900">M. Amadou Diallo</div>
                  <div className="text-[9px] text-blue-800 border border-blue-800 px-2 py-0.5 rounded rotate-[-3deg] inline-block mt-1 font-bold">
                    VU ET APPROUVÉ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
