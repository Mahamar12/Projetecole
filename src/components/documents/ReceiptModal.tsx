'use client';

import React from 'react';
import { PaymentRecord } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatFCFA } from '@/lib/currency';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  payment: PaymentRecord;
  onClose: () => void;
}

export default function ReceiptModal({ isOpen, payment, onClose }: ReceiptModalProps) {
  const { currentSchool } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm no-print" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Actions bar (hidden during print) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-heading font-bold text-sm">Reçu de Paiement Officiel Sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 overflow-y-auto printable-page printable-receipt bg-white text-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="text-xl font-heading font-extrabold text-blue-900 uppercase tracking-tight">
                {currentSchool.name}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                {currentSchool.slogan}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {currentSchool.address} • {currentSchool.city} ({currentSchool.country})
              </div>
              <div className="text-[11px] text-slate-500">
                Tél : {currentSchool.phone} • Email : {currentSchool.email}
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold uppercase tracking-wider mb-1">
                Reçu de Caisse
              </div>
              <div className="font-mono font-bold text-slate-900 text-sm">
                N° {payment.receiptNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Date : {payment.paidAt}
              </div>
            </div>
          </div>

          {/* Student & Parent Info */}
          <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Informations Élève</div>
              <div className="font-extrabold text-slate-900 text-sm">{payment.studentName}</div>
              <div className="text-slate-600 font-mono mt-0.5">Matricule : {payment.matricule}</div>
              <div className="text-slate-600 font-medium">Classe : <span className="font-bold text-blue-700">{payment.className}</span></div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Payeur / Responsable</div>
              <div className="font-bold text-slate-900 text-sm">{payment.parentName}</div>
              <div className="text-slate-600 mt-0.5">Mode : <span className="font-bold text-slate-800">{payment.method}</span></div>
              {payment.transactionRef && (
                <div className="text-slate-600 font-mono text-[11px]">
                  Réf : <span className="font-semibold text-emerald-700">{payment.transactionRef}</span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Désignation / Motif</th>
                  <th className="p-3 text-center">Année Scolaire</th>
                  <th className="p-3 text-center">Statut</th>
                  <th className="p-3 text-right">Montant Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">
                    {payment.feeType}
                    {payment.note && <div className="text-[10px] text-slate-400 font-normal">{payment.note}</div>}
                  </td>
                  <td className="p-3 text-center text-slate-600">2024 - 2025</td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Payé
                    </span>
                  </td>
                  <td className="p-3 text-right font-extrabold text-slate-900 text-sm">
                    {formatFCFA(payment.amount)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-900 font-bold">
                <tr>
                  <td colSpan={3} className="p-3 text-right text-slate-700 uppercase text-[11px]">
                    Total Règlement Net :
                  </td>
                  <td className="p-3 text-right text-emerald-700 text-base font-black">
                    {formatFCFA(payment.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Security stamp, QR and Signature */}
          <div className="flex items-end justify-between pt-4 border-t border-dashed border-slate-300">
            {/* QR verification */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center p-2">
                <QrCode className="w-12 h-12" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight max-w-[160px]">
                <span className="font-bold text-slate-700">Authentification Numérique :</span><br />
                Scannez pour vérifier l'authenticité de ce reçu sur EduGestion Africa.
              </div>
            </div>

            {/* Signature & Cachet */}
            <div className="text-center">
              <div className="text-[11px] font-bold text-slate-700 uppercase mb-1">
                Le Service Comptabilité & Caisse
              </div>
              <div className="w-36 h-16 border border-slate-300 border-dashed rounded-xl flex flex-col items-center justify-center bg-slate-50/50 relative">
                <div className="text-[10px] text-emerald-700 font-extrabold uppercase rotate-[-8deg] border-2 border-emerald-600 px-2 py-0.5 rounded">
                  ★ PAYÉ & ENCAISSÉ ★
                </div>
                <div className="text-[9px] text-slate-400 mt-1">EIS DAKAR - CAISSE</div>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                {payment.recordedBy}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
