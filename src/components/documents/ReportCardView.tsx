'use client';

import React from 'react';
import { ReportCard } from '@/types';
import { useApp } from '@/context/AppContext';
import { getMention, getRankSuffix } from '@/lib/grading';
import { Printer, Download, Award, CheckCircle2, QrCode } from 'lucide-react';

interface ReportCardViewProps {
  reportCard: ReportCard;
}

export default function ReportCardView({ reportCard }: ReportCardViewProps) {
  const { currentSchool } = useApp();
  const mention = getMention(reportCard.generalAverage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar (No Print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-heading font-bold text-slate-900 text-sm">
            Bulletin Scolaire Officiel — {reportCard.term.replace('_', ' ')}
          </h3>
          <p className="text-xs text-slate-500">
            Élève : <span className="font-semibold text-slate-800">{reportCard.studentName}</span> ({reportCard.className}) • Année : {reportCard.academicYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Bulletin (A4)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 formatting) */}
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl printable-page printable-bulletin max-w-4xl mx-auto text-slate-900 font-sans">
        {/* Republic / Official Header */}
        <div className="text-center text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-200 pb-2 mb-4">
          RÉPUBLIQUE DU SÉNÉGAL • MINISTÈRE DE L'ÉDUCATION NATIONALE • ENSEIGNEMENT PRIVÉ LAÏC
        </div>

        {/* School Header & Student Badge */}
        <div className="grid grid-cols-3 items-center border-b-2 border-slate-900 pb-4 mb-5 gap-4">
          {/* Left: School Info */}
          <div>
            <div className="font-heading font-extrabold text-blue-900 text-base leading-tight uppercase">
              {currentSchool.name}
            </div>
            <div className="text-[11px] text-slate-600 font-medium italic mt-0.5">
              « {currentSchool.slogan} »
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {currentSchool.address} • {currentSchool.city}
            </div>
            <div className="text-[10px] text-slate-500">
              Tél : {currentSchool.phone}
            </div>
          </div>

          {/* Center: Official Title */}
          <div className="text-center">
            <div className="inline-block px-4 py-1.5 bg-blue-900 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm">
              BULLETIN DE NOTES
            </div>
            <div className="font-bold text-xs text-slate-800 mt-1 uppercase">
              {reportCard.term === 'TRIMESTRE_1' ? '1er TRIMESTRE' : reportCard.term === 'TRIMESTRE_2' ? '2ème TRIMESTRE' : '3ème TRIMESTRE'}
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Année Scolaire {reportCard.academicYear}
            </div>
          </div>

          {/* Right: Student Summary Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-0.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500 text-[10px]">Nom & Prénom :</span>
              <span className="font-extrabold text-slate-900">{reportCard.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[10px]">Matricule :</span>
              <span className="font-mono font-bold text-slate-700">{reportCard.matricule}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[10px]">Classe :</span>
              <span className="font-bold text-blue-700">{reportCard.className}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[10px]">Effectif :</span>
              <span className="font-semibold text-slate-800">{reportCard.totalStudents} élèves</span>
            </div>
          </div>
        </div>

        {/* Subjects & Marks Table */}
        <div className="border border-slate-300 rounded-xl overflow-hidden mb-5">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-2.5">Matières & Enseignants</th>
                <th className="p-2.5 text-center">Coeff</th>
                <th className="p-2.5 text-center">Notes /20</th>
                <th className="p-2.5 text-center">Moy /20</th>
                <th className="p-2.5 text-center">Moy × Coeff</th>
                <th className="p-2.5 text-center">Moy Classe</th>
                <th className="p-2.5 text-center">Rang</th>
                <th className="p-2.5">Appréciation de l'Enseignant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportCard.subjects.map((sub, idx) => {
                const weighted = (sub.average * sub.coeff).toFixed(2);
                return (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-900">{sub.subjectName}</div>
                      <div className="text-[10px] text-slate-500">{sub.teacherName}</div>
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-700">{sub.coeff}</td>
                    <td className="p-2.5 text-center font-mono text-[11px] text-slate-600">
                      {sub.grades.join(' • ')}
                    </td>
                    <td className="p-2.5 text-center font-black text-blue-900 text-xs">
                      {sub.average.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-800">
                      {weighted}
                    </td>
                    <td className="p-2.5 text-center text-slate-500 font-medium">
                      {sub.classAverage.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-800">
                      {getRankSuffix(sub.rank)}
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600 italic">
                      {sub.appreciation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Synthesis & Key Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Moyenne & Rang */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center space-y-1">
            <div className="text-[10px] uppercase font-extrabold text-blue-700 tracking-wider">
              Moyenne Générale
            </div>
            <div className="font-heading font-black text-3xl text-blue-950">
              {reportCard.generalAverage.toFixed(2)} <span className="text-sm font-semibold text-slate-500">/ 20</span>
            </div>
            <div className="text-xs font-bold text-blue-800 pt-1 border-t border-blue-200/80">
              Rang : <span className="text-emerald-700 text-sm">{getRankSuffix(reportCard.rank)}</span> sur {reportCard.totalStudents} élèves
            </div>
          </div>

          {/* Stats Classe & Absences */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
              Statistiques & Assiduité
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Coefficients :</span>
              <span className="font-bold text-slate-900">{reportCard.totalCoeff}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Points Obtenus :</span>
              <span className="font-bold text-slate-900">{reportCard.totalPoints}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Moyenne de la Classe :</span>
              <span className="font-bold text-slate-900">{reportCard.classAverage.toFixed(2)} / 20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Absences injustifiées :</span>
              <span className={`font-bold ${reportCard.unjustifiedAbsencesCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {reportCard.unjustifiedAbsencesCount} heure(s)
              </span>
            </div>
          </div>

          {/* Mention & Distinctions */}
          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center flex flex-col justify-center space-y-1">
            <div className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider">
              Mention & Décision du Conseil
            </div>
            <div className="font-heading font-black text-xl text-emerald-900">
              {mention.label}
            </div>
            <div className="text-[11px] font-bold text-emerald-800 bg-white/80 py-1 px-2 rounded-lg border border-emerald-300">
              ★ TABLEAU D'HONNEUR ★
            </div>
          </div>
        </div>

        {/* Conseil de classe & Signatures */}
        <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50/50 mb-5">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
            Appréciation Globale du Conseil de Classe :
          </div>
          <p className="text-xs font-semibold text-slate-800 italic leading-relaxed">
            « {reportCard.appreciation} »
          </p>
        </div>

        {/* Footer Signatures */}
        <div className="grid grid-cols-3 text-center text-xs pt-3 border-t-2 border-slate-900">
          <div>
            <div className="font-bold text-slate-700 uppercase text-[11px]">Le Professeur Principal</div>
            <div className="h-16 flex items-center justify-center italic text-slate-400 text-[10px]">
              M. Ibrahima Diallo
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-700 uppercase text-[11px]">Visa des Parents</div>
            <div className="h-16 flex items-center justify-center text-slate-400 text-[10px] italic border-b border-dashed border-slate-300 mx-6">
              (Signature et Date)
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-700 uppercase text-[11px]">Le Directeur des Études</div>
            <div className="h-16 flex flex-col items-center justify-center relative">
              <div className="text-[9px] text-blue-900 font-bold border border-blue-900 px-2 py-0.5 rounded rotate-[-4deg] bg-blue-50/70 uppercase">
                Vu et Approuvé • EIS DAKAR
              </div>
              <div className="text-[10px] font-bold text-slate-800 mt-1">M. Amadou Diallo</div>
            </div>
          </div>
        </div>

        {/* Footer security notes */}
        <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
          <div>Document officiel généré par la plateforme SaaS EduGestion Africa • ID: BUL-2024-0012-T1</div>
          <div className="flex items-center gap-1 font-mono">
            <span>Code d'authentification : SN-EIS-9941</span>
          </div>
        </div>
      </div>
    </div>
  );
}
