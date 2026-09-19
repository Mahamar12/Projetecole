'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PaymentMethod, PaymentRecord, Student } from '@/types';
import { formatFCFA } from '@/lib/currency';
import { 
  X, CreditCard, CheckCircle2, User, Phone, 
  Smartphone, Wallet, Building, Banknote, Sparkles, Printer
} from 'lucide-react';
import ReceiptModal from '@/components/documents/ReceiptModal';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
}

export default function NewPaymentModal({ isOpen, onClose, defaultStudentId }: NewPaymentModalProps) {
  const { students, addPayment } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId || (students[0]?.id || ''));
  const [amount, setAmount] = useState<number>(100000);
  const [method, setMethod] = useState<PaymentMethod>('WAVE');
  const [feeType, setFeeType] = useState<string>('Scolarité (Tranche 2)');
  const [transactionRef, setTransactionRef] = useState<string>('WAV-SN-' + Math.floor(100000 + Math.random() * 900000));
  const [note, setNote] = useState<string>('');
  
  const [recordedPayment, setRecordedPayment] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  const currentStudent = students.find((s: Student) => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const payment = addPayment({
      studentId: currentStudent.id,
      studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
      matricule: currentStudent.matricule,
      className: currentStudent.className,
      parentName: currentStudent.parentName,
      amount: Number(amount),
      method,
      status: 'COMPLETED',
      feeType,
      transactionRef: method === 'CASH' ? undefined : transactionRef,
      recordedBy: 'M. Sow (Comptable Principal)',
      note,
    });

    setRecordedPayment(payment);
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: any; color: string; badge: string }[] = [
    { id: 'WAVE', label: 'Wave Mobile Money', icon: Smartphone, color: 'border-blue-500 bg-blue-50/50 text-blue-700', badge: '1% Frais' },
    { id: 'ORANGE_MONEY', label: 'Orange Money (OM)', icon: Smartphone, color: 'border-orange-500 bg-orange-50/50 text-orange-700', badge: 'Populaire' },
    { id: 'CASH', label: 'Espèces (Caisse)', icon: Banknote, color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700', badge: 'Immédiat' },
    { id: 'BANK_TRANSFER', label: 'Virement / Chèque', icon: Building, color: 'border-purple-500 bg-purple-50/50 text-purple-700', badge: 'Banque' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
          {recordedPayment ? (
            <div className="p-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-slate-900 text-xl">
                  Paiement Enregistré avec Succès !
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reçu N° <span className="font-bold text-slate-800">{recordedPayment.receiptNumber}</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Élève :</span>
                  <span className="font-bold text-slate-900">{recordedPayment.studentName} ({recordedPayment.className})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Montant :</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{formatFCFA(recordedPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode :</span>
                  <span className="font-semibold text-slate-800">{recordedPayment.method}</span>
                </div>
                {recordedPayment.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Réf Transaction :</span>
                    <span className="font-mono text-slate-700">{recordedPayment.transactionRef}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Modal de reçu reste ouvert
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le Reçu</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <h3 className="font-heading font-bold text-base">Enregistrer un Versement</h3>
                    <p className="text-[11px] text-emerald-100">Frais scolaires, cantine, transport, tenue</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800/40 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Élève Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sélectionner l'Élève :
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {students.map((s: Student) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.matricule}) — {s.className} — Reste: {formatFCFA(s.feeBalance)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info Card Élève */}
                {currentStudent && (
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        Parent : {currentStudent.parentName}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {currentStudent.parentPhone}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Solde Restant</div>
                      <div className={`font-extrabold text-sm ${currentStudent.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatFCFA(currentStudent.feeBalance)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Montant & Motif */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Montant Versé (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={5000}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Motif / Type de Frais *
                    </label>
                    <select
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Scolarité (Tranche 1)">Scolarité (Tranche 1)</option>
                      <option value="Scolarité (Tranche 2)">Scolarité (Tranche 2)</option>
                      <option value="Scolarité (Tranche 3)">Scolarité (Tranche 3)</option>
                      <option value="Frais d'Inscription">Frais d'Inscription</option>
                      <option value="Cantine Scolaire">Cantine Scolaire</option>
                      <option value="Transport Scolaire">Transport Scolaire</option>
                      <option value="Uniforme & Tenue">Uniforme & Tenue</option>
                    </select>
                  </div>
                </div>

                {/* Mode de Paiement */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Méthode d'Encaissement :
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMethod(m.id);
                          if (m.id === 'WAVE') setTransactionRef('WAV-SN-' + Math.floor(100000 + Math.random() * 900000));
                          else if (m.id === 'ORANGE_MONEY') setTransactionRef('OM-SN-' + Math.floor(100000 + Math.random() * 900000));
                          else if (m.id === 'BANK_TRANSFER') setTransactionRef('VIR-ECO-' + Math.floor(10000 + Math.random() * 90000));
                          else setTransactionRef('');
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                          method === m.id 
                            ? `${m.color} ring-2 ring-emerald-500 font-bold shadow-sm` 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <m.icon className="w-4 h-4" />
                          <span className="text-xs">{m.label.split(' ')[0]}</span>
                        </div>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-white/70 font-semibold border">
                          {m.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Réf Transaction si non-espèces */}
                {method !== 'CASH' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Numéro de Transaction ({method}) :
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="ex: WAV-SN-928174"
                      className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Note facultative */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Remarques / Notes internes :
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="ex: Validé par téléphone avec le père"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Encaisser {formatFCFA(amount)}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {recordedPayment && (
        <ReceiptModal
          isOpen={true}
          payment={recordedPayment}
          onClose={() => {
            setRecordedPayment(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
