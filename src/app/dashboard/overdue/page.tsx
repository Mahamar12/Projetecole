'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StudentFee } from '@/types';
import { formatFCFA, formatCompactFCFA } from '@/lib/currency';
import { 
  AlertTriangle, Clock, Smartphone, MessageSquare, 
  Printer, CheckCircle2, Phone, Calendar, ArrowRight 
} from 'lucide-react';
import OverdueReminderModal from '@/components/modals/OverdueReminderModal';
import NewPaymentModal from '@/components/payments/NewPaymentModal';

export default function OverdueManagementPage() {
  const { overdueFees } = useApp();

  const [selectedDaysFilter, setSelectedDaysFilter] = useState<'ALL' | '7' | '30' | '60' | '90'>('ALL');
  const [selectedOverdueFee, setSelectedOverdueFee] = useState<StudentFee | null>(null);
  const [studentToPayFor, setStudentToPayFor] = useState<string | null>(null);

  const filteredFees = overdueFees.filter((f: StudentFee) => {
    if (selectedDaysFilter === '7') return f.daysOverdue >= 7;
    if (selectedDaysFilter === '30') return f.daysOverdue >= 30;
    if (selectedDaysFilter === '60') return f.daysOverdue >= 60;
    if (selectedDaysFilter === '90') return f.daysOverdue >= 90;
    return true;
  });

  const totalOverdueFiltered = filteredFees.reduce((acc: number, f: StudentFee) => acc + f.dueAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Recouvrement & Créances</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Gestion des Impayés & Relances ({overdueFees.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des retards de scolarité par tranche d'ancienneté et déclenchement de relances WhatsApp/SMS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer État des Dettes</span>
          </button>
        </div>
      </div>

      {/* Aging Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: 'ALL', label: 'Tous les impayés', count: overdueFees.length, color: 'text-slate-900' },
          { id: '7', label: 'Retard ≥ 7 jours', count: overdueFees.filter((f: StudentFee) => f.daysOverdue >= 7).length, color: 'text-amber-600' },
          { id: '30', label: 'Retard ≥ 30 jours', count: overdueFees.filter((f: StudentFee) => f.daysOverdue >= 30).length, color: 'text-orange-600' },
          { id: '60', label: 'Retard ≥ 60 jours', count: overdueFees.filter((f: StudentFee) => f.daysOverdue >= 60).length, color: 'text-rose-600' },
          { id: '90', label: 'Critique ≥ 90j', count: overdueFees.filter((f: StudentFee) => f.daysOverdue >= 90).length, color: 'text-rose-800 font-black' },
        ].map((filter) => {
          const isActive = selectedDaysFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedDaysFilter(filter.id as any)}
              className={`p-3.5 rounded-2xl border text-left transition ${
                isActive 
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400 shadow-sm' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-slate-400">{filter.label}</div>
              <div className={`font-heading font-black text-xl mt-0.5 ${filter.color}`}>
                {filter.count} <span className="text-xs font-normal text-slate-400">cas</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Overdue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="font-heading font-bold text-sm text-slate-800">
            Dossiers en souffrance ({filteredFees.length})
          </div>
          <div className="text-right font-black text-rose-600 text-sm">
            Total Créances : {formatFCFA(totalOverdueFiltered)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève & Classe</th>
                <th className="p-4">Parent / Contact</th>
                <th className="p-4">Motif Impayé</th>
                <th className="p-4">Date d'Échéance</th>
                <th className="p-4 text-center">Retard</th>
                <th className="p-4 text-right">Reste Dû</th>
                <th className="p-4 text-right">Actions Relance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map((fee: StudentFee) => (
                <tr key={fee.id} className="hover:bg-rose-50/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{fee.studentName}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{fee.className} • {fee.matricule}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{fee.parentName}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {fee.parentPhone}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {fee.feeType}
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-[11px]">
                    {fee.dueDate}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                      +{fee.daysOverdue} jours
                    </span>
                  </td>
                  <td className="p-4 text-right font-heading font-black text-sm text-rose-600">
                    {formatFCFA(fee.dueAmount)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOverdueFee(fee)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-300 transition shadow-sm"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Relance WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setStudentToPayFor(fee.studentId)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                      >
                        Encaisser
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {selectedOverdueFee && (
        <OverdueReminderModal
          isOpen={true}
          fee={selectedOverdueFee}
          onClose={() => setSelectedOverdueFee(null)}
        />
      )}
      {studentToPayFor && (
        <NewPaymentModal
          isOpen={true}
          defaultStudentId={studentToPayFor}
          onClose={() => setStudentToPayFor(null)}
        />
      )}
    </div>
  );
}
