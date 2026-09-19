'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatFCFA } from '@/lib/currency';
import { BarChart3, Download, FileSpreadsheet, Printer, TrendingUp, Users, CreditCard } from 'lucide-react';

export default function ReportsPage() {
  const reportsList = [
    { title: 'Rapport Financier Annuel & Trésorerie', type: 'Finances', period: '2024-2025', size: '2.4 MB PDF', icon: CreditCard },
    { title: 'État Récapitulatif des Impayés par Classe', type: 'Recouvrement', period: 'Février 2025', size: '850 KB Excel', icon: FileSpreadsheet },
    { title: 'Rapport Global des Présences et Absences', type: 'Vie Scolaire', period: 'Trimestre 1', size: '1.1 MB PDF', icon: BarChart3 },
    { title: 'Statistiques Pédagogiques & Moyennes par Matière', type: 'Pédagogie', period: 'Trimestre 1', size: '1.8 MB PDF', icon: TrendingUp },
    { title: 'Registre Matriculaire & Dossiers Inscriptions', type: 'Effectifs', period: 'Année 2024-2025', size: '3.2 MB Excel', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analyses & États de Synthèse</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Centre de Rapports & Exports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Génération et téléchargement des bilans financiers, pédagogiques et administratifs (PDF / Excel)
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map((rep: any, idx: number) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <rep.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">{rep.title}</h3>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {rep.type} • {rep.period} • {rep.size}
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
