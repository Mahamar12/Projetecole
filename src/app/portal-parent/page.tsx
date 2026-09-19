'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student, AttendanceRecord, HomeworkItem } from '@/types';
import { formatFCFA } from '@/lib/currency';
import { 
  Users, Award, Clock, BookOpen, CreditCard, 
  Printer, Smartphone, CheckCircle2, ChevronRight, Calendar, X, MessageSquare 
} from 'lucide-react';
import NewPaymentModal from '@/components/payments/NewPaymentModal';
import ReportCardView from '@/components/documents/ReportCardView';

interface TeacherNotesForParent {
  teacherId: string;
  teacherName: string;
  photo: string;
  phone: string;
  subject: string;
  coeff: number;
  average: number;
  notesDevoirs: { title: string; score: number; max: number; date: string }[];
  notesExercices: { title: string; score: number; max: number; date: string }[];
  noteComposition: { title: string; score: number; max: number; date: string };
  appreciation: string;
}

export default function ParentPortalPage() {
  const { parents, students, currentParentChildId, setCurrentParentChildId, activeReportCard, homeworks, attendances, timetables, payments, subjects } = useApp();

  const currentParent = parents[0]; // M. Mamadou Diop
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'BULLETIN' | 'GRADES' | 'TIMETABLE' | 'PAYMENTS'>('BULLETIN');
  const [selectedTeacherNotes, setSelectedTeacherNotes] = useState<TeacherNotesForParent | null>(null);

  const selectedChild = students.find((s: Student) => s.id === currentParentChildId) || students[0];
  const childAttendances = attendances.filter((a: AttendanceRecord) => a.studentId === selectedChild.id);
  const childTimetable = timetables.filter((t: any) => t.className === selectedChild.className || t.classId === selectedChild.classId);
  const childPayments = payments.filter((p: any) => p.studentId === selectedChild.id);

  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];

  // List of subject teachers for the selected child with detailed grades
  const teacherSubjectData: TeacherNotesForParent[] = [
    {
      teacherId: 't-1',
      teacherName: 'M. Ibrahima Diallo',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+221 77 654 32 10',
      subject: 'Mathématiques',
      coeff: 4,
      average: selectedChild.className === '3ème A' ? 17.17 : 16.5,
      notesDevoirs: [
        { title: 'Devoir N°1 — Algèbre & Équations', score: 17, max: 20, date: '12 Oct 2024' },
        { title: 'Devoir N°2 — Théorème de Pythagore', score: 18, max: 20, date: '05 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Interrogation N°1 — Calcul vectoriel', score: 17.5, max: 20, date: '20 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 16.5, max: 20, date: '02 Déc 2024' },
      appreciation: `Excellentes compétences en mathématiques pour ${selectedChild.firstName}. Élève brillante et très disciplinée.`,
    },
    {
      teacherId: 't-2',
      teacherName: 'Mme Fatou Bintou Sow',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '+221 78 123 45 67',
      subject: 'Français & Littérature',
      coeff: 4,
      average: 15.50,
      notesDevoirs: [
        { title: 'Devoir de Rédaction — Expression Écrite', score: 15, max: 20, date: '15 Oct 2024' },
        { title: 'Contrôle de Grammaire & Conjugaison', score: 16, max: 20, date: '08 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Exposé Oral — Une si longue lettre', score: 16, max: 20, date: '25 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 15.5, max: 20, date: '03 Déc 2024' },
      appreciation: `Richesse de vocabulaire remarquable chez ${selectedChild.firstName}. Bonne participation aux débats en classe.`,
    },
    {
      teacherId: 't-3',
      teacherName: 'M. Cheikh Tidiane Sy',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+221 70 987 65 43',
      subject: 'Physique - Chimie',
      coeff: 3,
      average: 17.50,
      notesDevoirs: [
        { title: 'Devoir N°1 — Chimie Organique', score: 18, max: 20, date: '18 Oct 2024' },
        { title: 'Devoir N°2 — Électricité & Circuits', score: 17.5, max: 20, date: '12 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Travaux Pratiques en Laboratoire', score: 18, max: 20, date: '28 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 17.0, max: 20, date: '04 Déc 2024' },
      appreciation: `Esprit scientifique aiguisé. ${selectedChild.firstName} réussit parfaitement les manipulations de TP.`,
    },
    {
      teacherId: 't-5',
      teacherName: 'M. Ousmane Sembène',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '+221 77 345 67 89',
      subject: 'SVT (Sciences de la Vie)',
      coeff: 2,
      average: 15.83,
      notesDevoirs: [
        { title: 'Devoir de Géologie & Séismes', score: 16, max: 20, date: '14 Oct 2024' },
        { title: 'Schéma du Système Cardiaque', score: 15, max: 20, date: '10 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Interrogation Écrite — Biologie Végétale', score: 16, max: 20, date: '22 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 16.5, max: 20, date: '05 Déc 2024' },
      appreciation: `Bon travail d'ensemble. Conseils : approfondir encore les synthèses de cours.`,
    },
    {
      teacherId: 't-4',
      teacherName: 'Mme Mariama Ba',
      photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      phone: '+221 76 543 21 09',
      subject: 'Anglais',
      coeff: 2,
      average: 15.00,
      notesDevoirs: [
        { title: 'Reading Comprehension Test', score: 14, max: 20, date: '16 Oct 2024' },
        { title: 'Essay Writing — African Culture', score: 15, max: 20, date: '11 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Listening Comprehension & Vocabulary', score: 15, max: 20, date: '24 Oct 2024' },
      ],
      noteComposition: { title: 'First Term Examination', score: 16.0, max: 20, date: '06 Déc 2024' },
      appreciation: `Bonne aisance en anglais. ${selectedChild.firstName} participe spontanément en classe.`,
    },
    {
      teacherId: 't-6',
      teacherName: 'Mme Aminata Traoré',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+221 77 888 99 00',
      subject: 'Histoire - Géographie',
      coeff: 2,
      average: 16.50,
      notesDevoirs: [
        { title: 'Devoir d\'Histoire — L\'Afrique précoloniale', score: 16, max: 20, date: '19 Oct 2024' },
        { title: 'Cartographie & Climatologie', score: 16.5, max: 20, date: '14 Nov 2024' },
      ],
      notesExercices: [
        { title: 'Interrogation sur les Ressources Minières', score: 17, max: 20, date: '29 Oct 2024' },
      ],
      noteComposition: { title: 'Composition Trimestre 1', score: 17.0, max: 20, date: '07 Déc 2024' },
      appreciation: `Excellente culture générale. ${selectedChild.firstName} produit des copies très bien structurées.`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Parent */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-800/60 border border-rose-700 text-rose-300 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Espace Famille • Compte Tuteur Unique</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl">
            Bienvenue, M. {currentParent.firstName} {currentParent.lastName}
          </h1>
          <p className="text-xs sm:text-sm text-rose-200 mt-1">
            Suivi scolaire et financier en direct pour vos {currentParent.children.length} enfants scolarisés
          </p>
        </div>

        {/* Global Family Due */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right">
          <div className="text-[10px] uppercase font-bold text-rose-200">Solde Global Famille</div>
          <div className="font-heading font-black text-xl text-rose-300">
            {formatFCFA(currentParent.children.reduce((a: number, c: any) => a + c.feeBalance, 0))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Child Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {currentParent.children.map((c: any) => {
            const isSelected = c.id === currentParentChildId;
            return (
              <button
                key={c.id}
                onClick={() => setCurrentParentChildId(c.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition shrink-0 ${
                  isSelected
                    ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-400'
                    : 'bg-white/70 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <img
                  src={c.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'}
                  alt={c.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="text-left">
                  <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                  <div className="text-[11px] text-blue-700 font-semibold">{c.className} • {c.matricule}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Tabs for Parent */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
          <button
            onClick={() => setActiveTab('BULLETIN')}
            className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'BULLETIN' ? 'bg-rose-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-rose-400" />
            <span>Bulletin & Décision</span>
          </button>

          <button
            onClick={() => setActiveTab('GRADES')}
            className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'GRADES' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-200" />
            <span>Profs & Notes ({selectedChild.firstName})</span>
          </button>

          <button
            onClick={() => setActiveTab('TIMETABLE')}
            className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'TIMETABLE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-200" />
            <span>Emploi du Temps</span>
          </button>

          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`py-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'PAYMENTS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-200" />
            <span>Paiements & Wave/OM</span>
          </button>
        </div>

        {/* Selected Child KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 : Moyenne */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Moyenne Trimestre 1</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-heading font-black text-2xl text-blue-900">
              {selectedChild.averageGrade?.toFixed(2) || '16.40'} <span className="text-sm font-semibold text-slate-400">/ 20</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              ★ Rang : 1ère sur 29 élèves
            </div>
          </div>

          {/* Card 2 : Assiduité */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Présence & Assiduité</span>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-heading font-black text-2xl text-emerald-600">
              100 % Présent
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              0 absence non justifiée
            </div>
          </div>

          {/* Card 3 : Frais & Paiement Mobile */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Solde Scolarité</span>
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div className={`font-heading font-black text-2xl ${selectedChild.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {selectedChild.feeBalance > 0 ? formatFCFA(selectedChild.feeBalance) : 'Totalement Soldé'}
            </div>
            {selectedChild.feeBalance > 0 && (
              <button
                onClick={() => setIsPaymentOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition hover:scale-105"
              >
                <Smartphone className="w-4 h-4" />
                <span>Payer avec Wave / OM</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1 : BULLETIN & DÉCISION DE PASSAGE */}
        {activeTab === 'BULLETIN' && (
          <div className="space-y-6">
            {/* DECISION DE PASSAGE / ADMISSION OFFICIELLE */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg space-y-4 border border-emerald-500/30">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Délibération Annuelle du Conseil des Professeurs</span>
                  </div>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-emerald-200">
                    🎉 Décision de Passage : ADMIS(E) EN CLASSE SUPÉRIEURE
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    L'élève <strong>{selectedChild.firstName} {selectedChild.lastName}</strong> est officiellement promu(e) pour l'année scolaire 2025-2026.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-300">Classe de Destination</span>
                  <div className="font-heading font-black text-lg text-white">
                    {selectedChild.className === '3ème A' ? '2nde Scientifique (2nde S)' : selectedChild.className === '6ème A' ? '5ème A' : '6ème A (Collège)'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs leading-relaxed text-slate-200 italic flex items-center justify-between flex-wrap gap-3">
                <div>
                  « Excellents résultats annuels. Félicitations du conseil des professeurs pour la régularité du travail et la discipline. »
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer l'Attestation de Passage</span>
                </button>
              </div>
            </div>

            {/* Bulletin Viewer Embedded */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Bulletin de Notes Certifié — 1er Trimestre ({selectedChild.firstName})
                </h3>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer le Bulletin (A4)</span>
                </button>
              </div>
              <ReportCardView reportCard={activeReportCard} />
            </div>
          </div>
        )}

        {/* TAB 2 : NOTES ET PROFESSEURS DU PARENT */}
        {activeTab === 'GRADES' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Enseignants & Relevés de Notes — {selectedChild.firstName} {selectedChild.lastName} ({selectedChild.className})
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Consultez les notes publiées par chaque professeur de votre enfant et contactez-les directement
                  </p>
                </div>
                <span className="font-extrabold text-blue-900 text-xs bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                  {teacherSubjectData.length} Professeurs en {selectedChild.className}
                </span>
              </div>

              {/* Grid of Teacher Cards for Parent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherSubjectData.map((item) => (
                  <div
                    key={item.teacherId}
                    onClick={() => setSelectedTeacherNotes(item)}
                    className="bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-rose-500/50 hover:shadow-lg transition cursor-pointer group space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.photo}
                        alt={item.teacherName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-rose-900 transition">
                          {item.teacherName}
                        </div>
                        <div className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
                          <span>{item.subject}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded">
                            Coeff {item.coeff}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Moyenne {selectedChild.firstName}</span>
                        <span className="font-extrabold text-blue-900 text-base">{item.average.toFixed(2)} / 20</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 group-hover:translate-x-1 transition">
                        <span>Voir notes & contact</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL DETAILED NOTES PER TEACHER FOR PARENT */}
        {selectedTeacherNotes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTeacherNotes.photo}
                    alt={selectedTeacherNotes.teacherName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-500 shadow-md"
                  />
                  <div>
                    <div className="text-[10px] font-extrabold text-rose-800 uppercase bg-rose-50 px-2 py-0.5 rounded inline-block">
                      {selectedTeacherNotes.subject} • Coeff {selectedTeacherNotes.coeff}
                    </div>
                    <h3 className="font-heading font-black text-lg text-slate-900 mt-0.5">
                      {selectedTeacherNotes.teacherName}
                    </h3>
                    <p className="text-xs text-slate-500">Enseignant de {selectedChild.firstName} ({selectedChild.className})</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTeacherNotes(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subject Average Badge */}
              <div className="bg-gradient-to-r from-rose-900 via-purple-950 to-slate-900 rounded-2xl p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-200">Moyenne Actuelle de {selectedChild.firstName}</span>
                  <div className="font-heading font-black text-2xl text-rose-300">
                    {selectedTeacherNotes.average.toFixed(2)} <span className="text-xs text-slate-300">/ 20</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded font-bold">1er Trimestre</span>
                </div>
              </div>

              {/* Section 1 : Devoirs de classe */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>📝 Devoirs de Classe</span>
                  <span className="text-slate-400 text-[10px]">Transmis par le professeur</span>
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50 space-y-2">
                  {selectedTeacherNotes.notesDevoirs.map((n, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{n.title}</div>
                        <div className="text-[10px] text-slate-400">{n.date}</div>
                      </div>
                      <div className="font-extrabold text-blue-900 text-sm bg-white px-3 py-1 rounded-xl border border-slate-200">
                        {n.score} / {n.max}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2 : Interrogations & Exercices */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>✏️ Interrogations & Exercices</span>
                  <span className="text-slate-400 text-[10px]">Notes orales & TP</span>
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50 space-y-2">
                  {selectedTeacherNotes.notesExercices.map((n, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{n.title}</div>
                        <div className="text-[10px] text-slate-400">{n.date}</div>
                      </div>
                      <div className="font-extrabold text-blue-900 text-sm bg-white px-3 py-1 rounded-xl border border-slate-200">
                        {n.score} / {n.max}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3 : Composition Trimestrielle */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>📜 Composition du Trimestre</span>
                  <span className="text-rose-700 font-bold text-[10px]">Coeff {selectedTeacherNotes.coeff}</span>
                </h4>
                <div className="border border-rose-200 rounded-2xl p-3 bg-rose-50/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{selectedTeacherNotes.noteComposition.title}</div>
                    <div className="text-[10px] text-slate-500">{selectedTeacherNotes.noteComposition.date}</div>
                  </div>
                  <div className="font-black text-rose-900 text-base bg-white px-3 py-1 rounded-xl border border-rose-300">
                    {selectedTeacherNotes.noteComposition.score} / {selectedTeacherNotes.noteComposition.max}
                  </div>
                </div>
              </div>

              {/* Section 4 : Appréciation de l'Enseignant */}
              <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-2xl space-y-1 text-xs">
                <div className="font-bold text-rose-950 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-700" />
                  <span>Appréciation de {selectedTeacherNotes.teacherName} :</span>
                </div>
                <p className="text-slate-600 italic text-[11px] leading-relaxed">
                  « {selectedTeacherNotes.appreciation} »
                </p>
              </div>

              {/* Direct WhatsApp Contact Button for Parent */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedTeacherNotes.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Contacter {selectedTeacherNotes.teacherName} (WhatsApp)</span>
                </a>
                <button
                  onClick={() => setSelectedTeacherNotes(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 : EMPLOI DU TEMPS DU CHILD */}
        {activeTab === 'TIMETABLE' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Emploi du Temps Hebdomadaire — Classe de {selectedChild.className}
                </h3>
                <p className="text-slate-500 text-[11px]">Planning de cours et professeurs de {selectedChild.firstName}</p>
              </div>
              <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {days.map((d) => {
                const daySlots = childTimetable.filter((s: any) => s.dayOfWeek === d);
                return (
                  <div key={d} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                    <div className="font-heading font-black text-xs text-slate-800 uppercase border-b pb-1">
                      {d}
                    </div>
                    {daySlots.length > 0 ? (
                      daySlots.map((slot: any) => (
                        <div key={slot.id} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                          <div className="font-bold text-blue-900">{slot.subjectName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{slot.startTime} - {slot.endTime}</div>
                          <div className="text-[10px] text-slate-700 font-semibold">{slot.teacherName} • {slot.room}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-[11px] italic py-4 text-center">Pas de cours</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4 : PAIEMENTS & REÇUS */}
        {activeTab === 'PAYMENTS' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Historique des Versés & Reçus — {selectedChild.firstName}
                </h3>
                <p className="text-slate-500 text-[11px]">Suivi des frais de scolarité et paiements mobile money</p>
              </div>
              {selectedChild.feeBalance > 0 && (
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Régler avec Wave / OM</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {childPayments.length > 0 ? (
                childPayments.map((p: any) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900">{p.feeType}</div>
                      <div className="text-[10px] text-slate-400">Reçu : {p.receiptNumber} • {p.paidAt}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-600 text-sm">{formatFCFA(p.amount)}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {p.method}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 italic">Aucun versement enregistré à ce jour.</div>
              )}
            </div>
          </div>
        )}

        {/* Devoirs & Travail à la maison */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Devoirs et Exercices en Cours pour {selectedChild.firstName}
            </h3>
            <span className="text-xs font-bold text-slate-400">Classe de {selectedChild.className}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {homeworks.slice(0, 3).map((hw: HomeworkItem) => (
              <div key={hw.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-blue-700 uppercase text-[10px]">{hw.subjectName}</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">{hw.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{hw.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-rose-600">À rendre : {hw.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isPaymentOpen && (
        <NewPaymentModal
          isOpen={isPaymentOpen}
          defaultStudentId={selectedChild.id}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}
    </div>
  );
}
