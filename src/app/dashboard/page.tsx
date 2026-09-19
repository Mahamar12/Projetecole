'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatFCFA, formatCompactFCFA, calculatePercentage } from '@/lib/currency';
import { 
  Users, GraduationCap, School, CreditCard, 
  AlertTriangle, TrendingUp, CheckCircle2, Clock, 
  ArrowUpRight, ArrowDownRight, Smartphone, MessageSquare, 
  Printer, PlusCircle, Award, Calendar, ChevronRight, UserPlus
} from 'lucide-react';
import NewPaymentModal from '@/components/payments/NewPaymentModal';
import NewStudentModal from '@/components/modals/NewStudentModal';
import OverdueReminderModal from '@/components/modals/OverdueReminderModal';
import ReceiptModal from '@/components/documents/ReceiptModal';
import { PaymentRecord, StudentFee, AttendanceRecord } from '@/types';

export default function DirectorDashboardPage() {
  const { currentSchool, students, teachers, classes, payments, overdueFees, attendances } = useApp();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedOverdueFee, setSelectedOverdueFee] = useState<StudentFee | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Financial aggregates
  const totalCollectedThisMonth = 18450000;
  const totalExpectedThisYear = 294000000;
  const totalOverdueAmount = overdueFees.reduce((acc: number, f: StudentFee) => acc + f.dueAmount, 0) || 4250000;

  // Attendance stats for today
  const totalAttendanceLogged = attendances.length;
  const presentsCount = attendances.filter((a: AttendanceRecord) => a.status === 'PRESENT').length;
  const absentsCount = attendances.filter((a: AttendanceRecord) => a.status === 'ABSENT').length;
  const retardsCount = attendances.filter((a: AttendanceRecord) => a.status === 'RETARD').length;
  const presenceRate = totalAttendanceLogged > 0 ? ((presentsCount / totalAttendanceLogged) * 100).toFixed(1) : '94.2';

  const monthlyCollections = [
    { month: 'Oct', amount: 38200000, height: '80%' },
    { month: 'Nov', amount: 24500000, height: '55%' },
    { month: 'Déc', amount: 16800000, height: '35%' },
    { month: 'Jan', amount: 42100000, height: '95%' },
    { month: 'Fév', amount: 18450000, height: '42%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-700 text-blue-300 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Direction Générale • Tableau de Bord 360°</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Bonjour, Direction {currentSchool.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            Session 2024-2025 • {currentSchool.totalStudents} élèves inscrits • Rentrée du 2ème trimestre
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs shadow-lg shadow-emerald-500/20 transition hover:scale-105 active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Encaisser Paiement</span>
          </button>

          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs shadow-lg shadow-blue-600/20 transition hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvel Élève</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 : Effectif Élèves */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Effectif Élèves</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl text-slate-900">842</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% par rapport à 2023</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>24 Classes</span>
            <Link href="/dashboard/students" className="font-bold text-blue-600 hover:underline">
              Gérer →
            </Link>
          </div>
        </div>

        {/* Card 2 : Encaissé ce Mois */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Encaissé Février</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl text-emerald-600">
              {formatCompactFCFA(totalCollectedThisMonth)}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              {formatFCFA(totalCollectedThisMonth)}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Wave & OM : 82%</span>
            <Link href="/dashboard/payments" className="font-bold text-emerald-600 hover:underline">
              Reçus →
            </Link>
          </div>
        </div>

        {/* Card 3 : Impayés */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Impayés & Retards</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl text-rose-600">
              {formatCompactFCFA(totalOverdueAmount)}
            </div>
            <div className="text-[11px] font-semibold text-rose-500 mt-0.5">
              {overdueFees.length} dossiers nécessitant relance
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Retard moyen: 28j</span>
            <Link href="/dashboard/overdue" className="font-bold text-rose-600 hover:underline">
              Relancer →
            </Link>
          </div>
        </div>

        {/* Card 4 : Présence Aujourd'hui */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Présence Jour</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl text-indigo-600">
              {presenceRate} %
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              793 Présents • 49 Absents/Retards
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Appel fait à 100%</span>
            <Link href="/dashboard/attendance" className="font-bold text-indigo-600 hover:underline">
              Appel GSM →
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2 : Charts & Financial Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart Simulator */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Évolution des Encaissements Scolaires (2024-2025)
              </h3>
              <p className="text-xs text-slate-500">Paiements de scolarité, inscription, cantine et transport</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              Total Cumulé : 140 050 000 FCFA
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
            {monthlyCollections.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {formatCompactFCFA(m.amount)}
                </span>
                <div 
                  className="w-full max-w-[48px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-xl group-hover:from-emerald-600 group-hover:to-emerald-400 transition-all duration-300 shadow-sm"
                  style={{ height: m.height }}
                />
                <span className="text-xs font-bold text-slate-600">{m.month}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs pt-2">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Tranche 1 (Oct)</div>
              <div className="font-bold text-slate-800">Recouvert à 98%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Tranche 2 (Jan)</div>
              <div className="font-bold text-emerald-600">Recouvert à 91%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Tranche 3 (Avril)</div>
              <div className="font-bold text-amber-600">À venir</div>
            </div>
          </div>
        </div>

        {/* Mobile Money Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-base">
              Moyens de Paiement
            </h3>
            <p className="text-xs text-slate-500">Répartition des encaissements</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Smartphone className="w-3.5 h-3.5" /> Wave Mobile Money
                </span>
                <span className="font-bold text-slate-900">54 %</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-orange-700">
                  <Smartphone className="w-3.5 h-3.5" /> Orange Money
                </span>
                <span className="font-bold text-slate-900">28 %</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 font-semibold">Espèces (Caisse Centrale)</span>
                <span className="font-bold text-slate-900">12 %</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-purple-700 font-semibold">Virements / Chèques</span>
                <span className="font-bold text-slate-900">6 %</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl text-[11px] text-blue-900 leading-relaxed">
            <span className="font-bold">Gain d'efficacité :</span> 82% des paiements sont traités sans contact ni déplacement physique des parents.
          </div>
        </div>
      </div>

      {/* Row 3 : Recent Payments & Top Overdue Debts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers Paiements Enregistrés */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Derniers Encaissements</h3>
              <p className="text-xs text-slate-500">Reçus officiels émis en temps réel</p>
            </div>
            <Link href="/dashboard/payments" className="text-xs font-bold text-blue-600 hover:underline">
              Voir tout ({payments.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {payments.slice(0, 4).map((p: PaymentRecord) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{p.studentName} ({p.className})</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {p.receiptNumber} • {p.method} • {p.paidAt}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div className="font-extrabold text-emerald-600 text-xs">
                    {formatFCFA(p.amount)}
                  </div>
                  <button
                    onClick={() => setSelectedReceipt(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                    title="Voir / Imprimer le reçu"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dossiers d'Impayés Prioritaires */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Impayés Prioritaires</h3>
              <p className="text-xs text-slate-500">Relances WhatsApp & SMS directes</p>
            </div>
            <Link href="/dashboard/overdue" className="text-xs font-bold text-rose-600 hover:underline">
              Gestionnaire ({overdueFees.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {overdueFees.slice(0, 4).map((f: StudentFee) => (
              <div key={f.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div>
                  <div className="font-bold text-slate-900">{f.studentName} ({f.className})</div>
                  <div className="text-[10px] text-slate-500">
                    Parent : {f.parentName} • <span className="text-rose-600 font-bold">Retard {f.daysOverdue}j</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right font-black text-rose-600 text-xs">
                    {formatFCFA(f.dueAmount)}
                  </div>
                  <button
                    onClick={() => setSelectedOverdueFee(f)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 transition"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Relancer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modales */}
      {isPaymentModalOpen && (
        <NewPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
      )}
      {isStudentModalOpen && (
        <NewStudentModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} />
      )}
      {selectedOverdueFee && (
        <OverdueReminderModal
          isOpen={true}
          fee={selectedOverdueFee}
          onClose={() => setSelectedOverdueFee(null)}
        />
      )}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={true}
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
