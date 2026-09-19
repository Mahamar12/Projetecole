'use client';

import React, { useState } from 'react';
import { formatFCFA } from '@/lib/currency';
import { DollarSign, PlusCircle, Layers, Calendar, CheckCircle2 } from 'lucide-react';

export default function FeeStructurePage() {
  const feeGrids = [
    {
      cycle: 'PRÉSCOLAIRE & ÉLÉMENTAIRE (CI - CM2)',
      inscription: 40000,
      scolariteAnnuelle: 280000,
      tranches: [
        { name: 'Tranche 1 (Octobre)', amount: 120000 },
        { name: 'Tranche 2 (Janvier)', amount: 80000 },
        { name: 'Tranche 3 (Avril)', amount: 80000 },
      ],
      options: [
        { name: 'Cantine Demi-Pension', amount: 120000 },
        { name: 'Transport Scolaire Zone 1', amount: 150000 },
        { name: 'Tenue & Uniforme Officiel', amount: 30000 },
      ]
    },
    {
      cycle: 'ENSEIGNEMENT MOYEN (6e - 3e)',
      inscription: 50000,
      scolariteAnnuelle: 350000,
      tranches: [
        { name: 'Tranche 1 (Octobre)', amount: 150000 },
        { name: 'Tranche 2 (Janvier)', amount: 100000 },
        { name: 'Tranche 3 (Avril)', amount: 100000 },
      ],
      options: [
        { name: 'Cantine Demi-Pension', amount: 140000 },
        { name: 'Transport Scolaire Zone 1 & 2', amount: 180000 },
        { name: 'Pack Manuels & Livres', amount: 45000 },
      ]
    },
    {
      cycle: 'ENSEIGNEMENT SECONDAIRE (2nde - Terminale S/L)',
      inscription: 60000,
      scolariteAnnuelle: 450000,
      tranches: [
        { name: 'Tranche 1 (Octobre)', amount: 200000 },
        { name: 'Tranche 2 (Janvier)', amount: 150000 },
        { name: 'Tranche 3 (Avril)', amount: 100000 },
      ],
      options: [
        { name: 'Transport Scolaire Zone 1 à 3', amount: 200000 },
        { name: 'Frais d\'Examen Baccalauréat', amount: 25000 },
        { name: 'Laboratoire & Travaux Pratiques', amount: 35000 },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Politique Tarifaire & Échéanciers</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Grille des Frais Scolaires (FCFA)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Paramétrage des frais d'inscription, des tranches de scolarité et des services annexes
          </p>
        </div>
      </div>

      {/* Grids per cycle */}
      <div className="space-y-6">
        {feeGrids.map((grid: any, idx: number) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-700">Cycle Éducatif</span>
                <h3 className="font-heading font-black text-lg text-slate-900">{grid.cycle}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Inscription : <strong className="text-slate-900">{formatFCFA(grid.inscription)}</strong></span>
                <span className="text-xs font-semibold text-slate-500">Scolarité : <strong className="text-emerald-700 text-sm font-black">{formatFCFA(grid.scolariteAnnuelle)}</strong></span>
              </div>
            </div>

            {/* Tranches & Echéances */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Échéancier en 3 Tranches :</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {grid.tranches.map((t: any, i: number) => (
                  <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div className="text-[11px] text-slate-500 font-semibold">{t.name}</div>
                    <div className="font-heading font-black text-base text-slate-900 mt-0.5">
                      {formatFCFA(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Options et services annexes */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">Services Optionnels & Frais Annexes :</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {grid.options.map((opt: any, i: number) => (
                  <div key={i} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{opt.name}</span>
                    <span className="font-bold text-blue-900">{formatFCFA(opt.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
