'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatFCFA } from '@/lib/currency';
import { UserPlus, CheckCircle2, Clock, XCircle, Printer, Search, ArrowRight } from 'lucide-react';
import NewStudentModal from '@/components/modals/NewStudentModal';

interface EnrollmentCandidate {
  id: string;
  candidateName: string;
  birthDate: string;
  targetClass: string;
  parentName: string;
  parentPhone: string;
  status: 'DEMANDE' | 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE' | 'INSCRIT';
  applicationDate: string;
  previousSchool: string;
}

export default function EnrollmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<EnrollmentCandidate[]>([
    { id: 'enr-1', candidateName: 'Oumar Diagne', birthDate: '2011-03-24', targetClass: '6ème A', parentName: 'El Hadji Diagne', parentPhone: '+221 77 334 11 22', status: 'EN_ATTENTE', applicationDate: '2025-02-18', previousSchool: 'École Primaire Almadies 1' },
    { id: 'enr-2', candidateName: 'Ndeye Fatou Kane', birthDate: '2008-07-19', targetClass: '2nde S', parentName: 'Mamadou Kane', parentPhone: '+221 78 998 77 66', status: 'ACCEPTE', applicationDate: '2025-02-15', previousSchool: 'Collège Privé Sainte Marie' },
    { id: 'enr-3', candidateName: 'Saliou Mbaye', birthDate: '2013-11-02', targetClass: 'CM1 A', parentName: 'Khadidiatou Mbaye', parentPhone: '+221 76 112 33 44', status: 'DEMANDE', applicationDate: '2025-02-19', previousSchool: 'Groupe Scolaire Yoff' },
  ]);

  const updateCandidateStatus = (id: string, status: EnrollmentCandidate['status']) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admission & Recrutement</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Gestion des Inscriptions & Admissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation des dossiers de candidature, attribution de matricules et attestations
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Nouvelle Candidature</span>
        </button>
      </div>

      {/* Candidatures Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-heading font-bold text-sm text-slate-800">
          Demandes d'Admissions Récents ({candidates.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Candidat</th>
                <th className="p-4">Classe Sollicitée</th>
                <th className="p-4">Parent / Contact</th>
                <th className="p-4">École d'origine</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Décision / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-900">
                    <div>{c.candidateName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Né(e) le {c.birthDate}</div>
                  </td>
                  <td className="p-4 font-bold text-blue-700">{c.targetClass}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{c.parentName}</div>
                    <div className="text-[10px] text-slate-500">{c.parentPhone}</div>
                  </td>
                  <td className="p-4 text-slate-600">{c.previousSchool}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.status === 'ACCEPTE' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-800' :
                      c.status === 'REFUSE' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.status !== 'ACCEPTE' && (
                        <button
                          onClick={() => updateCandidateStatus(c.id, 'ACCEPTE')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition"
                        >
                          Accepter
                        </button>
                      )}
                      {c.status !== 'REFUSE' && (
                        <button
                          onClick={() => updateCandidateStatus(c.id, 'REFUSE')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-[10px] transition"
                        >
                          Refuser
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                        title="Imprimer certificat d'inscription"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <NewStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
