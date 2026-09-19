'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, Classroom } from '@/types';
import { formatFCFA } from '@/lib/currency';
import { 
  Users, Search, Filter, UserPlus, Download, 
  Printer, Phone, MessageSquare, Edit3, Trash2, 
  Eye, CheckCircle2, AlertCircle, X, ShieldAlert, HeartPulse, FileText, Calendar 
} from 'lucide-react';
import Link from 'next/link';
import NewStudentModal from '@/components/modals/NewStudentModal';
import NewPaymentModal from '@/components/payments/NewPaymentModal';

export default function StudentsManagementPage() {
  const { students, classes, deleteStudent } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);
  const [selectedStudentDossier, setSelectedStudentDossier] = useState<Student | null>(null);
  const [studentToPayFor, setStudentToPayFor] = useState<string | null>(null);

  // Filter students
  const filteredStudents = students.filter((s: Student) => {
    const matchSearch = 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentPhone.includes(searchTerm);

    const matchClass = selectedClass === 'ALL' || s.className === selectedClass || s.classId === selectedClass;
    const matchGender = selectedGender === 'ALL' || s.gender === selectedGender;

    return matchSearch && matchClass && matchGender;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Gestion Scolaire & Effectifs</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Répertoire des Élèves ({students.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossiers individuels, matricules automatiques, situation financière et fiches d'inscription
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Liste</span>
          </button>
          <button
            onClick={() => setIsNewStudentOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Inscrire un Élève</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, matricule, parent ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Class */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full md:w-48 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Toutes les classes</option>
          {classes.map((c: Classroom) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* Filter Gender */}
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="w-full md:w-36 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Tous genres</option>
          <option value="MALE">Garçons</option>
          <option value="FEMALE">Filles</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève & Matricule</th>
                <th className="p-4">Classe</th>
                <th className="p-4">Parent / Tuteur</th>
                <th className="p-4 text-center">Moyenne</th>
                <th className="p-4 text-right">Frais & Solde</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s: Student) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  {/* Photo, Name & Matricule */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.photo || 'https://api.dicebear.com/7.x/initials/svg?seed=' + s.firstName}
                        alt={s.firstName}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {s.firstName} {s.lastName}
                        </div>
                        <div className="font-mono text-[10px] text-blue-600 font-semibold">
                          {s.matricule}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="p-4 font-bold text-slate-800">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs">
                      {s.className}
                    </span>
                  </td>

                  {/* Parent */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{s.parentName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {s.parentPhone}
                    </div>
                  </td>

                  {/* Moyenne */}
                  <td className="p-4 text-center">
                    <span className="font-black text-slate-900 text-xs px-2 py-0.5 rounded-lg bg-slate-100">
                      {s.averageGrade?.toFixed(1) || '14.0'} / 20
                    </span>
                  </td>

                  {/* Frais & Solde */}
                  <td className="p-4 text-right">
                    <div className={`font-black text-xs ${s.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {s.feeBalance > 0 ? `Reste: ${formatFCFA(s.feeBalance)}` : 'Soldé (0 FCFA)'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Total: {formatFCFA(s.totalFees)}
                    </div>
                  </td>

                  {/* Statut */}
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Inscrit
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedStudentDossier(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Voir le dossier complet"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {s.feeBalance > 0 && (
                        <button
                          onClick={() => setStudentToPayFor(s.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition"
                        >
                          Encaisser
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Supprimer l'élève ${s.firstName} ${s.lastName} ?`)) {
                            deleteStudent(s.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Modal */}
      {selectedStudentDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedStudentDossier(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentDossier.photo || 'https://api.dicebear.com/7.x/initials/svg?seed=' + selectedStudentDossier.firstName}
                  alt={selectedStudentDossier.firstName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
                />
                <div>
                  <h3 className="font-heading font-bold text-lg">{selectedStudentDossier.firstName} {selectedStudentDossier.lastName}</h3>
                  <div className="font-mono text-xs text-blue-200">{selectedStudentDossier.matricule} • Classe : {selectedStudentDossier.className}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDossier(null)}
                className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Date de Naissance</span>
                  <div className="font-semibold text-slate-800">{selectedStudentDossier.birthDate} ({selectedStudentDossier.birthPlace})</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Nationalité</span>
                  <div className="font-semibold text-slate-800">{selectedStudentDossier.nationality}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Groupe Sanguin</span>
                  <div className="font-bold text-rose-600">{selectedStudentDossier.bloodGroup || 'O+'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Situation Médicale</span>
                  <div className="text-slate-700">{selectedStudentDossier.medicalNotes || 'Aucune allergie'}</div>
                </div>
              </div>

              {/* Responsable Légal */}
              <div className="p-4 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] uppercase font-bold text-blue-800">Responsable / Tuteur</div>
                <div className="font-extrabold text-slate-900 text-sm">{selectedStudentDossier.parentName} ({selectedStudentDossier.relationship})</div>
                <div className="flex items-center gap-3 text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedStudentDossier.parentPhone}
                  </span>
                  <span>•</span>
                  <span>{selectedStudentDossier.address}</span>
                </div>
              </div>

              {/* Situation Financière */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Scolarité Annuelle</div>
                  <div className="font-extrabold text-slate-900 text-sm">{formatFCFA(selectedStudentDossier.totalFees)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Solde Restant</div>
                  <div className={`font-black text-sm ${selectedStudentDossier.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatFCFA(selectedStudentDossier.feeBalance)}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  href="/dashboard/timetable"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Emploi du Temps ({selectedStudentDossier.className})</span>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer Fiche</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isNewStudentOpen && (
        <NewStudentModal isOpen={isNewStudentOpen} onClose={() => setIsNewStudentOpen(false)} />
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
