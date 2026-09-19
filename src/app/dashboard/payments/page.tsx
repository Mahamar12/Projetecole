'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PaymentRecord, PaymentMethod } from '@/types';
import { formatFCFA, formatCompactFCFA } from '@/lib/currency';
import { 
  CreditCard, Search, PlusCircle, Printer, 
  Smartphone, Banknote, Building, CheckCircle2, 
  Filter, Download, ArrowUpRight 
} from 'lucide-react';
import NewPaymentModal from '@/components/payments/NewPaymentModal';
import ReceiptModal from '@/components/documents/ReceiptModal';

export default function PaymentsPage() {
  const { payments } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  const filteredPayments = payments.filter((p: PaymentRecord) => {
    const matchSearch = 
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.transactionRef && p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchMethod = selectedMethod === 'ALL' || p.method === selectedMethod;

    return matchSearch && matchMethod;
  });

  const totalFiltered = filteredPayments.reduce((acc: number, p: PaymentRecord) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Trésorerie & Encaissements</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Journal des Paiements & Reçus ({payments.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique des encaissements Wave, Orange Money, Espèces et édition de reçus certifiés
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Journal</span>
          </button>
          <button
            onClick={() => setIsNewPaymentOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Encaisser un Paiement</span>
          </button>
        </div>
      </div>

      {/* Filter & Summary Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par élève, matricule, reçu (REC-...), réf Wave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Tous modes</option>
            <option value="WAVE">Wave</option>
            <option value="ORANGE_MONEY">Orange Money</option>
            <option value="CASH">Espèces</option>
            <option value="BANK_TRANSFER">Virement Bancaire</option>
          </select>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Encaissé Filtré</span>
          <div className="font-heading font-black text-base text-emerald-600">
            {formatFCFA(totalFiltered)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Reçu & Date</th>
                <th className="p-4">Élève & Classe</th>
                <th className="p-4">Payeur / Parent</th>
                <th className="p-4">Motif / Tranche</th>
                <th className="p-4">Méthode & Réf</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p: PaymentRecord) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-900">{p.receiptNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.paidAt}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{p.studentName}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{p.className} • {p.matricule}</div>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">
                    {p.parentName}
                  </td>
                  <td className="p-4 text-slate-800 font-semibold">
                    {p.feeType}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      p.method === 'WAVE' ? 'bg-blue-100 text-blue-800' :
                      p.method === 'ORANGE_MONEY' ? 'bg-orange-100 text-orange-800' :
                      p.method === 'CASH' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {p.method}
                    </span>
                    {p.transactionRef && (
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                        {p.transactionRef}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right font-heading font-black text-sm text-emerald-600">
                    {formatFCFA(p.amount)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Reçu PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isNewPaymentOpen && (
        <NewPaymentModal isOpen={isNewPaymentOpen} onClose={() => setIsNewPaymentOpen(false)} />
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
