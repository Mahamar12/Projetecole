'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student } from '@/types';
import { FileText, Printer, Download, CheckCircle2, ShieldCheck, Search } from 'lucide-react';

export default function OfficialDocumentsPage() {
  const { currentSchool, students } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState('stu-1');
  const [documentType, setDocumentType] = useState('CERTIFICAT_SCOLARITE');

  const student = students.find((s: Student) => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Secrétariat & Administration</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Documents Officiels & Certificats
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Génération automatique de certificats de scolarité, attestations de fréquentation et reçus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {students.map((s: Student) => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.className})</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Document</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Preview */}
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl printable-page max-w-3xl mx-auto text-slate-900 font-sans space-y-6">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            RÉPUBLIQUE DU SÉNÉGAL • MINISTÈRE DE L'ÉDUCATION NATIONALE
          </div>
          <div className="font-heading font-black text-xl text-blue-900 uppercase mt-2">
            {currentSchool.name}
          </div>
          <div className="text-xs text-slate-500 italic mt-0.5">« {currentSchool.slogan} »</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {currentSchool.address} • {currentSchool.city} • Tél: {currentSchool.phone}
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center py-4">
          <div className="inline-block px-6 py-2 bg-slate-900 text-white font-heading font-black text-sm uppercase tracking-widest rounded-xl shadow-sm">
            CERTIFICAT DE SCOLARITÉ
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1">N° CERT-2024-{student?.matricule.split('-')[2] || '001'}</div>
        </div>

        {/* Body Text */}
        <div className="text-xs leading-loose text-slate-800 space-y-4 px-4 text-justify">
          <p>
            Le Directeur de l'établissement soussigné, atteste par la présente que l'élève :
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 my-2">
            <div>Nom et Prénom : <strong className="text-slate-900 text-sm">{student?.firstName} {student?.lastName}</strong></div>
            <div>Matricule Officiel : <strong className="font-mono text-blue-700">{student?.matricule}</strong></div>
            <div>Date et Lieu de Naissance : <strong className="text-slate-900">{student?.birthDate} à {student?.birthPlace}</strong></div>
            <div>Nationalité : <strong className="text-slate-900">{student?.nationality}</strong></div>
          </div>
          <p>
            Est régulièrement inscrit(e) au sein de notre établissement pour l'année scolaire <strong>2024 - 2025</strong> en classe de <strong className="text-blue-900 text-sm">{student?.className}</strong>.
          </p>
          <p>
            En foi de quoi, ce certificat lui est délivré pour servir et valoir ce que de droit.
          </p>
        </div>

        {/* Date & Signature */}
        <div className="pt-8 flex items-end justify-between px-4">
          <div className="text-[11px] text-slate-500">
            Fait à Dakar, le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          <div className="text-center">
            <div className="text-xs font-bold text-slate-800 uppercase">Le Directeur Général</div>
            <div className="h-16 flex flex-col items-center justify-center relative mt-1">
              <div className="text-[9px] text-blue-900 font-bold border-2 border-blue-900 px-3 py-1 rounded rotate-[-4deg] bg-blue-50/60 uppercase">
                Vu & Certifié Conforme • EIS DAKAR
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">M. Amadou Diallo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
